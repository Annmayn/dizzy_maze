import { useEffect, useRef } from "react";
import { PIXEL_SIZE } from "../../common.ts";
import Player from "./player.tsx";
import { Score } from "./Score.tsx";

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

  const isPath = (val: number) => val == 1;
  return (
    <>
      <div className="flex flex-col">
        {generatedMaze.map((row, rowInd) => {
          return (
            <div className="flex">
              {row.map((col, colInd) => {
                const assetName =
                  rowInd == 1 && colInd == 1
                    ? "url(assets/end.png)"
                    : rowInd == generatedMaze.length - 2 &&
                        colInd == generatedMaze[0].length - 2
                      ? "url(assets/start.png)"
                      : isPath(col)
                        ? ""
                        : "url(assets/wall.png)";
                return (
                  <div
                    className="bg-gray-200"
                    style={{
                      backgroundImage: `${assetName}`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      minWidth: `${PIXEL_SIZE}px`,
                      minHeight: `${PIXEL_SIZE}px`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
        <Player maze={generatedMaze} />
        <Score />
      </div>
    </>
  );
};

export default Maze;
