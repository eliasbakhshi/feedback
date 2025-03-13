import { useState } from 'react';
import type { Task, Column as ColumnType } from './surveyCreation/Types';
import Column from './surveyCreation/Column';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

const COLUMNS: ColumnType[] = [
  { id: 'Objekt', title: 'Formulär objekt' },
  { id: 'Formulär', title: 'Formulär' }
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Titel',
    description: 'Titel för formuläret',
    status: 'Objekt',
  },
  {
    id: '2',
    title: 'Beskrivning',
    description: 'Beskrivningstext för formuläret',
    status: 'Objekt',
  }
];

export default function SurveyCreation() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );
  }

  return (
    <div className="p-4 h-full bg-gray-300">
      <div className="flex gap-6 w-full h-full w-full">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            const width = column.id === 'Objekt' ? '30%' : '70%';
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
                width={width}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

