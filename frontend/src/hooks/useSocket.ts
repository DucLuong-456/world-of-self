import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

export const useSocket = (namespace: string = '/chat') => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only connect if the user is authenticated
    if (!isAuthenticated) return;

    // Use NEXT_PUBLIC_API_URL or fallback. Socket.io connects to server origin, strip /v1 suffix.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const baseUrl = apiUrl.replace(/\/v\d+.*$/, '');
    
    // Create socket instance
    const socketInstance = io(`${baseUrl}${namespace}`, {
      withCredentials: true,
      transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log(`Connected to socket namespace ${namespace}`);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log(`Disconnected from socket namespace ${namespace}`);
    });

    socketInstance.on('connect_error', (error) => {
      setIsConnected(false);
      console.error(`Socket connection error on ${namespace}:`, error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [namespace, isAuthenticated]);

  return { socket, isConnected };
};
