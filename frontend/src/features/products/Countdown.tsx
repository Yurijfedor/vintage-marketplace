import { useCountdown } from "./useCountdown";

interface CountdownProps {
  targetDate: string;
}

function Countdown({ targetDate }: CountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <span className="countdown countdown--expired">Auktion beendet</span>
    );
  }

  return (
    <span className="countdown">
      Noch {days} Tg. {hours} Std. {minutes} Min. {seconds} Sek.
    </span>
  );
}

export default Countdown;
