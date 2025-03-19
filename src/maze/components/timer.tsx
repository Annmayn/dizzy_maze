import { useCallback, useEffect, useRef } from "react";
import { useTimer } from "../hooks/useTimer.tsx";
import { AvTimer } from "@mui/icons-material";

const Timer = () => {
  const currentTimeRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const { currentTime, setCurrentTime, startTimer } = useTimer();

  const animateTimer = useCallback(
    (time: number) => {
      if (prevTimeRef.current) {
        const timedelta = time - prevTimeRef.current;
        const timedeltaInSeconds = timedelta / 1000;
        if (startTimer)
          setCurrentTime(
            (t) => Math.round((t + timedeltaInSeconds) * 100) / 100,
          );
      }
      prevTimeRef.current = time;
      currentTimeRef.current = requestAnimationFrame(animateTimer);
    },
    [setCurrentTime, startTimer],
  );

  useEffect(() => {
    currentTimeRef.current = requestAnimationFrame(animateTimer);
    return () => cancelAnimationFrame(currentTimeRef.current!);
  }, [animateTimer, startTimer]);

  return (
    <div
      className={`min-w-60 bg-white rounded-md px-5 text-blue-300 font-mono font-semibold text-3xl flex gap-x-3 items-center
       ${startTimer ? "justify-start" : "justify-center"}`}
    >
      <AvTimer fontSize="large" />
      <div className="">
        {currentTime}
        <span>s</span>
      </div>
    </div>
  );
};

export default Timer;
