import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Maze, { MazeType } from "./maze.tsx";
import { generateMaze } from "../utils/generateMaze.ts";
import { Alert, Slide, Snackbar } from "@mui/material";
import Timer from "./timer.tsx";
import {
  GameActionsContext,
  GameRefs,
  GameStateContext,
} from "../hooks/context.ts";
import { Help } from "@mui/icons-material";

const MazeBuilder = () => {
  const [row, setRow] = useState<number | undefined>();
  const [col, setCol] = useState<number | undefined>();
  const rowRef = useRef<HTMLInputElement>(null);
  const colRef = useRef<HTMLInputElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [maze, setMaze] = useState<MazeType>();
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [hasGameEnded, setHasGameEnded] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const gameRefs = useRef<GameRefs>({
    startTimer: false,
    hasGameEnded: false,
  });
  gameRefs.current.startTimer = startTimer;
  gameRefs.current.hasGameEnded = hasGameEnded;

  // Setters from useState are stable — this value never needs to change identity.
  const gameActions = useMemo(
    () => ({
      refs: gameRefs,
      setStartTimer,
      setHasGameEnded,
      setFinalScore,
      setOpenSnackBar,
      setShowSolution,
    }),
    [
      setStartTimer,
      setHasGameEnded,
      setFinalScore,
      setOpenSnackBar,
      setShowSolution,
    ],
  );

  const gameState = useMemo(
    () => ({
      startTimer,
      hasGameEnded,
      finalScore,
      showSolution,
    }),
    [startTimer, hasGameEnded, finalScore, showSolution],
  );

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

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
      setHasGameEnded(false);
      setFinalScore(0);
      setShowSolution(false);
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
    <GameActionsContext.Provider value={gameActions}>
      <GameStateContext.Provider value={gameState}>
        <div
          ref={headerRef}
          className="fixed top-0 left-0 z-10 w-full flex flex-col md:flex-row gap-3 md:gap-x-5 justify-between items-stretch md:items-center bg-gray-500 p-3 md:p-5"
        >
          <div className="flex justify-between items-center gap-3 w-full md:w-auto">
            <p
              className="flex items-center gap-x-1 text-sm cursor-pointer"
              onClick={() => {
                setOpenSnackBar(true);
              }}
            >
              Help <Help height={"10px"} width={"10px"} />
            </p>
            <Timer />
          </div>
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

          <form onSubmit={handleSubmit} className="w-full md:w-auto min-w-0">
            <div className="flex flex-col md:flex-row gap-3 md:gap-x-12 items-stretch md:items-center">
              <div className="flex gap-x-2 items-center">
                <label
                  className="font-bold text-sm md:text-base whitespace-nowrap"
                  htmlFor={"mazeRow"}
                >
                  Rows
                </label>
                <input
                  id="mazeRow"
                  className="h-8 p-2 w-16 min-w-0"
                  ref={rowRef}
                  defaultValue={10}
                />
              </div>
              <div className="flex gap-x-2 items-center">
                <label
                  className="font-bold text-sm md:text-base whitespace-nowrap"
                  htmlFor={"mazeCol"}
                >
                  Columns
                </label>
                <input
                  id="mazeCol"
                  className="h-8 p-2 w-16 min-w-0"
                  ref={colRef}
                  defaultValue={10}
                />
              </div>
              <button type="submit" className="font-bold whitespace-nowrap">
                {maze ? "Regenerate Maze" : "Generate Maze"}
              </button>
            </div>
          </form>
        </div>
        <div
          className="w-full overflow-hidden"
          style={{
            paddingTop: headerHeight,
            height: "100vh",
            boxSizing: "border-box",
          }}
        >
          {row && col && maze && (
            <div className="bg-white h-full w-full">
              <Maze
                row={row}
                col={col}
                generatedMaze={maze}
                showSolution={showSolution}
              />
            </div>
          )}
        </div>
      </GameStateContext.Provider>
    </GameActionsContext.Provider>
  );
};
export default MazeBuilder;
