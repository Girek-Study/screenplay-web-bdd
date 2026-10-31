# 4. Análisis de riesgos

No todo merece una prueba automatizada. Mantener una suite cuesta, y cada escenario que no
aporta información se paga en cada ejecución y en cada cambio de interfaz.

Lo que sigue es cómo decido qué entra, qué se queda en manual y qué no se prueba.

---

## Cómo se prioriza

Dos preguntas, ninguna sobre tecnología:

1. **Si esto falla, ¿qué pasa?** — impacto
2. **¿Cuántas veces al día ocurre?** — frecuencia

Lo que es alto en las dos se automatiza primero. Lo raro y grave se prueba a mano con
cuidado. Lo frecuente y leve se automatiza cuando sobre tiempo. Lo raro y leve se anota y
se deja ir.

```
        ALTO IMPACTO
             │
   Probar    │   Automatizar
   a mano,   │   primero
   con guion │   ← el ingreso vive aquí
─────────────┼─────────────  FRECUENCIA →
             │
   Anotar    │   Automatizar
   y soltar  │   si sobra tiempo
             │
        BAJO IMPACTO
```

## La tabla

| Riesgo | Impacto | Frecuencia | Decisión | Por qué |
| --- | --- | --- | --- | --- |
| No se puede entrar | Alto | Altísima | **Automatizado, `@smoke`** | Si esto falla, el resto da igual: nadie llega a probarlo |
| Entra quien no debe | Alto | Baja | **Automatizado, `@regresion`** | Raro, pero el daño no se deshace |
| No se puede agregar una tarea | Alto | Altísima | **Automatizado, `@smoke`** | Es la razón de ser del producto |
| El contador miente | Medio | Alta | **Automatizado** | Se ve en cada pantalla; un número mal destruye la confianza en todo lo demás |
| Limpiar borra lo que no debe | Alto | Media | **Automatizado** | Pérdida de datos sin deshacer |
| El diseño se rompe con textos largos | Medio | Baja | **Manual, con guion** | Ya es defecto ([DEF-06](05-defectos.md#def-06)); se automatiza cuando se corrija |
| El error no se anuncia a un lector | Alto | Media | **Manual, con lector de pantalla** | Una aserción sobre un atributo no prueba que se *oiga* |
| Se pierde lo escrito al agregar | Medio | Baja | **Anotado** ([DEF-04](05-defectos.md#def-04)) | Solo ocurre si falla el agregado, que aquí no puede fallar |
| Títulos repetidos | Bajo | Media | **Anotado** | Supuesto sin confirmar; automatizarlo sería fijar una decisión que nadie tomó |
| Rendimiento con muchas tareas | Bajo | Nula | **No se prueba** | El producto no declara ningún volumen esperado |

---

## Dos decisiones que conviene defender

### La accesibilidad se queda en manual, y no por pereza

Se puede automatizar que el mensaje de error tenga `role="alert"`. Eso comprueba que el
atributo está, no que un lector de pantalla lo lea en el momento correcto, ni que lo que
lea se entienda.

Automatizar esa comprobación da una luz verde que **tapa** el problema real: el escenario
pasa, el atributo está, y la persona ciega sigue sin enterarse de que su clave es
incorrecta. Una prueba que da confianza falsa es peor que no tenerla.

El sitio correcto para ese atributo es un linter de accesibilidad en el *pull request*, no
un escenario de extremo a extremo.

### El riesgo que la suite no puede ver

Este framework localiza las tareas por su texto:

```ts
public static casillaDe(tarea: string): string {
  return `[data-testid="tarea"]:has-text("${tarea}") [data-testid="tarea-completada"]`;
}
```

Funciona porque los títulos de los escenarios son distintos entre sí. Con dos tareas del
mismo texto —que la aplicación permite, [DEF-05](05-defectos.md#def-05)— ese localizador
encuentra dos elementos y Playwright falla con *strict mode violation*.

No es un defecto del producto: es **un riesgo de la propia suite**, creado por una decisión
de diseño de las pruebas. Está anotado aquí porque un análisis que solo mira al producto se
lo pierde, y porque el día que alguien escriba un escenario con títulos repetidos no va a
entender por qué falla.

La mitigación barata es un dato de prueba único por escenario. La cara es identificar las
filas por un id que la aplicación hoy no expone.

---

## Qué pasaría si esto fuera un producto real

Esta aplicación no tiene dinero, ni datos personales, ni integraciones. En un producto de
verdad, la tabla llevaría tres filas más que aquí no tienen sentido:

- **Un dato sensible que se escribe en un registro** — impacto alto, frecuencia alta,
  prioridad por encima de todo lo funcional
- **Una integración con un tercero que se cae** — se prueba el camino degradado, no el feliz
- **Un cálculo con dinero** — valores límite y redondeo antes que cualquier flujo de interfaz

Lo digo porque un portafolio con una lista de tareas puede dar la impresión de que así se
prioriza siempre. No: la técnica es la misma, las filas son otras.

---

Siguiente: [5. Defectos encontrados](05-defectos.md)
