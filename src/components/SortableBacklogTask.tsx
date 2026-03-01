import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BacklogTaskCard } from './BacklogTaskCard';
import { EditTaskModal } from './EditTaskModal';
import { Task } from '../types';

interface SortableBacklogTaskProps {
  task: Task;
}

export const SortableBacklogTask: React.FC<SortableBacklogTaskProps> = ({
  task,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleUpdate = () => {
    setEditModalOpen(true);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <BacklogTaskCard task={task} onUpdate={handleUpdate} />
      </div>
      <EditTaskModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={task}
      />
    </>
  );
};

