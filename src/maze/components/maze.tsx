import { useCallback, useEffect, useRef, useState } from "react";
import { Direction } from "../utils/direction.ts";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";
import { canMoveToNewCoordinates } from "../utils/canMoveToNewCoordinates.ts";
import {
  Coordinates,
  fromCoordinates,
  toCoordinates,
} from "../utils/coordinates.ts";

export type MazeType = number[][];

export interface MazeProps {
  row: number;
  col: number;
  generatedMaze: MazeType;
}

const Maze = ({ generatedMaze }: MazeProps) => {
  const [playerDirection, setPlayerDirection] = useState(Direction.NEUTRAL);
  const playerDirectionRef = useRef<Direction>();
  const currentTimeRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const initialX =
    (generatedMaze.length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_Y) / 2);
  const initialY =
    (generatedMaze.length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_X) / 2);

  const [playerX, setPlayerX] = useState(initialX);
  const [playerY, setPlayerY] = useState(initialY);
  const playerPosRef = useRef<Coordinates>(toCoordinates(playerX, playerY));

  const resetPlayer = () => {
    setPlayerDirection(Direction.NEUTRAL);
    setPlayerX(initialX);
    setPlayerY(initialY);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case "w":
        setPlayerDirection(Direction.UP);
        break;
      case "s":
        setPlayerDirection(Direction.DOWN);
        break;
      case "a":
        setPlayerDirection(Direction.LEFT);
        break;
      case "d":
        setPlayerDirection(Direction.RIGHT);
        break;
      case "r":
        resetPlayer();
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  const updatePosition = (playerDirection: Direction, timedelta: number) => {
    if (playerDirection == Direction.NEUTRAL) return;
    const [x, y] = fromCoordinates(playerPosRef.current);
    const multiplier = timedelta * 0.3;
    if (playerDirection == Direction.UP) {
      const newCoords = toCoordinates(x, y - multiplier);
      setPlayerY(
        canMoveToNewCoordinates(generatedMaze, newCoords) ? y - multiplier : y,
      );
    }
    if (playerDirection == Direction.DOWN) {
      const newCoords = toCoordinates(x, y + multiplier);
      setPlayerY(
        canMoveToNewCoordinates(generatedMaze, newCoords) ? y + multiplier : y,
      );
    }
    if (playerDirection == Direction.LEFT) {
      const newCoords = toCoordinates(x - multiplier, y);
      setPlayerX(
        canMoveToNewCoordinates(generatedMaze, newCoords) ? x - multiplier : x,
      );
    }
    if (playerDirection == Direction.RIGHT) {
      const newCoords = toCoordinates(x + multiplier, y);
      setPlayerX(
        canMoveToNewCoordinates(generatedMaze, newCoords) ? x + multiplier : x,
      );
    }
  };

  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  useEffect(() => {
    playerPosRef.current = toCoordinates(playerX, playerY);
  }, [playerX, playerY]);

  const animatePlayer = (time: number) => {
    if (prevTimeRef.current && playerDirectionRef.current != undefined) {
      const timedelta = time - prevTimeRef.current;
      updatePosition(playerDirectionRef.current, timedelta);
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
        <div
          className={`bg-purple-400 absolute`}
          style={{
            transform: `translate(${playerX}px, ${playerY}px)`,
            minWidth: `${PLAYER_PIXEL_Y}px`,
            width: `${PLAYER_PIXEL_Y}px`,
            minHeight: `${PLAYER_PIXEL_X}px`,
            height: `${PLAYER_PIXEL_X}px`,
          }}
        >
          Player
        </div>
      </div>
    </>
  );
};

export default Maze;
