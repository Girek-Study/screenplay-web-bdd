import { describe, expect, it } from 'vitest';
import { expresionDeEtiquetas, sinComillas } from '../Framework/0010.Runners/R000.tags.util';

describe('sinComillas', () => {
  it('quita las comillas que pega la shell de Windows', () => {
    expect(sinComillas('"@regresion"')).toBe('@regresion');
    expect(sinComillas("'@smoke'")).toBe('@smoke');
  });

  it('deja intacto lo que no lleva comillas', () => {
    expect(sinComillas('@smoke')).toBe('@smoke');
  });

  it('no revienta con cadena vacía', () => {
    expect(sinComillas('')).toBe('');
  });
});

describe('expresionDeEtiquetas', () => {
  it('lee la forma con --tags', () => {
    expect(expresionDeEtiquetas(['--tags', '@regresion'])).toBe('@regresion');
  });

  it('acepta el atajo de una sola etiqueta', () => {
    expect(expresionDeEtiquetas(['@smoke'])).toBe('@smoke');
  });

  it('une varias etiquetas sueltas', () => {
    expect(expresionDeEtiquetas(['@smoke', '@web'])).toBe('@smoke @web');
  });

  it('respeta una expresión completa en un solo argumento', () => {
    expect(expresionDeEtiquetas(['@smoke and not @wip'])).toBe('@smoke and not @wip');
  });

  it('cae al entorno cuando no hay argumentos', () => {
    expect(expresionDeEtiquetas([], '@regresion')).toBe('@regresion');
  });

  it('devuelve undefined si no hay nada por ningún lado', () => {
    expect(expresionDeEtiquetas([], '   ')).toBeUndefined();
  });
});
