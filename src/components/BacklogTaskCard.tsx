import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  Edit as EditIcon,
  Event as EventIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { Task, Priority } from '../types';
import { TAG_COLORS } from '../constants';
import { useApp } from '../context/AppContext';

interface BacklogTaskCardProps {
  task: Task;
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

const getTagColor = (tag: string, theme: Theme): string => {
  return TAG_COLORS[tag] ?? theme.palette.primary.main;
};

export const BacklogTaskCard: React.FC<BacklogTaskCardProps> = ({ task, onUpdate }) => {
  const { dispatch } = useApp();
  const [deleteOpen, setDeleteOpen] = React.useState(false);

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
      <Box
        sx={{
          p: 2,
          mb: 1,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing',
          },
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="body2" color="text.secondary">
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
        <Typography variant="subtitle1" component="div" gutterBottom>
          {task.title}
        </Typography>
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
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
                      {getInitials(assignee)}
                    </Avatar>
                  </Tooltip>
                ))
              ) : (
                <Tooltip title="Unassigned">
                  <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>?</Avatar>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Chip label={`${task.storyPoints} SP`} size="small" variant="outlined" />
        </Box>
      </Box>
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

