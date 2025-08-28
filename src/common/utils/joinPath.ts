export function joinPaths(base: string, child?: string): string {
  if (!child) return base || '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedChild = child.startsWith('/') ? child.slice(1) : child;
  return `${normalizedBase}/${normalizedChild}`;
}
