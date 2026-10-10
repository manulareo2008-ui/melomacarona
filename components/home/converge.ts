export type Point = { x: number; y: number };

/**
 * A curva das "trilhas que convergem" (design-system.md §4.5): sai na vertical,
 * puxa para o ponto e entra nele quase na vertical. O hero e o clímax da cena
 * usam a mesma, para que as respostas cheguem ao ponto como as trilhas chegam.
 */
export function convergePath(from: Point, to: Point) {
  const dy = to.y - from.y;
  const bend = to.x + (from.x - to.x) * 0.12;
  return (
    `M ${from.x} ${from.y} ` +
    `C ${from.x} ${from.y + dy * 0.37}, ${bend} ${from.y + dy * 0.625}, ${to.x} ${to.y}`
  );
}
