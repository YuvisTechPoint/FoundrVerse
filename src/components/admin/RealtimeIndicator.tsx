"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export default function RealtimeIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setLastUpdate(new Date());
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    };
    
    // Update every 5 seconds to match refresh interval
    const interval = setInterval(updateTime, 5000);
    
    // Listen for refresh events
    const handleRefresh = () => updateTime();
    window.addEventListener("refresh-data", handleRefresh);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refresh-data", handleRefresh);
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
      <span className="hidden sm:inline">Live</span>
      <span className="text-gray-400 dark:text-gray-500">•</span>
      <RefreshCw 
        className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-green-500' : 'text-gray-400'}`} 
      />
      <span className="hidden sm:inline">Updated {lastUpdate.toLocaleTimeString()}</span>
      <span className="sm:hidden">{lastUpdate.toLocaleTimeString()}</span>
    </div>
  );
}

