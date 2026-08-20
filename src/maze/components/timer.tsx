import { useEffect, useRef, useState } from "react";
import { useGameActions, useGameState } from "../hooks/useTimer.tsx";
import { AvTimer } from "@mui/icons-material";

const Timer = () => {
  const frameRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRef = useRef(currentTime);
  const { setFinalScore } = useGameActions();
  const { startTimer, hasGameEnded } = useGameState();
  const startTimerRef = useRef(startTimer);

  currentTimeRef.current = currentTime;
  startTimerRef.current = startTimer;

  useEffect(() => {
    if (!startTimer && !hasGameEnded) {
      setCurrentTime(0);
      prevTimeRef.current = undefined;
    }
  }, [startTimer, hasGameEnded]);

  useEffect(() => {
    if (hasGameEnded) {
      setFinalScore(currentTimeRef.current);
    }
  }, [hasGameEnded, setFinalScore]);

  useEffect(() => {
    const animateTimer = (time: number) => {
      if (prevTimeRef.current != null && startTimerRef.current) {
        const timedelta = time - prevTimeRef.current;
        const timedeltaInSeconds = timedelta / 1000;
        setCurrentTime(
          (t) => Math.round((t + timedeltaInSeconds) * 100) / 100,
        );
      }
      prevTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animateTimer);
    };

    frameRef.current = requestAnimationFrame(animateTimer);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div
      className={`w-full md:w-auto md:min-w-60 bg-white rounded-md px-3 md:px-5 text-blue-300 font-mono font-semibold text-xl md:text-3xl flex gap-x-2 md:gap-x-3 items-center
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
