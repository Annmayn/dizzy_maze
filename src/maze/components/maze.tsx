import { useCallback, useEffect, useMemo, useRef } from "react";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";
import Player from "./player.tsx";
import { Score } from "./Score.tsx";
import { useTimer } from "../hooks/useTimer.tsx";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
  generatedMaze: MazeType;
}

const Maze = ({ generatedMaze }: MazeProps) => {
  const { showSolution } = useTimer();
  const mazeRef = useRef<MazeType>(generatedMaze);
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const playerPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    mazeRef.current = generatedMaze;
  }, [generatedMaze]);

  const updateCamera = useCallback((playerX: number, playerY: number) => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;

    playerPosRef.current = { x: playerX, y: playerY };
    const cameraX = viewport.clientWidth / 2 - playerX - PLAYER_PIXEL_Y / 2;
    const cameraY = viewport.clientHeight / 2 - playerY - PLAYER_PIXEL_X / 2;
    world.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const { x, y } = playerPosRef.current;
      updateCamera(x, y);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCamera]);

  const isPath = (val: number) => val == 1 || val == 2;
  const isSolution = (val: number) => val == 2;
  const cachedGeneratedMaze = useMemo(() => {
    return generatedMaze.map((row, rowInd) => {
      return (
        <div className="flex" key={rowInd}>
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
                key={`${rowInd}-${colInd}`}
                className="bg-gray-200"
                style={{
                  backgroundImage: `${assetName}`,
                  backgroundColor:
                    showSolution && isSolution(col) ? "forestgreen" : "",
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
    });
  }, [generatedMaze, showSolution]);
  return (
    <>
      <div
        ref={viewportRef}
        className="relative h-full w-full overflow-hidden"
      >
        <div ref={worldRef} className="relative inline-block will-change-transform">
          {cachedGeneratedMaze}
          <Player maze={generatedMaze} onPositionChange={updateCamera} />
        </div>
        <Score />
      </div>
    </>
  );
};

export default Maze;
