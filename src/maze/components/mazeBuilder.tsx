import { useState } from "react";
import Maze from "./maze.tsx";

const MazeBuilder = () => {
  const [row, setRow] = useState<number | undefined>();
  const [col, setCol] = useState<number | undefined>();
  const setParsedSize = (
    size: string,
    func: (e: number | undefined) => void,
  ) => {
    const parsedSize = parseInt(size);
    func(isNaN(parsedSize) ? undefined : parsedSize);
  };
  return (
    <>
      <div className="absolute top-0 left-0 w-full flex gap-x-5 justify-center items-center my-4">
        <label htmlFor={"mazeRow"}>Number of rows</label>
        <input
          id="mazeRow"
          className="h-8"
          onChange={(e) => setParsedSize(e.target.value, setRow)}
          value={row}
        />
        <label htmlFor={"mazeCol"}>Number of columns</label>
        <input
          id="mazeCol"
          className="h-8"
          onChange={(e) => setParsedSize(e.target.value, setCol)}
          value={col}
        />
      </div>
      <div className="h-full w-full justify-between">
        {row && col && row > 0 && col > 0 && (
          <div className="bg-white h-full w-full">
            <Maze row={row} col={col} />
          </div>
        )}
      </div>
    </>
  );
};
export default MazeBuilder;
