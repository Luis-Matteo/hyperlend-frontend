interface IPoints {
  totalPoints: number;
  pointsIncrease: number;
  pointsPercentIncrease: number;
  level: number;
  progress: number;
}

export function getUserPoints(): IPoints {
  return {
    totalPoints: 0,
    pointsIncrease: 0,
    pointsPercentIncrease: 0,
    level: 0,
    progress: 0,
  };
}
