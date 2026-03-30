'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

/**
 * Singleton socket hook — one connection per authenticated session.
 * Returns { socket, status } where status is 'connected' | 'disconnected' | 'reconnecting'.
 *
 * Automatically:
 *  - Connects when the user is authenticated
 *  - Disconnects and cleans up on unmount / logout
 *  - Reconnects with exponential back-off (handled by socket.io-client)
 */
export function useSocket() {
  const { token, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setStatus('disconnected');
      return;
    }

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: Infinity,
    });

    socketRef.current = socket;

    socket.on('connect',            () => setStatus('connected'));
    socket.on('disconnect',         () => setStatus('disconnected'));
    socket.on('reconnect_attempt',  () => setStatus('reconnecting'));
    socket.on('reconnect',          () => setStatus('connected'));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('reconnect_attempt');
      socket.off('reconnect');
      socket.disconnect();
      socketRef.current = null;
      setStatus('disconnected');
    };
  }, [isAuthenticated, token]);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  return { socket: socketRef.current, status, on };
}
