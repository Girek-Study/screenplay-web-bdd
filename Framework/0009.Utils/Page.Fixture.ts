import type { Page } from '@playwright/test';

/**
 * La página activa del escenario en curso.
 *
 * Cucumber no pasa contexto entre hooks y steps, así que la página vive aquí.
 * Es `undefined` hasta que el ciclo de vida abre el contexto: leerla antes es un
 * error de orden, y el Actor lo convierte en un mensaje legible en vez de en un
 * `cannot read property of undefined`.
 */
export const pageFixture: { page?: Page } = { page: undefined };
