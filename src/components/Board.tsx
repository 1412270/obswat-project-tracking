import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  DeleteOutline as DeleteIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useApp } from '../context/AppContext';
import { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { SortableTaskCard } from './SortableTaskCard';

export const Board: React.FC = () => {
  const { state, dispatch } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [columnTitle, setColumnTitle] = useState('');
  const [columnToDelete, setColumnToDelete] = useState<{ id: string; title: string } | null>(
    null
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByStatus = (status: Status): Task[] => {
    return state.tasks.filter(
      (task) => task.status === status && task.location === 'currentSprint'
    );
  };

  const buildColumnId = (title: string): string => {
    const cleaned = title.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
    return cleaned || 'COLUMN';
  };

  const ensureUniqueColumnId = (baseId: string): string => {
    const existingIds = new Set(state.boardColumns.map((column) => column.id));
    let uniqueId = baseId;
    let index = 1;
    while (existingIds.has(uniqueId)) {
      uniqueId = `${baseId}_${index}`;
      index += 1;
    }
    return uniqueId;
  };

  // Get current sprint with fallback
  const currentSprint = state.currentSprint || {
    id: '1',
    name: 'Sprint 1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  };

  // Get all tasks in current sprint
  const currentSprintTasks = state.tasks.filter(
    (task) => task.location === 'currentSprint'
  );

  // Calculate sprint statistics
  const totalTasks = currentSprintTasks.length;
  const totalStoryPoints = currentSprintTasks.reduce(
    (sum, task) => sum + task.storyPoints,
    0
  );
  const tasksByStatus = state.boardColumns.reduce<Record<string, number>>((acc, column) => {
    acc[column.id] = getTasksByStatus(column.id).length;
    return acc;
  }, {});

  const getColumnChipColor = (columnId: string) => {
    if (columnId === 'IN_PROGRESS') return 'warning';
    if (columnId === 'DONE') return 'success';
    if (columnId === 'TO_DO') return 'default';
    return 'default';
  };

  // Format dates
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const type = event.active.data.current?.type;
    if (type === 'task') {
      setActiveId(event.active.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeType = active.data.current?.type;
    if (activeType === 'column') {
      const activeColumnId = active.data.current?.columnId as string | undefined;
      const overColumnId =
        (over.data.current?.columnId as string | undefined) ??
        (typeof over.id === 'string' && over.id.startsWith('column-')
          ? over.id.replace('column-', '')
          : undefined);
      if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;
      const oldIndex = state.boardColumns.findIndex((column) => column.id === activeColumnId);
      const newIndex = state.boardColumns.findIndex((column) => column.id === overColumnId);
      if (oldIndex === -1 || newIndex === -1) return;
      dispatch({
        type: 'REORDER_BOARD_COLUMNS',
        payload: arrayMove(state.boardColumns, oldIndex, newIndex),
      });
      return;
    }

    if (activeType === 'task') {
      const taskId = active.id as string;
      const newStatus =
        (over.data.current?.columnId as Status | undefined) ??
        (typeof over.id === 'string' && over.id.startsWith('column-')
          ? (over.id.replace('column-', '') as Status)
          : (over.id as Status));

      if (state.boardColumns.some((column) => column.id === newStatus)) {
        dispatch({
          type: 'UPDATE_TASK_STATUS',
          payload: { id: taskId, status: newStatus },
        });
      }
    }
  };

  const handleAddColumn = () => {
    const trimmedTitle = columnTitle.trim();
    if (!trimmedTitle) return;
    const baseId = buildColumnId(trimmedTitle);
    const id = ensureUniqueColumnId(baseId);
    dispatch({ type: 'ADD_BOARD_COLUMN', payload: { id, title: trimmedTitle } });
    setColumnTitle('');
    setAddColumnOpen(false);
  };

  const handleCloseAddColumn = () => {
    setAddColumnOpen(false);
    setColumnTitle('');
  };

  const handleRemoveColumn = (columnId: string) => {
    if (state.boardColumns.length <= 1) return;
    dispatch({ type: 'REMOVE_BOARD_COLUMN', payload: { id: columnId } });
  };

  const handleRequestDeleteColumn = (columnId: string, title: string) => {
    if (state.boardColumns.length <= 1) return;
    setColumnToDelete({ id: columnId, title });
  };

  const handleConfirmDeleteColumn = () => {
    if (!columnToDelete) return;
    handleRemoveColumn(columnToDelete.id);
    setColumnToDelete(null);
  };

  const activeTask = activeId
    ? state.tasks.find((t) => t.id === activeId)
    : null;

  const DroppableColumn = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
      id,
      data: { type: 'column-tasks', columnId: id },
    });
    return (
      <Box
        ref={setNodeRef}
        sx={{
          bgcolor: isOver ? 'action.selected' : 'background.paper',
          transition: 'background-color 0.2s',
          minHeight: 300,
          p: 1,
          borderRadius: 1,
        }}
      >
        {children}
      </Box>
    );
  };

  const SortableBoardColumn = ({
    columnId,
    title,
    count,
    children,
  }: {
    columnId: string;
    title: string;
    count: number;
    children: React.ReactNode;
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: `column-${columnId}`,
      data: { type: 'column', columnId },
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.7 : 1,
    };

    return (
      <Box
        ref={setNodeRef}
        style={style}
        sx={{ flex: '0 0 320px', minWidth: 320 }}
      >
        <Paper
          sx={{
            p: 2,
            minHeight: 400,
            bgcolor: 'background.default',
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip title="Drag column">
                <IconButton size="small" {...attributes} {...listeners}>
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography variant="h6">
                {title} ({count})
              </Typography>
            </Box>
            <Tooltip
              title={
                state.boardColumns.length <= 1
                  ? 'At least one column is required'
                  : 'Remove column'
              }
            >
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleRequestDeleteColumn(columnId, title)}
                  disabled={state.boardColumns.length <= 1}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
          <Box sx={{ mt: 2 }}>
            <DroppableColumn id={columnId}>{children}</DroppableColumn>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">{currentSprint.name}</Typography>
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddColumnOpen(true)}
              >
                Add Column
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Task
              </Button>
            </Box>
          </Box>

          {/* Sprint Summary */}
          <Paper
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box display="flex" flexWrap="wrap" gap={2} mt={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {totalTasks}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Story Points
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {totalStoryPoints}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date Range
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {formatDate(currentSprint.startDate)} → {formatDate(currentSprint.endDate)}
                </Typography>
              </Box>
              <Box sx={{ ml: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
                {state.boardColumns.map((column) => (
                  <Chip
                    key={column.id}
                    label={`${column.title}: ${tasksByStatus[column.id] ?? 0}`}
                    size="small"
                    color={getColumnChipColor(column.id)}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          <SortableContext
            items={state.boardColumns.map((column) => `column-${column.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
              {state.boardColumns.map((column) => {
                const columnTasks = getTasksByStatus(column.id);
                return (
                  <SortableBoardColumn
                    key={column.id}
                    columnId={column.id}
                    title={column.title}
                    count={columnTasks.length}
                  >
                    <SortableContext
                      items={columnTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {columnTasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} />
                      ))}
                    </SortableContext>
                    {columnTasks.length === 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mt: 4 }}
                      >
                        No tasks
                      </Typography>
                    )}
                  </SortableBoardColumn>
                );
              })}
            </Box>
          </SortableContext>
        </Box>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} showDescription /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <Dialog open={addColumnOpen} onClose={handleCloseAddColumn} maxWidth="xs" fullWidth>
        <DialogTitle>Add Column</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Column Name"
            fullWidth
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddColumn}>Cancel</Button>
          <Button onClick={handleAddColumn} variant="contained" disabled={!columnTitle.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(columnToDelete)}
        onClose={() => setColumnToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete column?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will delete "{columnToDelete?.title}" and move its tasks to the first column.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColumnToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDeleteColumn}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

