import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import type { Task, Employee } from '../types';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { TaskModal } from '../components/TaskModal';
import { Loader } from 'lucide-react';

export function AdminCalendar() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();

  const { addNotification } = useNotification();


  // Load data
  const loadData = async () => {

    try {

      setLoading(true);

      const [tasksData, employeesData] =
        await Promise.all([
          api.getTasks(),
          api.getEmployees()
        ]);

      setTasks(tasksData);
      setEmployees(employeesData);

    }
    catch {

      addNotification('Failed to load tasks', 'error');

    }
    finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadData();
  }, []);



  // Convert tasks to calendar events
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.due_date,
    allDay: true,
  }));



  // Drag & drop handler
  const handleEventDrop = async (info: any) => {

    const taskId = info.event.id;
    const newDate = info.event.start;

    try {

      const updated =
        await api.updateTask(taskId, {
          due_date: newDate.toISOString(),
        });

      setTasks(tasks.map(t =>
        t.id === taskId ? updated : t
      ));

      addNotification(
        'Due date updated',
        'success'
      );

    }
    catch {

      addNotification(
        'Failed to update due date',
        'error'
      );

      info.revert();

    }

  };



  // Click handler
  const handleEventClick = (info: any) => {

    const task =
      tasks.find(t =>
        t.id === info.event.id
      );

    if (task) {

      setSelectedTask(task);
      setShowModal(true);

    }

  };



  if (loading) {

    return (
      <div className="flex justify-center items-center h-96">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  }



  return (

    <div className="p-6 space-y-6">


      {/* Header */}
      <div>

        <h1 className="text-2xl font-bold">
          Task Calendar
        </h1>

        <p className="text-gray-500">
          Drag tasks to update due dates
        </p>

      </div>



      {/* Calendar */}
      <div className="bg-white rounded-2xl shadow-sm p-4">

        <FullCalendar

          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin
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



      {/* Modal */}
      <TaskModal

        isOpen={showModal}

        onClose={() => {

          setShowModal(false);
          setSelectedTask(undefined);

        }}

        onSubmit={async (updates) => {

          if (!selectedTask) return;

          const updated =
            await api.updateTask(
              selectedTask.id,
              updates
            );

          setTasks(tasks.map(t =>
            t.id === updated.id
              ? updated
              : t
          ));

          addNotification(
            'Task updated',
            'success'
          );

        }}

        task={selectedTask}

        employees={employees}

      />

    </div>

  );

}