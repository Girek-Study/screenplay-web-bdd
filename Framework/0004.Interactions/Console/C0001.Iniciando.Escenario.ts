/** Marca el inicio de un escenario en la consola. Útil al mirar una corrida larga. */
export function iniciandoEscenario(nombre: string): void {
  console.log(`\x1b[36m▸ \x1b[1m${nombre}\x1b[0m`);
}
