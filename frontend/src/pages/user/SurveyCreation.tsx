import { useState } from 'react';
import type { Task, Column as ColumnType } from './surveyCreation/Types';
import Column from './surveyCreation/Column';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';

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
    const targetId = over.id as string;
  
    const originalIndex = tasks.findIndex((task) => task.id === taskId);
    const targetIndex = tasks.findIndex((task) => task.id === targetId);
    
    if (originalIndex === -1 || targetIndex === -1) return;
  
    if (tasks[originalIndex].status === tasks[targetIndex].status) {
      setTasks((prevTasks) => arrayMove(prevTasks, originalIndex, targetIndex));
      return;
    }
  
    const originalTask = tasks[originalIndex];
  
    if (originalTask.status !== tasks[targetIndex].status) {
      if (originalTask.status === "Objekt" && tasks[targetIndex].status === "Formulär") {
        const newTask: Task = {
          ...originalTask,
          id: `${originalTask.id}-copy-${Date.now()}`,
          status: tasks[targetIndex].status,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
      } else if (originalTask.status === "Formulär" && tasks[targetIndex].status === "Objekt") {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    }
  }
  
 
  return (
    <div className="p-4 h-full bg-gray-300">
      <div className="flex gap-6 w-full h-full w-full">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            const width = column.id === 'Objekt' ? '30%' : '70%';
            return (
              <SortableContext key={column.id} items={tasks.filter((task) => task.status === column.id).map((task) => task.id)}>
                <Column
                  column={column}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  width={width}
                />
              </SortableContext>
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

