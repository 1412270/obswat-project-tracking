import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { alpha, Theme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { Task, Priority, Status } from '../types';
import { TAG_COLORS } from '../constants';
import { useApp } from '../context/AppContext';

interface TaskCardProps {
  task: Task;
  showDescription?: boolean;
  onUpdate?: (task: Task) => void;
}

const priorityColors: Record<Priority, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

const getInitials = (name: string): string => {
  const cleanedName = name.trim();
  if (!cleanedName) {
    return '?';
  }
  return cleanedName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatStatus = (status: string): string => {
  return status.replace('_', ' ');
};

const getTagColor = (tag: string, theme: Theme): string => {
  return TAG_COLORS[tag] ?? theme.palette.primary.main;
};

const statusPalette: Record<string, 'info' | 'warning' | 'success'> = {
  TO_DO: 'info',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

const getSubtaskStatusSx = (status: Status) => (theme: Theme) => {
  const paletteKey = statusPalette[status] ?? 'info';
  const main = theme.palette[paletteKey].main;
  return {
    color: alpha(main, 0.85),
    borderColor: alpha(main, 0.45),
    bgcolor: alpha(main, 0.08),
    fontSize: '0.65rem',
    height: '20px',
  };
};

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showDescription = false,
  onUpdate,
}) => {
  const { dispatch } = useApp();
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const assigneeNames =
    task.assignees && task.assignees.length > 0 ? task.assignees.join(', ') : 'Unassigned';
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate(task);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
    setDeleteOpen(false);
  };

  return (
    <>
      <Card
        sx={{
          mb: 1,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      >
        <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
            {task.id}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {onUpdate && (
              <IconButton
                size="small"
                onClick={handleUpdateClick}
                sx={{
                  padding: '4px',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onUpdate && (
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    padding: '4px',
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Chip
              label={task.priority}
              color={priorityColors[task.priority]}
              size="small"
            />
          </Box>
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {task.title}
        </Typography>
        {showDescription && task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}
        {task.tags && task.tags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
            {task.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                sx={(theme) => ({
                  fontSize: '0.7rem',
                  height: '20px',
                  borderColor: getTagColor(tag, theme),
                  color: getTagColor(tag, theme),
                })}
              />
            ))}
          </Box>
        )}
        {task.dueDate && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <EventIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              Due: {formatDate(task.dueDate)}
            </Typography>
          </Box>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" gap={0.5}>
              {task.assignees && task.assignees.length > 0 ? (
                task.assignees.map((assignee) => (
                  <Tooltip key={assignee} title={assignee}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {getInitials(assignee)}
                    </Avatar>
                  </Tooltip>
                ))
              ) : (
                <Tooltip title="Unassigned">
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>?</Avatar>
                </Tooltip>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {assigneeNames}
            </Typography>
          </Box>
          <Chip
            label={`${task.storyPoints} SP`}
            size="small"
            variant="outlined"
          />
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
          <Button
            size="small"
            onClick={() => setShowSubtasks((prev) => !prev)}
            disabled={!hasSubtasks}
            startIcon={showSubtasks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showSubtasks ? 'Hide subtasks' : 'Show subtasks'}
            {hasSubtasks ? ` (${task.subtasks.length})` : ''}
          </Button>
        </Box>
        {showSubtasks && hasSubtasks && (
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {task.subtasks.map((subtask) => (
              <Box
                key={subtask.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" gap={1}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {subtask.name || 'Untitled subtask'}
                  </Typography>
                  <Chip
                    label={formatStatus(subtask.status)}
                    size="small"
                    variant="outlined"
                    sx={getSubtaskStatusSx(subtask.status)}
                  />
                </Box>
                {subtask.assignees.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {subtask.assignees.map((assignee) => (
                      <Chip
                        key={assignee}
                        label={assignee}
                        size="small"
                        sx={{ fontSize: '0.65rem', height: '20px' }}
                      />
                    ))}
                  </Box>
                )}
                {subtask.tags.length > 0 && (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {subtask.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={(theme) => ({
                          fontSize: '0.65rem',
                          height: '20px',
                          borderColor: alpha(getTagColor(tag, theme), 0.4),
                          color: alpha(getTagColor(tag, theme), 0.7),
                        })}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
        </CardContent>
      </Card>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete task?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            This will permanently delete "{task.title}". This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

