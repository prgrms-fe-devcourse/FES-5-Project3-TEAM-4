export function getRandom(min: number, max: number): number {
  //min:최솟값
  //max:최댓값
  return min + Math.random() * (max - min);
}
