import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from './Types';

type ColumnProps = {
  column: ColumnType;
  tasks: Task[];
  width: string;
};

function Column({ column, tasks, width }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className={`flex flex-col rounded-lg bg-white p-4 h-full`} style={{ width }}>
      <h2 className="mb-4 font-semibold text-2xl">{column.title}</h2>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} />;
        })}
      </div>
    </div>
  );
}

export default Column;