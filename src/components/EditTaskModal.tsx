import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
} from '@mui/material';
import { Task } from '../types';
import { useApp } from '../context/AppContext';
import { DEFAULT_ASSIGNEES, TASK_TAGS } from '../constants';

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  onClose,
  task,
}) => {
  const { dispatch } = useApp();
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    priority: 'medium',
    storyPoints: 1,
    assignee: '',
    status: 'TO_DO',
    location: 'currentSprint',
    tags: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        storyPoints: task.storyPoints,
        assignee: task.assignee,
        status: task.status,
        location: task.location,
        dueDate: task.dueDate,
        tags: task.tags || [],
      });
    }
  }, [task]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Get list of assignees including the current task's assignee if not in default list
  const getAssignees = () => {
    if (!task) return DEFAULT_ASSIGNEES;
    const assignees = [...DEFAULT_ASSIGNEES];
    if (task.assignee && !DEFAULT_ASSIGNEES.includes(task.assignee)) {
      assignees.push(task.assignee);
    }
    return assignees;
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !task) {
      return;
    }

    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: formData,
      },
    });
    handleClose();
  };

  const handleClose = () => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        storyPoints: task.storyPoints,
        assignee: task.assignee,
        status: task.status,
        location: task.location,
        dueDate: task.dueDate,
        tags: task.tags || [],
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
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
            select
            fullWidth
            value={formData.assignee}
            onChange={(e) => handleChange('assignee', e.target.value)}
          >
            <MenuItem value="">
              <em>Select an assignee</em>
            </MenuItem>
            {getAssignees().map((assignee) => (
              <MenuItem key={assignee} value={assignee}>
                {assignee}
              </MenuItem>
            ))}
          </TextField>
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
          <TextField
            label="Due Date"
            type="date"
            fullWidth
            value={formData.dueDate || ''}
            onChange={(e) => handleChange('dueDate', e.target.value || undefined)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {TASK_TAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!formData.title.trim()}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

