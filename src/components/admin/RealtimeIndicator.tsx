"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

export default function RealtimeIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const updateTime = () => setLastUpdate(new Date());
    const interval = setInterval(updateTime, 30000); // Update every 30 seconds

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      {isOnline ? (
        <Wifi className="w-4 h-4 text-green-500 dark:text-green-400" />
      ) : (
        <WifiOff className="w-4 h-4 text-red-500 dark:text-red-400" />
      )}
      <span className="hidden sm:inline">Live data</span>
      <span className="text-gray-400 dark:text-gray-500">•</span>
      <span className="hidden sm:inline">Updated {lastUpdate.toLocaleTimeString()}</span>
      <span className="sm:hidden">{lastUpdate.toLocaleTimeString()}</span>
    </div>
  );
}

