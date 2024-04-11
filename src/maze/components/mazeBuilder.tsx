import { FormEvent, useRef, useState } from "react";
import Maze from "./maze.tsx";

const MazeBuilder = () => {
  const [row, setRow] = useState<number | undefined>();
  const [col, setCol] = useState<number | undefined>();
  const rowRef = useRef<HTMLInputElement>(null);
  const colRef = useRef<HTMLInputElement>(null);
  const setParsedSize = (
    size: string,
    func: (e: number | undefined) => void,
  ) => {
    const parsedSize = parseInt(size);
    func(isNaN(parsedSize) ? undefined : parsedSize);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rowRef?.current != null) setParsedSize(rowRef.current.value, setRow);
    if (colRef?.current != null) setParsedSize(colRef.current.value, setCol);
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-full flex gap-x-5 justify-center items-center bg-gray-500 p-5">
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
