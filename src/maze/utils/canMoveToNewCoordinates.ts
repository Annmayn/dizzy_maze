import { MazeType } from "../components/maze.tsx";
import { Coordinates, fromCoordinates, toCoordinates } from "./coordinates.ts";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";

export const canMoveToNewCoordinates = (
  maze: MazeType,
  newCoordinate: Coordinates,
) => {
  const [newPlayerX, newPlayerY] = fromCoordinates(newCoordinate);
  const mazeTotalX = maze.length * PIXEL_SIZE;
  const mazeTotalY = maze.length * PIXEL_SIZE;
  const newCoordinates = [
    newCoordinate,
    toCoordinates(newPlayerX, newPlayerY + PLAYER_PIXEL_X),
    toCoordinates(newPlayerX + PLAYER_PIXEL_Y, newPlayerY),
    toCoordinates(newPlayerX + PLAYER_PIXEL_Y, newPlayerY + PLAYER_PIXEL_X),
  ];
  for (const coordinates of newCoordinates) {
    const [y, x] = fromCoordinates(coordinates);
    const mazeX = Math.floor(x / PIXEL_SIZE);
    const mazeY = Math.floor(y / PIXEL_SIZE);
    if (mazeX > mazeTotalX || mazeY > mazeTotalY) return false;
    if (maze[mazeX][mazeY] === 0) return false;
  }
  return true;
};
