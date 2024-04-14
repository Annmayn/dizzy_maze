import { Coordinates, fromCoordinates, toCoordinates } from "./coordinates.ts";
import { MazeType } from "../components/maze.tsx";
import { Direction } from "./direction.ts";

const VISITED = 1;
const UNVISITED = 0;
export const generateMaze = (row: number, col: number) => {
  const rowSize = 2 * row - 1 + 2;
  const colSize = 2 * col - 1 + 2;
  const maze: MazeType = Array.from(new Array(rowSize), () =>
    new Array(colSize).fill(UNVISITED),
  );
  updateMaze(rowSize, colSize, maze);
  return maze;
};

const updateMaze = (rowSize: number, colSize: number, maze: MazeType) => {
  let row = 1;
  let col = 1;
  let coordinates = toCoordinates(-1, -1);
  const stack: Coordinates[] = [coordinates];
  maze[row][col] = VISITED;
  while (stack.length > 0) {
    coordinates = toCoordinates(row, col);
    const possibleDirections = getPossibleDirections(maze, coordinates);
    if (possibleDirections.length == 0) {
      coordinates = stack.pop()!;
      [row, col] = fromCoordinates(coordinates);
      continue;
    }
    stack.push(coordinates);

    const randomDirection =
      possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

    const [newRow, newCol] = moveInDirection(randomDirection, row, col);
    markPathVisited(maze, coordinates, randomDirection);
    coordinates = toCoordinates(newRow, newCol);
    [row, col] = fromCoordinates(coordinates);

    if (row == rowSize - 2 && col == colSize - 2) {
      coordinates = stack.pop()!;
      [row, col] = fromCoordinates(coordinates);
    }
  }
  return maze;
};

const getPossibleDirections = (
  maze: number[][],
  currentPosition: Coordinates,
): Direction[] => {
  const [x, y] = fromCoordinates(currentPosition);
  const possibleDirections: Direction[] = [];
  if (isVisited(maze[x]?.[y - 2]) === false)
    possibleDirections.push(Direction.LEFT);
  if (isVisited(maze[x]?.[y + 2]) === false)
    possibleDirections.push(Direction.RIGHT);
  if (isVisited(maze[x - 2]?.[y]) === false)
    possibleDirections.push(Direction.UP);
  if (isVisited(maze[x + 2]?.[y]) === false)
    possibleDirections.push(Direction.DOWN);
  return possibleDirections;
};

const isVisited = (value: number | undefined) => {
  if (value == undefined) return undefined;
  return value == VISITED;
};

const moveInDirection = (direction: Direction, row: number, col: number) => {
  switch (direction) {
    case Direction.UP:
      return [row - 2, col];
    case Direction.DOWN:
      return [row + 2, col];
    case Direction.LEFT:
      return [row, col - 2];
    case Direction.RIGHT:
      return [row, col + 2];
    default:
      return [row, col];
  }
};

const markPathVisited = (
  maze: MazeType,
  position: Coordinates,
  direction: Direction,
) => {
  const [row, col] = fromCoordinates(position);
  switch (direction) {
    case Direction.UP:
      if (isValidCoordinate(toCoordinates(row - 1, col), maze))
        maze[row - 1][col] = VISITED;
      if (isValidCoordinate(toCoordinates(row - 2, col), maze))
        maze[row - 2][col] = VISITED;
      break;
    case Direction.DOWN:
      if (isValidCoordinate(toCoordinates(row + 1, col), maze))
        maze[row + 1][col] = VISITED;
      if (isValidCoordinate(toCoordinates(row + 2, col), maze))
        maze[row + 2][col] = VISITED;
      break;
    case Direction.LEFT:
      if (isValidCoordinate(toCoordinates(row, col - 1), maze))
        maze[row][col - 1] = VISITED;
      if (isValidCoordinate(toCoordinates(row, col - 2), maze))
        maze[row][col - 2] = VISITED;
      break;
    case Direction.RIGHT:
      if (isValidCoordinate(toCoordinates(row, col + 1), maze))
        maze[row][col + 1] = VISITED;
      if (isValidCoordinate(toCoordinates(row, col + 2), maze))
        maze[row][col + 2] = VISITED;
      break;
  }
};

const isValidCoordinate = (coordinates: Coordinates, maze: MazeType) => {
  const rowSize = maze.length;
  const colSize = maze[0].length;
  const [row, col] = fromCoordinates(coordinates);
  return !(row < 0 || col < 0 || row >= rowSize || col >= colSize);
};
