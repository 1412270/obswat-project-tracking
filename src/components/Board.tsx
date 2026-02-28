import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5">Kanban Board</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateModalOpen(true)}
            >
              Create Task
            </Button>
          </Box>

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

