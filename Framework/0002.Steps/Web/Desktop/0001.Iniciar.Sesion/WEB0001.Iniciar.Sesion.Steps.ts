import { Given, When, Then } from '@cucumber/cucumber';
import { Actor } from '../../../../0003.Actors/Actor';
import { AbrirLaAplicacion } from '../../../../0007.Tasks/Web/General/WG0001.Navigate.To.Task';
import { IniciarSesion, IntentarIniciarSesion } from '../../../../0007.Tasks/Web/Desktop/000.Iniciar.Sesion/Login';
import { ClickElement } from '../../../../0004.Interactions/I0001.Click.Element';
import { SeeElement } from '../../../../0008.Questions/Q0002.See.Element';
import { SeeText } from '../../../../0008.Questions/Q0003.See.Text';
import { ElementNoVisible } from '../../../../0008.Questions/Q0001.Element.No.Visible';
import { PageIniciarSesion } from '../../../../0005.Interfaces/Web/Desktop/000.Iniciar.Sesion/Page.0001.Iniciar.Sesion';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';
import { usuario } from '../../../../0006.Models/Usuarios';

/**
 * Los steps no saben pulsar ni escribir: solo traducen una frase de negocio a
 * una task. Si un step contiene un selector, la capa se ha roto.
 */

let ana: Actor;

Given('(que ){word} abre la aplicación', async function (nombre: string) {
  ana = new Actor(nombre);
  await ana.attemptsTo(AbrirLaAplicacion.ahora());
});

/**
 * Una sola definición por patrón.
 *
 * Cucumber-JS no distingue Given de When: son alias del mismo registro. Definir
 * la misma frase con los dos la vuelve ambigua y el escenario muere con
 * "Multiple step definitions match" sin haber tocado la aplicación. El Gherkin
 * sí puede usarla como Dado o como Cuando — eso es cosa del idioma, no del código.
 */
Given('(que )ingresa como {string}', async function (perfil: string) {
  await ana.attemptsTo(IniciarSesion.como(usuario(perfil)));
});

When('(que )intenta ingresar como {string}', async function (perfil: string) {
  await ana.attemptsTo(IntentarIniciarSesion.como(usuario(perfil)));
});

When('cierra la sesión', async function () {
  await ana.attemptsTo(ClickElement.en(PageTareas.botonSalir, 'Salir'));
});

Then('ve la pantalla de tareas', async function () {
  await ana.attemptsTo(SeeElement.el(PageTareas.pantalla, 'pantalla de tareas'));
});

Then('ve la pantalla de ingreso', async function () {
  await ana.attemptsTo(SeeElement.el(PageIniciarSesion.pantalla, 'pantalla de ingreso'));
});

Then('el saludo dice {string}', async function (texto: string) {
  await ana.attemptsTo(SeeText.el(texto).en(PageTareas.saludo));
});

Then('ve el mensaje de error {string}', async function (texto: string) {
  await ana.attemptsTo(SeeText.el(texto).en(PageIniciarSesion.mensajeError));
});

Then('sigue fuera de la pantalla de tareas', async function () {
  await ana.attemptsTo(ElementNoVisible.el(PageTareas.pantalla, 'pantalla de tareas'));
});

/** El actor del escenario en curso, para que otros archivos de steps lo reutilicen. */
export function actorActual(): Actor {
  if (!ana) throw new Error('Ningún actor ha entrado en escena: falta el paso "abre la aplicación".');
  return ana;
}
