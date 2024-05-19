import { useCallback, useEffect, useRef, useState } from "react";
import { Direction } from "../utils/direction.ts";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";
import { canMoveToNewCoordinates } from "../utils/canMoveToNewCoordinates.ts";
import {
  Coordinates,
  fromCoordinates,
  toCoordinates,
} from "../utils/coordinates.ts";
import { useTimer } from "../hooks/useTimer.tsx";

export type MazeType = number[][];

export interface PlayerProps {
  maze: MazeType;
}

const Player = ({ maze }: PlayerProps) => {
  const {
    startTimer,
    setStartTimer,
    setCurrentTime,
    hasGameEnded,
    setHasGameEnded,
    setOpenSnackBar,
  } = useTimer();
  const initialX =
    (maze[0].length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_Y) / 2);

  const initialY =
    (maze.length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_X) / 2);

  const [playerDirection, setPlayerDirection] = useState(Direction.NEUTRAL);
  const playerDirectionRef = useRef<Direction>();
  const mazeRef = useRef<MazeType>(maze);
  const currentTimeRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const [playerX, setPlayerX] = useState(initialX);
  const [playerY, setPlayerY] = useState(initialY);
  const playerPosRef = useRef<Coordinates>(toCoordinates(playerX, playerY));

  useEffect(() => {
    playerDirectionRef.current = playerDirection;
  }, [playerDirection]);

  useEffect(() => {
    playerPosRef.current = toCoordinates(playerX, playerY);
  }, [playerX, playerY]);

  useEffect(() => {
    setPlayerX(
      (maze[0].length - 2) * PIXEL_SIZE +
        Math.floor((PIXEL_SIZE - PLAYER_PIXEL_Y) / 2),
    );
    setPlayerY(
      (maze.length - 2) * PIXEL_SIZE +
        Math.floor((PIXEL_SIZE - PLAYER_PIXEL_X) / 2),
    );
    setPlayerDirection(Direction.NEUTRAL);
    mazeRef.current = maze;
  }, [maze]);

  const resetPlayer = useCallback(() => {
    setPlayerDirection(Direction.NEUTRAL);
    setPlayerX(initialX);
    setPlayerY(initialY);
    setStartTimer(false);
    setCurrentTime(0);
    setHasGameEnded(false);
  }, [initialX, initialY]);

  const showHelp = useCallback(() => {
    setOpenSnackBar(true);
  }, [setOpenSnackBar]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!startTimer && !hasGameEnded) setStartTimer(true);
      switch (e.key) {
        case "w":
        case "W":
          setPlayerDirection(Direction.UP);
          break;
        case "s":
        case "S":
          setPlayerDirection(Direction.DOWN);
          break;
        case "a":
        case "A":
          setPlayerDirection(Direction.LEFT);
          break;
        case "d":
        case "D":
          setPlayerDirection(Direction.RIGHT);
          break;
        case "r":
        case "R":
          resetPlayer();
          break;
        case "h":
        case "H":
          showHelp();
      }
    },
    [startTimer, hasGameEnded, setStartTimer, resetPlayer, showHelp],
  );

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [handleKeyPress]);

  const hasReachedFinishLine = (x: number, y: number) => {
    return x / PLAYER_PIXEL_X < 2 && y / PLAYER_PIXEL_Y < 2;
  };

  const updatePosition = (timedelta: number) => {
    const maze = mazeRef.current;
    const playerDirection = playerDirectionRef.current;
    if (playerDirection == Direction.NEUTRAL) return;
    const [x, y] = fromCoordinates(playerPosRef.current);
    if (hasReachedFinishLine(x, y)) {
      setStartTimer(false);
      setHasGameEnded(true);
      return;
    }
    const multiplier = timedelta * 0.3;
    if (playerDirection == Direction.UP) {
      const newCoords = toCoordinates(x, y - multiplier);
      setPlayerY(canMoveToNewCoordinates(maze, newCoords) ? y - multiplier : y);
    }
    if (playerDirection == Direction.DOWN) {
      const newCoords = toCoordinates(x, y + multiplier);
      setPlayerY(canMoveToNewCoordinates(maze, newCoords) ? y + multiplier : y);
    }
    if (playerDirection == Direction.LEFT) {
      const newCoords = toCoordinates(x - multiplier, y);
      setPlayerX(canMoveToNewCoordinates(maze, newCoords) ? x - multiplier : x);
    }
    if (playerDirection == Direction.RIGHT) {
      const newCoords = toCoordinates(x + multiplier, y);
      setPlayerX(canMoveToNewCoordinates(maze, newCoords) ? x + multiplier : x);
    }
  };

  const animatePlayer = (time: number) => {
    if (prevTimeRef.current && playerDirectionRef.current != undefined) {
      const timedelta = time - prevTimeRef.current;
      updatePosition(timedelta);
    }
    prevTimeRef.current = time;
    currentTimeRef.current = requestAnimationFrame(animatePlayer);
  };

  useEffect(() => {
    currentTimeRef.current = requestAnimationFrame(animatePlayer);
    return () => cancelAnimationFrame(currentTimeRef.current!);
  }, []);

  const rotation =
    playerDirection == Direction.DOWN
      ? 90
      : playerDirection == Direction.LEFT
        ? 0
        : playerDirection == Direction.UP
          ? -90
          : playerDirection == Direction.RIGHT
            ? 180
            : -90;
  return (
    <div
      className={`bg-purple-400 absolute`}
      style={{
        background: "url(assets/car.png) no-repeat center",
        backgroundSize: "cover",
        transform: `translate(${playerX}px, ${playerY}px) rotate(${rotation}deg)`,
        minWidth: `${PLAYER_PIXEL_Y}px`,
        width: `${PLAYER_PIXEL_Y}px`,
        minHeight: `${PLAYER_PIXEL_X}px`,
        height: `${PLAYER_PIXEL_X}px`,
      }}
    />
  );
};

export default Player;
