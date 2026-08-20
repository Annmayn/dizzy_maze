import { useGameState } from "../hooks/useTimer.tsx";
import { Dialog, DialogContent, DialogTitle, Fade } from "@mui/material";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

export const Score = () => {
  const { hasGameEnded, finalScore } = useGameState();

  return (
    <Dialog
      open={hasGameEnded}
      disableEscapeKeyDown={false}
      TransitionComponent={Transition}
    >
      <DialogTitle>Game Over</DialogTitle>
      <DialogContent>
        <p>
          Your score: <span>{finalScore}</span>
        </p>
      </DialogContent>
    </Dialog>
  );
};
