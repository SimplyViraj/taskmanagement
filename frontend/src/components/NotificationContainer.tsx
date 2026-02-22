import { useNotification } from '../context/NotificationContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center gap-3 p-4 border rounded-lg shadow-lg animate-in slide-in-from-right ${getStyles(
            notif.type
          )}`}
        >
          {getIcon(notif.type)}
          <span className="flex-1">{notif.message}</span>
          <button
            onClick={() => removeNotification(notif.id)}
            className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
