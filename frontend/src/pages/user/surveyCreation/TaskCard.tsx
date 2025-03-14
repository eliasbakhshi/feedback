import { useDraggable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { Task } from './Types';

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform: draggableTransform } = useDraggable({
    id: task.id,
  });

  const { setNodeRef: setSortableNodeRef, transform: sortableTransform, transition } = useSortable({
    id: task.id,
  });

  const style = {
    transform: draggableTransform ? `translate(${draggableTransform.x}px, ${draggableTransform.y}px)` : sortableTransform ? `translate(${sortableTransform.x}px, ${sortableTransform.y}px)` : undefined,
    transition,
  };

  return (
    <div
      ref={(node) => {
        setDraggableNodeRef(node);
        setSortableNodeRef(node);
      }}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg bg-gray-600 p-4 shadow-sm hover:shadow-md"
      style={style}
    >
      <h3 className="font-medium text-gray-100">{task.title}</h3>
      <p className="mt-2 text-sm text-gray-400">{task.description}</p>
    </div>
  );
}