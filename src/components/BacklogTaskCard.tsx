import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Event as EventIcon } from '@mui/icons-material';
import { Task, Priority } from '../types';

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
  return name
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

export const BacklogTaskCard: React.FC<BacklogTaskCardProps> = ({ task, onUpdate }) => {
  const handleUpdateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdate) {
      onUpdate(task);
    }
  };

  return (
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
              sx={{ fontSize: '0.7rem', height: '20px' }}
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
          <Tooltip title={task.assignee}>
            <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem' }}>
              {getInitials(task.assignee)}
            </Avatar>
          </Tooltip>
        </Box>
        <Chip
          label={`${task.storyPoints} SP`}
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

