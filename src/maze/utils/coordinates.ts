export type Coordinates = string;
export const toCoordinates = (x: number, y: number): Coordinates => {
  return `${x},${y}`;
};

export const fromCoordinates = (key: Coordinates) => {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
};
