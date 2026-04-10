import { useState, useEffect } from "react";

export function useSystemStatus() {
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(82);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBattery((prev) => {
        const change = Math.random() > 0.5 ? -1 : 1;
        return Math.max(15, Math.min(100, prev + change));
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDate = time.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return { time, formattedTime, formattedDate, battery };
}
