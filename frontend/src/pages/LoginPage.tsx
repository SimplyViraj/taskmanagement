import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Loader } from 'lucide-react';
import { BackgroundPaths } from '../components/ui/BackgroundsPath';
export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      addNotification('Login successful!', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      addNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-white">
      <div className="absolute inset-0 z-0">
        <BackgroundPaths />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">
        
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-black/10">
          
          <h2 className="text-2xl font-bold text-black text-center">
           Task Manager
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Sign in to continue
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium text-black">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-700"
            />
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-black">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-black
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-700"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-black py-2.5 text-white font-semibold 
            hover:bg-neutral-900 transition duration-2000 shadow-md"
          >
            Login
          </button>
         
        
        </form>

      </div>
    </div>
  );
}
