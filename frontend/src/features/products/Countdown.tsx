import { useCountdown } from "./useCountdown";

interface CountdownProps {
  targetDate: string;
}

function Countdown({ targetDate }: CountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <span className="countdown countdown--expired">Аукціон завершено</span>
    );
  }

  return (
    <span className="countdown">
      Залишилося: {days} дн. {hours} год. {minutes} хв. {seconds} с.
    </span>
  );
}

export default Countdown;
