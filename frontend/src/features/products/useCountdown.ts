import { useEffect, useState } from "react";

interface Countdown {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateCountdown(targetDate: string): Countdown {
  const difference = new Date(targetDate).getTime() - Date.now();

  const totalSeconds = Math.max(0, Math.floor(difference / 1000));

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor((totalSeconds % 86400) / 3600);

  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
    isExpired: totalSeconds === 0,
  };
}

export function useCountdown(targetDate: string): Countdown {
  const [countdown, setCountdown] = useState(() =>
    calculateCountdown(targetDate),
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [targetDate]);

  return countdown;
}
