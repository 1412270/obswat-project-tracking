import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { Priority, Status, Task } from '../types';
import { useApp } from '../context/AppContext';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  initialStatus?: Status;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onClose,
  initialStatus = 'TO_DO',
}) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    priority: 'medium',
    storyPoints: 1,
    assignee: '',
    status: initialStatus,
    location: 'currentSprint',
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      return;
    }

    const newTask: Task = {
      ...formData,
      id: `TASK-${Date.now()}`,
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      storyPoints: 1,
      assignee: '',
      status: initialStatus,
      location: 'currentSprint',
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Task</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          <TextField
            label="Priority"
            select
            fullWidth
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </TextField>
          <TextField
            label="Story Points"
            type="number"
            fullWidth
            inputProps={{ min: 1, max: 20 }}
            value={formData.storyPoints}
            onChange={(e) => handleChange('storyPoints', parseInt(e.target.value) || 1)}
          />
          <TextField
            label="Assignee"
            fullWidth
            value={formData.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
          />
          <TextField
            label="Status"
            select
            fullWidth
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <MenuItem value="TO_DO">TO DO</MenuItem>
            <MenuItem value="IN_PROGRESS">IN PROGRESS</MenuItem>
            <MenuItem value="DONE">DONE</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.title.trim()}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

