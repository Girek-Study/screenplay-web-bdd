import { Given, When, Then } from '@cucumber/cucumber';
import { AgregarTarea } from '../../../../0007.Tasks/Web/Desktop/001.Tareas/Agregar.Tarea';
import { CompletarTarea } from '../../../../0007.Tasks/Web/Desktop/001.Tareas/Completar.Tarea';
import { EliminarTarea } from '../../../../0007.Tasks/Web/Desktop/001.Tareas/Eliminar.Tarea';
import { LimpiarCompletadas } from '../../../../0007.Tasks/Web/Desktop/001.Tareas/Limpiar.Completadas';
import { CountElements } from '../../../../0008.Questions/Q0005.Count.Elements';
import { SeeText } from '../../../../0008.Questions/Q0003.See.Text';
import { SeeElement } from '../../../../0008.Questions/Q0002.See.Element';
import { PageTareas } from '../../../../0005.Interfaces/Web/Desktop/001.Tareas/Page.0001.Tareas';
import { actorActual } from '../0001.Iniciar.Sesion/WEB0001.Iniciar.Sesion.Steps';

/**
 * Una definición por patrón, y el «que» entre paréntesis.
 *
 * Dos detalles del Gherkin en español que cuestan una tarde a quien no los sabe:
 *
 *  1. Cucumber-JS no distingue Given de When: son alias del mismo registro, así
 *     que declarar la misma frase con los dos la vuelve ambigua.
 *  2. En español la palabra clave es «Dado», no «Dado que». El «que» viaja
 *     dentro del texto del paso, así que `(que )` lo hace opcional y la misma
 *     definición sirve para «Dado que agrega…» y para «Cuando agrega…».
 */
Given('(que )agrega la tarea {string}', async function (tarea: string) {
  await actorActual().attemptsTo(AgregarTarea.con(tarea));
});

Given('(que )completa la tarea {string}', async function (tarea: string) {
  await actorActual().attemptsTo(CompletarTarea.la(tarea));
});

When('elimina la tarea {string}', async function (tarea: string) {
  await actorActual().attemptsTo(EliminarTarea.la(tarea));
});

When('limpia las tareas completadas', async function () {
  await actorActual().attemptsTo(LimpiarCompletadas.ahora());
});

Then('la lista tiene {int} tarea', async function (cuantas: number) {
  await actorActual().attemptsTo(CountElements.hay(cuantas).de(PageTareas.filas, 'tareas de la lista'));
});

Then('el contador dice {string}', async function (texto: string) {
  await actorActual().attemptsTo(SeeText.el(texto).en(PageTareas.contadorPendientes));
});

Then('ve el mensaje de lista vacía', async function () {
  await actorActual().attemptsTo(SeeElement.el(PageTareas.mensajeVacio, 'mensaje de lista vacía'));
});
