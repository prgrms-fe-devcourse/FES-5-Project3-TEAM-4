export function computeEllipseAxes(
  stageWidth: number,
  maxThetaDeg: number,
  sideMarginRatio: number,
  verticalRatio: number
) {
  const usable = Math.max(0, stageWidth * (1 - sideMarginRatio));
  const halfChord = usable / 2;
  const theta = (maxThetaDeg * Math.PI) / 180;
  const a = halfChord > 0 && Math.sin(theta) > 0 ? halfChord / Math.sin(theta) : 600;
  const b = Math.max(80, a * verticalRatio);
  return { a, b };
}

export function getFanTransformsEllipse(
  n: number,
  maxThetaDeg: number,
  a: number,
  b: number,
  rotFactor = 0.68,
  overlapTangentPx = -20,
  bowPx = 12,
  baselinePx = 0 // ← 추가
) {
  if (n <= 1) return ['translateX(-50%) translateY(0px)'];
  const start = -maxThetaDeg,
    end = maxThetaDeg;

  return Array.from({ length: n }).map((_, i) => {
    const t = i / (n - 1);
    const degBase = start + (end - start) * t;
    const deg = -degBase;
    const rad = (deg * Math.PI) / 180;

    const x = a * Math.sin(rad);
    const yArc = b * (1 - Math.cos(rad));
    const bow = bowPx * Math.sin(rad) ** 2;

    const ty = -(yArc + bow) + baselinePx; // ← 베이스라인 보정
    const txOverlap = overlapTangentPx * Math.cos(rad);
    const tyOverlap = -overlapTangentPx * Math.sin(rad);
    const rot = -deg * rotFactor;

    return `translateX(calc(-50% + ${(x + txOverlap).toFixed(2)}px)) translateY(${(ty + tyOverlap).toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`;
  });
}
