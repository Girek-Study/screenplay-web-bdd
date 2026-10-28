/** Marca el cierre de un escenario, con su resultado. */
export function finalizandoEscenario(nombre: string, paso: boolean): void {
  const color = paso ? '\x1b[32m' : '\x1b[31m';
  const marca = paso ? '✓' : '✗';
  console.log(`${color}${marca} \x1b[0m${nombre}`);
}
