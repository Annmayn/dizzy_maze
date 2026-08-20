import { createContext, Dispatch, SetStateAction, MutableRefObject } from "react";

export interface GameRefs {
  startTimer: boolean;
  hasGameEnded: boolean;
}

export interface GameActions {
  refs: MutableRefObject<GameRefs>;
  setStartTimer: Dispatch<SetStateAction<boolean>>;
  setHasGameEnded: Dispatch<SetStateAction<boolean>>;
  setFinalScore: Dispatch<SetStateAction<number>>;
  setOpenSnackBar: Dispatch<SetStateAction<boolean>>;
  setShowSolution: Dispatch<SetStateAction<boolean>>;
}

export interface GameState {
  startTimer: boolean;
  hasGameEnded: boolean;
  finalScore: number;
  showSolution: boolean;
}

export const GameActionsContext = createContext<GameActions | undefined>(
  undefined,
);

export const GameStateContext = createContext<GameState | undefined>(undefined);
