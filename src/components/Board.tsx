import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useApp } from '../context/AppContext';
import { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { SortableTaskCard } from './SortableTaskCard';

const columns: { id: Status; title: string }[] = [
  { id: 'TO_DO', title: 'TO DO' },
  { id: 'IN_PROGRESS', title: 'IN PROGRESS' },
  { id: 'DONE', title: 'DONE' },
];

export const Board: React.FC = () => {
  const { state, dispatch } = useApp();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

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
  const tasksByStatus = {
    TO_DO: getTasksByStatus('TO_DO').length,
    IN_PROGRESS: getTasksByStatus('IN_PROGRESS').length,
    DONE: getTasksByStatus('DONE').length,
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
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    if (['TO_DO', 'IN_PROGRESS', 'DONE'].includes(newStatus)) {
      dispatch({
        type: 'UPDATE_TASK_STATUS',
        payload: { id: taskId, status: newStatus },
      });
    }
  };

  const activeTask = activeId
    ? state.tasks.find((t) => t.id === activeId)
    : null;

  const DroppableColumn = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Task
            </Button>
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
                <Chip
                  label={`TO DO: ${tasksByStatus.TO_DO}`}
                  size="small"
                  color="default"
                  variant="outlined"
                />
                <Chip
                  label={`IN PROGRESS: ${tasksByStatus.IN_PROGRESS}`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`DONE: ${tasksByStatus.DONE}`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={2}>
            {columns.map((column) => {
              const columnTasks = getTasksByStatus(column.id);
              return (
                <Grid item xs={12} md={4} key={column.id}>
                  <Paper
                    sx={{
                      p: 2,
                      minHeight: 400,
                      bgcolor: 'background.default',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {column.title} ({columnTasks.length})
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <DroppableColumn id={column.id}>
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
                      </DroppableColumn>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} showDescription /> : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

