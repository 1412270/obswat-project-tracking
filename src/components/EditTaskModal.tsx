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
  Typography,
  IconButton,
} from '@mui/material';
import { Task, Subtask } from '../types';
import { useApp } from '../context/AppContext';
import { DEFAULT_ASSIGNEES, TASK_TAGS } from '../constants';
import { Delete as DeleteIcon } from '@mui/icons-material';

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
  const { state, dispatch } = useApp();
  const defaultStatus = state.boardColumns[0]?.id ?? 'TO_DO';
  const [formData, setFormData] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    priority: 'medium',
    storyPoints: 1,
    assignees: [],
    status: defaultStatus,
    location: 'currentSprint',
    tags: [],
    subtasks: [],
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        storyPoints: task.storyPoints,
        assignees: task.assignees,
        status: task.status,
        location: task.location,
        dueDate: task.dueDate,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
      });
    }
  }, [task]);

  const createEmptySubtask = (): Subtask => ({
    id: `SUBTASK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: '',
    assignees: [],
    tags: [],
    status: defaultStatus,
  });

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubtask = () => {
    setFormData((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, createEmptySubtask()],
    }));
  };

  const handleSubtaskChange = (
    subtaskId: string,
    field: keyof Subtask,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((subtask) =>
        subtask.id === subtaskId ? { ...subtask, [field]: value } : subtask
      ),
    }));
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((subtask) => subtask.id !== subtaskId),
    }));
  };

  // Get list of assignees including any on the task that aren't in default list
  const getAssignees = () => {
    if (!task) return DEFAULT_ASSIGNEES;
    return Array.from(new Set([...DEFAULT_ASSIGNEES, ...(task.assignees || [])]));
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
        assignees: task.assignees,
        status: task.status,
        location: task.location,
        dueDate: task.dueDate,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
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
          <FormControl fullWidth>
            <InputLabel shrink>Assignees</InputLabel>
            <Select
              multiple
              displayEmpty
              value={formData.assignees}
              onChange={(e) => handleChange('assignees', e.target.value)}
              input={<OutlinedInput label="Assignees" />}
              renderValue={(selected) => {
                const assignees = selected as string[];
                if (assignees.length === 0) {
                  return <em>Select assignees</em>;
                }
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {assignees.map((assignee) => (
                      <Chip key={assignee} label={assignee} size="small" />
                    ))}
                  </Box>
                );
              }}
            >
              {getAssignees().map((assignee) => (
                <MenuItem key={assignee} value={assignee}>
                  {assignee}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Status"
            select
            fullWidth
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            {state.boardColumns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.title}
              </MenuItem>
            ))}
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Subtasks</Typography>
              <Button size="small" onClick={handleAddSubtask}>
                Add Subtask
              </Button>
            </Box>
            {formData.subtasks.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No subtasks added yet.
              </Typography>
            ) : (
              formData.subtasks.map((subtask, index) => (
                <Box
                  key={subtask.id}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">Subtask {index + 1}</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteSubtask(subtask.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <TextField
                    label="Subtask Name"
                    fullWidth
                    value={subtask.name}
                    onChange={(e) => handleSubtaskChange(subtask.id, 'name', e.target.value)}
                  />
                  <TextField
                    label="Status"
                    select
                    fullWidth
                    value={subtask.status}
                    onChange={(e) => handleSubtaskChange(subtask.id, 'status', e.target.value)}
                  >
                    {state.boardColumns.map((column) => (
                      <MenuItem key={column.id} value={column.id}>
                        {column.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormControl fullWidth>
                    <InputLabel shrink>Assignees</InputLabel>
                    <Select
                      multiple
                      displayEmpty
                      value={subtask.assignees}
                      onChange={(e) => handleSubtaskChange(subtask.id, 'assignees', e.target.value)}
                      input={<OutlinedInput label="Assignees" />}
                      renderValue={(selected) => {
                        const assignees = selected as string[];
                        if (assignees.length === 0) {
                          return <em>Select assignees</em>;
                        }
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {assignees.map((assignee) => (
                              <Chip key={assignee} label={assignee} size="small" />
                            ))}
                          </Box>
                        );
                      }}
                    >
                      {getAssignees().map((assignee) => (
                        <MenuItem key={assignee} value={assignee}>
                          {assignee}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel shrink>Tags</InputLabel>
                    <Select
                      multiple
                      displayEmpty
                      value={subtask.tags}
                      onChange={(e) => handleSubtaskChange(subtask.id, 'tags', e.target.value)}
                      input={<OutlinedInput label="Tags" />}
                      renderValue={(selected) => {
                        const tags = selected as string[];
                        if (tags.length === 0) {
                          return <em>Select tags</em>;
                        }
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" />
                            ))}
                          </Box>
                        );
                      }}
                    >
                      {TASK_TAGS.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                          {tag}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ))
            )}
          </Box>
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

