import { FormEvent, useRef, useState } from "react";
import Maze, { MazeType } from "./maze.tsx";
import { generateMaze } from "../utils/generateMaze.ts";
import { Alert, Slide, Snackbar } from "@mui/material";
import Timer from "./timer.tsx";
import { TimerContext } from "../hooks/context.ts";
import { Help } from "@mui/icons-material";

const MazeBuilder = () => {
  const [row, setRow] = useState<number | undefined>();
  const [col, setCol] = useState<number | undefined>();
  const rowRef = useRef<HTMLInputElement>(null);
  const colRef = useRef<HTMLInputElement>(null);
  const [maze, setMaze] = useState<MazeType>();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasGameEnded, setHasGameEnded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const setParsedSize = (
    size: string,
    func: (e: number | undefined) => void,
  ) => {
    const parsedSize = parseInt(size);
    const returnVal = isNaN(parsedSize) ? undefined : parsedSize;
    func(returnVal);
    return returnVal;
  };

  const handleGenerateMaze = (
    row: number | undefined,
    col: number | undefined,
  ) => {
    if (row && col && row > 0 && col > 0) {
      const generatedMaze = generateMaze(row, col);
      setMaze(generatedMaze);
      setStartTimer(false);
      setCurrentTime(0);
      setOpenSnackBar(true);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const rowSize =
      rowRef?.current != null
        ? setParsedSize(rowRef.current.value, setRow)
        : undefined;
    const colSize =
      colRef?.current != null
        ? setParsedSize(colRef.current.value, setCol)
        : undefined;

    handleGenerateMaze(rowSize, colSize);
  };

  return (
    <TimerContext.Provider
      value={{
        startTimer,
        setStartTimer,
        currentTime,
        setCurrentTime,
        hasGameEnded,
        setHasGameEnded,
        setOpenSnackBar,
        showSolution,
        setShowSolution,
      }}
    >
      <div className="fixed top-0 left-0 w-full flex gap-x-5 justify-between items-center bg-gray-500 p-5">
        <p
          className="flex items-center gap-x-1 text-sm cursor-pointer"
          onClick={() => {
            setOpenSnackBar(true);
          }}
        >
          Help <Help height={"10px"} width={"10px"} />
        </p>
        <Snackbar
          open={openSnackBar}
          onClose={() => setOpenSnackBar(false)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Slide}
          className="mt-12"
        >
          <Alert severity={"info"}>
            Use <span className="font-semibold">W</span>,{" "}
            <span className="font-semibold">A</span>,{" "}
            <span className="font-semibold">S</span>,{" "}
            <span className="font-semibold">D</span> to control the car.
            <br />
            Press <span className="font-semibold">R</span> to reset.
            <br />
            Press <span className="font-semibold">F</span> to see solution.
            <br />
            Press <span className="font-semibold">H</span> for help.
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-x-12">
            <div className="flex gap-x-2 items-center">
              <label className="font-bold" htmlFor={"mazeRow"}>
                Number of rows
              </label>
              <input id="mazeRow" className="h-8 p-2" ref={rowRef} />
            </div>
            <div className="flex gap-x-2 items-center">
              <label className="font-bold" htmlFor={"mazeCol"}>
                Number of columns
              </label>
              <input id="mazeCol" className="h-8 p-2" ref={colRef} />
            </div>
            <button type="submit" className="font-bold">
              {maze ? "Regenerate Maze" : "Generate Maze"}
            </button>
          </div>
        </form>
        <Timer />
      </div>
      <div className="h-full w-full justify-between">
        {row && col && maze && (
          <div className="bg-white h-full w-full">
            <Maze row={row} col={col} generatedMaze={maze} />
          </div>
        )}
      </div>
    </TimerContext.Provider>
  );
};
export default MazeBuilder;
