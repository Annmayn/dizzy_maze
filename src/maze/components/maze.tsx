import { useEffect, useRef } from "react";
import { PIXEL_SIZE } from "../../common.ts";
import Player from "./player.tsx";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
  generatedMaze: MazeType;
}

const Maze = ({ generatedMaze }: MazeProps) => {
  const mazeRef = useRef<MazeType>(generatedMaze);

  useEffect(() => {
    mazeRef.current = generatedMaze;
  }, [generatedMaze]);

  return (
    <>
      <div className="flex flex-col">
        {generatedMaze.map((row) => {
          return (
            <div className="flex">
              {row.map((col) => {
                return (
                  <div
                    className={`${col ? "bg-green-300" : "bg-red-300"}`}
                    style={{
                      minWidth: `${PIXEL_SIZE}px`,
                      minHeight: `${PIXEL_SIZE}px`,
                    }}
                  ></div>
                );
              })}
            </div>
          );
        })}
        <Player maze={generatedMaze} />
      </div>
    </>
  );
};

export default Maze;
