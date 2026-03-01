import React, { useState } from 'react';
import {
  Box,
  Typography,
  Collapse,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
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
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useApp } from '../context/AppContext';
import { BacklogTaskCard } from './BacklogTaskCard';
import { SortableBacklogTask } from './SortableBacklogTask';

export const Backlog: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentSprintOpen, setCurrentSprintOpen] = useState(true);
  const [backlogOpen, setBacklogOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const currentSprintTasks = state.tasks.filter(
    (task) => task.location === 'currentSprint'
  );
  const backlogTasks = state.tasks.filter((task) => task.location === 'backlog');

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = state.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const overId = over.id as string;

    // Moving from backlog to current sprint
    if (task.location === 'backlog' && overId === 'currentSprint') {
      dispatch({ type: 'MOVE_TASK_TO_SPRINT', payload: taskId });
    }
    // Moving from current sprint to backlog
    else if (task.location === 'currentSprint' && overId === 'backlog') {
      dispatch({ type: 'MOVE_TASK_TO_BACKLOG', payload: taskId });
    }
  };

  const DroppableArea = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <Box
        ref={setNodeRef}
        sx={{
          bgcolor: isOver ? 'action.selected' : 'background.paper',
          transition: 'background-color 0.2s',
        }}
      >
        {children}
      </Box>
    );
  };

  const activeTask = activeId
    ? state.tasks.find((t) => t.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'background.default',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setCurrentSprintOpen(!currentSprintOpen)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6">Current Sprint</Typography>
            <IconButton size="small">
              {currentSprintOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={currentSprintOpen}>
            <DroppableArea id="currentSprint">
              <Box
                sx={{
                  mt: 2,
                  minHeight: 100,
                  p: 2,
                  borderRadius: 1,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                {currentSprintTasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Drop tasks here from Backlog
                  </Typography>
                ) : (
                  <SortableContext
                    items={currentSprintTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentSprintTasks.map((task) => (
                      <SortableBacklogTask key={task.id} task={task} />
                    ))}
                  </SortableContext>
                )}
              </Box>
            </DroppableArea>
          </Collapse>
        </Paper>

        <Paper
          sx={{
            p: 2,
            bgcolor: 'background.default',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => setBacklogOpen(!backlogOpen)}
            sx={{ cursor: 'pointer' }}
          >
            <Typography variant="h6">Backlog</Typography>
            <IconButton size="small">
              {backlogOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={backlogOpen}>
            <DroppableArea id="backlog">
              <Box
                sx={{
                  mt: 2,
                  minHeight: 100,
                  p: 2,
                  borderRadius: 1,
                  border: '2px dashed',
                  borderColor: 'divider',
                }}
              >
                {backlogTasks.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No tasks in backlog
                  </Typography>
                ) : (
                  <SortableContext
                    items={backlogTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {backlogTasks.map((task) => (
                      <SortableBacklogTask key={task.id} task={task} />
                    ))}
                  </SortableContext>
                )}
              </Box>
            </DroppableArea>
          </Collapse>
        </Paper>
      </Box>

      <DragOverlay>
        {activeTask ? <BacklogTaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
};

