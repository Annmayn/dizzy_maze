import { FormEvent, useEffect, useRef, useState } from "react";
import Maze, { MazeType } from "./maze.tsx";
import { generateMaze } from "../utils/generateMaze.ts";
import { Alert, Slide, Snackbar } from "@mui/material";

const MazeBuilder = () => {
  const [row, setRow] = useState<number | undefined>();
  const [col, setCol] = useState<number | undefined>();
  const rowRef = useRef<HTMLInputElement>(null);
  const colRef = useRef<HTMLInputElement>(null);
  const [maze, setMaze] = useState<MazeType>();
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const setParsedSize = (
    size: string,
    func: (e: number | undefined) => void,
  ) => {
    const parsedSize = parseInt(size);
    func(isNaN(parsedSize) ? undefined : parsedSize);
  };

  useEffect(() => {
    if (row && col && row > 0 && col > 0) {
      const generatedMaze = generateMaze(row, col);
      setMaze(generatedMaze);
      setOpenSnackBar(true);
    }
  }, [row, col]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rowRef?.current != null) {
      setParsedSize(rowRef.current.value, setRow);
    }
    if (colRef?.current != null) {
      setParsedSize(colRef.current.value, setCol);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full flex gap-x-5 justify-center items-center bg-gray-500 p-5">
        <Snackbar
          open={openSnackBar}
          onClose={() => setOpenSnackBar(false)}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={Slide}
        >
          <Alert severity={"info"}>
            Use <span className="font-semibold">W</span>,{" "}
            <span className="font-semibold">A</span>,{" "}
            <span className="font-semibold">S</span>,{" "}
            <span className="font-semibold">D</span> to control the car.
            <br />
            Press <span className="font-semibold">R</span> to reset.
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
              Generate Maze
            </button>
          </div>
        </form>
      </div>
      <div className="h-full w-full justify-between">
        {row && col && maze && (
          <div className="bg-white h-full w-full">
            <Maze row={row} col={col} generatedMaze={maze} />
          </div>
        )}
      </div>
    </>
  );
};
export default MazeBuilder;
