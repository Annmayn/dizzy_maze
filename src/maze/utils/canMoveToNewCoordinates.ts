import { MazeType } from "../components/maze.tsx";
import { Coordinates, fromCoordinates, toCoordinates } from "./coordinates.ts";
import { PIXEL_SIZE, PLAYER_PIXEL_X, PLAYER_PIXEL_Y } from "../../common.ts";

export const canMoveToNewCoordinates = (
  maze: MazeType,
  newCoordinate: Coordinates,
) => {
  const [newPlayerX, newPlayerY] = fromCoordinates(newCoordinate);
  const rows = maze.length;
  const cols = maze[0]?.length ?? 0;
  const newCoordinates = [
    newCoordinate, // top left
    toCoordinates(newPlayerX, newPlayerY + PLAYER_PIXEL_X - 1), // bottom left
    toCoordinates(newPlayerX + PLAYER_PIXEL_Y - 1, newPlayerY), // top right
    toCoordinates(
      newPlayerX + PLAYER_PIXEL_Y - 1,
      newPlayerY + PLAYER_PIXEL_X - 1,
    ), // bottom right
  ];
  for (const coordinates of newCoordinates) {
    const [y, x] = fromCoordinates(coordinates);
    const mazeX = Math.floor(x / PIXEL_SIZE);
    const mazeY = Math.floor(y / PIXEL_SIZE);
    if (mazeX < 0 || mazeY < 0 || mazeX >= rows || mazeY >= cols) return false;
    if (maze[mazeX][mazeY] === 0) return false;
  }
  return true;
};
