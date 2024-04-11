import { generateMaze } from "../utils/generateMaze.ts";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
}

const Maze = ({ row, col }: MazeProps) => {
  const generatedMaze = generateMaze(row, col);
  return (
    <>
      <div className="flex flex-col">
        {generatedMaze.map((row) => {
          return (
            <div className="flex">
              {row.map((col) => {
                return (
                  <div
                    className={`size-12 min-h-12 min-w-12 ${col ? "bg-green-300" : "bg-red-300"}`}
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Maze;
