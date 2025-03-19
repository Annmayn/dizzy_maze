import { useTimer } from "../hooks/useTimer.tsx";
import { Dialog, DialogContent, DialogTitle, Fade } from "@mui/material";
import React from "react";
import { TransitionProps } from "@mui/material/transitions";

export const Score = () => {
  const { hasGameEnded, currentTime } = useTimer();

  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return (
      <Fade in={true} ref={ref} timeout={3000} {...props} children={<></>} />
    );
  });

  return (
    hasGameEnded && (
      <Dialog
        open={hasGameEnded}
        disableEscapeKeyDown={false}
        TransitionComponent={Transition}
      >
        <DialogTitle>Game Over</DialogTitle>
        <DialogContent>
          <p>
            Your score: <span>{currentTime}</span>
          </p>
        </DialogContent>
      </Dialog>
    )
  );
};
