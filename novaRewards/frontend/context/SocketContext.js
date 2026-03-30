'use client';

import { createContext, useContext } from 'react';
import { useSocket } from '../lib/useSocket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socket = useSocket();
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
}
