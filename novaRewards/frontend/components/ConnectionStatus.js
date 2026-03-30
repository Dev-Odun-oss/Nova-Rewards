'use client';

import { useSocketContext } from '../context/SocketContext';

const CONFIG = {
  connected:    { dot: '#22c55e', label: 'Live'          },
  reconnecting: { dot: '#f59e0b', label: 'Reconnecting…' },
  disconnected: { dot: '#ef4444', label: 'Offline'       },
};

export default function ConnectionStatus() {
  const { status } = useSocketContext();
  if (status === 'connected') return null; // hide when healthy

  const { dot, label } = CONFIG[status] || CONFIG.disconnected;

  return (
    <div className="connection-status" role="status" aria-live="polite">
      <span className="connection-dot" style={{ background: dot }} />
      {label}
    </div>
  );
}
