import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import type { Task } from '../types';

interface Props {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onTaskClick: (task: Task) => void;
}

export function TaskCalendar({
  tasks,
  onTaskUpdate,
  onTaskClick,
}: Props) {

  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    allDay: true,
  }));


  // Drag and Drop Handler
  const handleEventDrop = async (info: any) => {

    const taskId = info.event.id;
    const newDate = info.event.start;

    await onTaskUpdate(taskId, {
      due_date: newDate.toISOString(),
    });

  };


  // Click handler
  const handleEventClick = (info: any) => {

    const task = tasks.find(t => t.id === info.event.id);

    if (task) {
      onTaskClick(task);
    }

  };


  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">

      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}

        initialView="dayGridMonth"

        events={events}

        editable={true}

        selectable={true}

        eventDrop={handleEventDrop}

        eventClick={handleEventClick}

        height="auto"

      />

    </div>
  );
}