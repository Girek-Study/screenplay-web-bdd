/** Pantalla de tareas, ya con sesión iniciada. */
export class PageTareas {
  public static readonly pantalla = '[data-testid="pantalla-tareas"]';
  public static readonly saludo = '[data-testid="saludo"]';
  public static readonly campoNuevaTarea = '[data-testid="campo-nueva-tarea"]';
  public static readonly botonAgregar = '[data-testid="boton-agregar"]';
  public static readonly lista = '[data-testid="lista-tareas"]';
  public static readonly contadorPendientes = '[data-testid="contador-pendientes"]';
  public static readonly botonLimpiarCompletadas = '[data-testid="boton-limpiar-completadas"]';
  public static readonly mensajeVacio = '[data-testid="mensaje-vacio"]';
  public static readonly botonSalir = '[data-testid="boton-salir"]';

  /** Las filas de la lista. Se cuenta sobre esto, no sobre la lista entera. */
  public static readonly filas = '[data-testid="tarea"]';

  /** Una fila concreta, localizada por el texto que ve la persona. */
  private static fila(tarea: string): string {
    return `${PageTareas.filas}:has-text("${tarea}")`;
  }

  public static casillaDe(tarea: string): string {
    return `${PageTareas.fila(tarea)} [data-testid="tarea-completada"]`;
  }

  public static borrarDe(tarea: string): string {
    return `${PageTareas.fila(tarea)} [data-testid="tarea-eliminar"]`;
  }
}
