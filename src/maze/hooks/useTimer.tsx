import { useContext } from "react";
import { TimerContext } from "./context.ts";

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context == undefined) throw "Outside the TimerContext";
  return context;
};
