import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { Task, Priority } from '../types';

interface TaskCardProps {
  task: Task;
  showDescription?: boolean;
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

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showDescription = false,
}) => {
  return (
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
          <Chip
            label={task.priority}
            color={priorityColors[task.priority]}
            size="small"
          />
        </Box>
        <Typography variant="h6" component="div" gutterBottom>
          {task.title}
        </Typography>
        {showDescription && task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Tooltip title={task.assignee}>
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {getInitials(task.assignee)}
              </Avatar>
            </Tooltip>
            <Typography variant="caption" color="text.secondary">
              {task.assignee}
            </Typography>
          </Box>
          <Chip
            label={`${task.storyPoints} SP`}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

