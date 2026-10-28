import { describe, expect, it } from 'vitest';
import { escaparRegExp } from '../Framework/0008.Questions/Q0004.Current.URL.Contains';

describe('escaparRegExp', () => {
  it('escapa los caracteres que una URL trae y una expresión regular interpreta', () => {
    // String.raw para que lo esperado se lea tal como queda: con la barra invertida a la vista.
    expect(escaparRegExp('/panel?id=1')).toBe(String.raw`/panel\?id=1`);
    expect(escaparRegExp('app.midominio.com')).toBe(String.raw`app\.midominio\.com`);
  });

  it('deja pasar lo que no es especial', () => {
    expect(escaparRegExp('/tareas')).toBe('/tareas');
  });

  it('convierte el fragmento en una expresión regular que sí coincide', () => {
    const patron = new RegExp(escaparRegExp('/panel?id=1'));
    expect(patron.test('http://localhost:4173/panel?id=1')).toBe(true);
    expect(patron.test('http://localhost:4173/panelXid=1')).toBe(false);
  });
});
