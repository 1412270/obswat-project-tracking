import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import { Task, Priority } from '../types';

interface BacklogTaskCardProps {
  task: Task;
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

export const BacklogTaskCard: React.FC<BacklogTaskCardProps> = ({ task }) => {
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
        <Chip
          label={task.priority}
          color={priorityColors[task.priority]}
          size="small"
        />
      </Box>
      <Typography variant="subtitle1" component="div" gutterBottom>
        {task.title}
      </Typography>
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

