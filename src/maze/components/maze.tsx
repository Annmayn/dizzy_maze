import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";
import Player from "./player.tsx";
import { Score } from "./Score.tsx";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
  generatedMaze: MazeType;
  showSolution: boolean;
}

const isPath = (val: number) => val == 1 || val == 2;
const isSolution = (val: number) => val == 2;

const Maze = ({ generatedMaze, showSolution }: MazeProps) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const playerPosRef = useRef({ x: 0, y: 0 });
  const overviewRef = useRef(false);
  const mazeSizeRef = useRef({
    rows: generatedMaze.length,
    cols: generatedMaze[0].length,
  });

  const applyCamera = useCallback(() => {
    const viewport = viewportRef.current;
    const world = worldRef.current;
    if (!viewport || !world) return;

    if (overviewRef.current) {
      const mazeWidth = mazeSizeRef.current.cols * PIXEL_SIZE;
      const mazeHeight = mazeSizeRef.current.rows * PIXEL_SIZE;
      const scale = Math.min(
        viewport.clientWidth / mazeWidth,
        viewport.clientHeight / mazeHeight,
        1,
      );
      const tx = (viewport.clientWidth - mazeWidth * scale) / 2;
      const ty = (viewport.clientHeight - mazeHeight * scale) / 2;
      world.style.transformOrigin = "0 0";
      world.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      return;
    }

    const { x: playerX, y: playerY } = playerPosRef.current;
    // Don't pan past the maze origin — keep the top-left fixed once it's visible.
    const cameraX = Math.min(
      0,
      viewport.clientWidth / 2 - playerX - PLAYER_PIXEL_Y / 2,
    );
    const cameraY = Math.min(
      0,
      viewport.clientHeight / 2 - playerY - PLAYER_PIXEL_X / 2,
    );
    world.style.transformOrigin = "0 0";
    world.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
  }, []);

  const setCameraTransition = useCallback((enabled: boolean) => {
    const world = worldRef.current;
    if (!world) return;
    world.style.transition = enabled
      ? "transform 450ms ease-in-out"
      : "none";
  }, []);

  const updateCamera = useCallback(
    (playerX: number, playerY: number) => {
      playerPosRef.current = { x: playerX, y: playerY };
      // Overview is a fixed full-maze framing — skip follow-cam updates while active.
      if (overviewRef.current) return;
      setCameraTransition(false);
      applyCamera();
    },
    [applyCamera, setCameraTransition],
  );

  useEffect(() => {
    mazeSizeRef.current = {
      rows: generatedMaze.length,
      cols: generatedMaze[0].length,
    };
    overviewRef.current = false;
    setCameraTransition(false);
    applyCamera();
  }, [generatedMaze, applyCamera, setCameraTransition]);

  useEffect(() => {
    const handleResize = () => {
      setCameraTransition(false);
      applyCamera();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [applyCamera, setCameraTransition]);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "transform") return;
      // Drop the transition after the zoom so follow-cam pans stay instant.
      setCameraTransition(false);
    };

    world.addEventListener("transitionend", handleTransitionEnd);
    return () => world.removeEventListener("transitionend", handleTransitionEnd);
  }, [setCameraTransition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.key !== " ") return;
      if (e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      setCameraTransition(true);
      overviewRef.current = !overviewRef.current;
      applyCamera();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [applyCamera, setCameraTransition]);

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
    <div ref={viewportRef} className="relative h-full w-full overflow-hidden">
      <div
        ref={worldRef}
        className="relative inline-block will-change-transform"
      >
        {cachedGeneratedMaze}
        <Player maze={generatedMaze} onPositionChange={updateCamera} />
      </div>
      <Score />
    </div>
  );
};

export default memo(Maze);
