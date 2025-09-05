export function consumeHardReload(): boolean {
  const k = 'tarot:justReloaded';
  const just = sessionStorage.getItem(k) === '1';
  if (just) sessionStorage.removeItem(k);
  return just;
}
