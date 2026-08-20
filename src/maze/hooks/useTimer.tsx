import { useContext } from "react";
import { GameActionsContext, GameStateContext } from "./context.ts";

export const useGameActions = () => {
  const context = useContext(GameActionsContext);
  if (context == undefined) throw new Error("Outside the GameActionsContext");
  return context;
};

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context == undefined) throw new Error("Outside the GameStateContext");
  return context;
};
