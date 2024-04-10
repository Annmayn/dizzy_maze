import { generateMaze } from "../utils/generateMaze.ts";

interface MazeProps {
  row: number;
  col: number;
}

const Maze = ({ row, col }: MazeProps) => {
  const generatedMaze = generateMaze(row, col);
  console.log("generated: ", generatedMaze);
  return (
    <>
      <div className="flex flex-col">
        {generatedMaze.map((row) => {
          return (
            <div className="flex">
              {row.map((col) => {
                return (
                  <div
                    className={`size-12 ${col ? "bg-green-300" : "bg-red-300"}`}
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
