/**
 * Pantalla de ingreso.
 *
 * Solo selectores: ni una acción, ni una espera, ni una aserción. Cuando la
 * interfaz cambia, este es el único archivo que se toca.
 *
 * Los selectores van por `data-testid` y no por clase ni por texto: la clase
 * cambia con el rediseño y el texto cambia con el idioma.
 */
export class PageIniciarSesion {
  public static readonly pantalla = '[data-testid="pantalla-login"]';
  public static readonly campoUsuario = '[data-testid="campo-usuario"]';
  public static readonly campoClave = '[data-testid="campo-clave"]';
  public static readonly botonIngresar = '[data-testid="boton-ingresar"]';
  public static readonly mensajeError = '[data-testid="error-login"]';
}
