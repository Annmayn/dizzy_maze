import { createContext, Dispatch, SetStateAction } from "react";

interface TimerContextProps {
  startTimer: boolean;
  setStartTimer: Dispatch<SetStateAction<boolean>>;
  hasGameEnded: boolean;
  setHasGameEnded: Dispatch<SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: Dispatch<SetStateAction<number>>;
  setOpenSnackBar: Dispatch<SetStateAction<boolean>>;
  showSolution: boolean;
  setShowSolution: Dispatch<SetStateAction<boolean>>;
}
export const TimerContext = createContext<TimerContextProps | undefined>(
  undefined,
);
