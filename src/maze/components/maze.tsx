import { useCallback, useEffect, useRef, useState } from "react";
import { Direction } from "../utils/direction.ts";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
  generatedMaze: MazeType;
}

const Maze = ({ generatedMaze }: MazeProps) => {
  const [playerDirection, setPlayerDirection] = useState(Direction.NEUTRAL);
  const playerRef = useRef<Direction>();
  const currentTimeRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const [playerX, setPlayerX] = useState(0);
  const [playerY, setPlayerY] = useState(0);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key == "w") setPlayerDirection(Direction.UP);
    else if (e.key == "s") setPlayerDirection(Direction.DOWN);
    else if (e.key == "a") setPlayerDirection(Direction.LEFT);
    else if (e.key == "d") setPlayerDirection(Direction.RIGHT);
  }, []);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  const updatePosition = (playerDirection: Direction, timedelta: number) => {
    const multiplier = timedelta * 0.3;
    if (playerDirection == Direction.UP)
      setPlayerY((playerY) => playerY - multiplier);
    if (playerDirection == Direction.DOWN)
      setPlayerY((playerY) => playerY + multiplier);
    if (playerDirection == Direction.LEFT)
      setPlayerX((playerX) => playerX - multiplier);
    if (playerDirection == Direction.RIGHT)
      setPlayerX((playerX) => playerX + multiplier);
  };

  useEffect(() => {
    playerRef.current = playerDirection;
  }, [playerDirection]);

  const animatePlayer = (time: number) => {
    if (prevTimeRef.current && playerRef.current != undefined) {
      const timedelta = time - prevTimeRef.current;
      updatePosition(playerRef.current, timedelta);
    }
    prevTimeRef.current = time;
    currentTimeRef.current = requestAnimationFrame(animatePlayer);
  };

  useEffect(() => {
    currentTimeRef.current = requestAnimationFrame(animatePlayer);
    return () => cancelAnimationFrame(currentTimeRef.current!);
  }, []);

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
        <div
          className={`size-12 min-h-12 min-w-12 bg-purple-400 flex justify-center items-center absolute`}
          style={{ transform: `translate(${playerX}px, ${playerY}px)` }}
        >
          Player
        </div>
      </div>
    </>
  );
};

export default Maze;
