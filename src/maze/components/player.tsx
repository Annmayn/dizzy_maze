import { useCallback, useEffect, useRef } from "react";
import { Direction } from "../utils/direction.ts";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";
import { canMoveToNewCoordinates } from "../utils/canMoveToNewCoordinates.ts";
import {
  Coordinates,
  fromCoordinates,
  toCoordinates,
} from "../utils/coordinates.ts";
import { useGameActions } from "../hooks/useTimer.tsx";

export type MazeType = number[][];

export interface PlayerProps {
  maze: MazeType;
  onPositionChange?: (x: number, y: number) => void;
}

const helperKeys = ["h", "H", "f", "F", " "];

const rotationFor = (direction: Direction) => {
  if (direction === Direction.DOWN) return 90;
  if (direction === Direction.LEFT) return 0;
  if (direction === Direction.UP) return -90;
  if (direction === Direction.RIGHT) return 180;
  return -90;
};

const Player = ({ maze, onPositionChange }: PlayerProps) => {
  const {
    refs: gameRefs,
    setStartTimer,
    setHasGameEnded,
    setFinalScore,
    setOpenSnackBar,
    setShowSolution,
  } = useGameActions();

  const initialX =
    (maze[0].length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_Y) / 2);
  const initialY =
    (maze.length - 2) * PIXEL_SIZE +
    Math.floor((PIXEL_SIZE - PLAYER_PIXEL_X) / 2);

  const playerElRef = useRef<HTMLDivElement>(null);
  const playerDirectionRef = useRef(Direction.NEUTRAL);
  const rotationRef = useRef(rotationFor(Direction.NEUTRAL));
  const mazeRef = useRef<MazeType>(maze);
  const frameRef = useRef<number>();
  const prevTimeRef = useRef<number>();
  const playerPosRef = useRef<Coordinates>(toCoordinates(initialX, initialY));
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  const paintPlayer = useCallback((x: number, y: number) => {
    const el = playerElRef.current;
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rotationRef.current}deg)`;
  }, []);

  const placePlayer = useCallback(
    (x: number, y: number) => {
      playerPosRef.current = toCoordinates(x, y);
      paintPlayer(x, y);
      onPositionChangeRef.current?.(x, y);
    },
    [paintPlayer],
  );

  useEffect(() => {
    const nextX =
      (maze[0].length - 2) * PIXEL_SIZE +
      Math.floor((PIXEL_SIZE - PLAYER_PIXEL_Y) / 2);
    const nextY =
      (maze.length - 2) * PIXEL_SIZE +
      Math.floor((PIXEL_SIZE - PLAYER_PIXEL_X) / 2);
    playerDirectionRef.current = Direction.NEUTRAL;
    rotationRef.current = rotationFor(Direction.NEUTRAL);
    mazeRef.current = maze;
    placePlayer(nextX, nextY);
  }, [maze, placePlayer]);

  const resetPlayer = useCallback(() => {
    playerDirectionRef.current = Direction.NEUTRAL;
    rotationRef.current = rotationFor(Direction.NEUTRAL);
    placePlayer(initialX, initialY);
    setStartTimer(false);
    setHasGameEnded(false);
    setFinalScore(0);
  }, [
    initialX,
    initialY,
    placePlayer,
    setFinalScore,
    setHasGameEnded,
    setStartTimer,
  ]);

  useEffect(() => {
    const setDirection = (direction: Direction) => {
      playerDirectionRef.current = direction;
      rotationRef.current = rotationFor(direction);
      const [x, y] = fromCoordinates(playerPosRef.current);
      paintPlayer(x, y);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        !helperKeys.includes(e.key) &&
        !gameRefs.current.startTimer &&
        !gameRefs.current.hasGameEnded
      ) {
        setStartTimer(true);
      }
      switch (e.key) {
        case "w":
        case "W":
          setDirection(Direction.UP);
          break;
        case "s":
        case "S":
          setDirection(Direction.DOWN);
          break;
        case "a":
        case "A":
          setDirection(Direction.LEFT);
          break;
        case "d":
        case "D":
          setDirection(Direction.RIGHT);
          break;
        case "r":
        case "R":
          resetPlayer();
          break;
        case "h":
        case "H":
          setOpenSnackBar(true);
          break;
        case "f":
        case "F":
          setShowSolution((solution) => !solution);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameRefs,
    paintPlayer,
    resetPlayer,
    setOpenSnackBar,
    setShowSolution,
    setStartTimer,
  ]);

  const hasReachedFinishLine = (x: number, y: number) => {
    return x / PLAYER_PIXEL_X < 2 && y / PLAYER_PIXEL_Y < 2;
  };

  useEffect(() => {
    const updatePosition = () => {
      const currentMaze = mazeRef.current;
      const direction = playerDirectionRef.current;
      if (direction === Direction.NEUTRAL) return;

      const [x, y] = fromCoordinates(playerPosRef.current);
      if (hasReachedFinishLine(x, y)) {
        setStartTimer(false);
        setHasGameEnded(true);
        return;
      }

      const multiplier = 7.5;
      let nextX = x;
      let nextY = y;

      if (direction === Direction.UP) {
        const candidate = y - multiplier;
        if (canMoveToNewCoordinates(currentMaze, toCoordinates(x, candidate))) {
          nextY = candidate;
        }
      } else if (direction === Direction.DOWN) {
        const candidate = y + multiplier;
        if (canMoveToNewCoordinates(currentMaze, toCoordinates(x, candidate))) {
          nextY = candidate;
        }
      } else if (direction === Direction.LEFT) {
        const candidate = x - multiplier;
        if (canMoveToNewCoordinates(currentMaze, toCoordinates(candidate, y))) {
          nextX = candidate;
        }
      } else if (direction === Direction.RIGHT) {
        const candidate = x + multiplier;
        if (canMoveToNewCoordinates(currentMaze, toCoordinates(candidate, y))) {
          nextX = candidate;
        }
      }

      if (nextX === x && nextY === y) return;
      placePlayer(nextX, nextY);
    };

    const animatePlayer = (time: number) => {
      if (prevTimeRef.current != null) {
        updatePosition();
      }
      prevTimeRef.current = time;
      frameRef.current = requestAnimationFrame(animatePlayer);
    };

    frameRef.current = requestAnimationFrame(animatePlayer);
    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [placePlayer, setHasGameEnded, setStartTimer]);

  return (
    <div
      ref={playerElRef}
      className="absolute left-0 top-0 z-10"
      style={{
        background: "url(assets/car.png) no-repeat center",
        backgroundSize: "cover",
        transform: `translate(${initialX}px, ${initialY}px) rotate(${rotationRef.current}deg)`,
        minWidth: `${PLAYER_PIXEL_Y}px`,
        width: `${PLAYER_PIXEL_Y}px`,
        minHeight: `${PLAYER_PIXEL_X}px`,
        height: `${PLAYER_PIXEL_X}px`,
      }}
    />
  );
};

export default Player;
