# 3. Matriz de trazabilidad

De cada regla a su caso, y de cada caso a su escenario automatizado **o al motivo de no
automatizarlo**. La segunda columna es la que de verdad informa.

Los escenarios citados existen: están en
[`Framework/0001.Features/`](../Framework/0001.Features) y se pueden correr.

---

## Ingreso

| Caso | Regla | Escenario automatizado | Estado |
| --- | --- | --- | --- |
| Entrar con credenciales válidas | R1 | `Ingreso con credenciales válidas` | ✅ `@smoke` |
| Clave incorrecta | R3 | `La clave equivocada no deja entrar` | ✅ `@regresion` |
| Salir vuelve al ingreso | R16 | `Al salir vuelve al ingreso` | ✅ `@regresion` |
| Usuario vacío | R2 | — | ⬜ Pendiente |
| Clave vacía | R2 | — | ⬜ Pendiente |
| Usuario incorrecto | R3 | — | ⬜ Cubierto por la clase I4; se automatiza una de las dos |
| Espacios alrededor de la clave | R4 | — | 🐞 Defecto abierto [DEF-01](05-defectos.md#def-01) |
| `DEMO` en mayúsculas | R5 | — | ⏸️ Depende de un supuesto sin confirmar |
| El error se anuncia a un lector | — | — | 🐞 Defecto abierto [DEF-02](05-defectos.md#def-02) |

## Tareas

| Caso | Regla | Escenario automatizado | Estado |
| --- | --- | --- | --- |
| Agregar una tarea | R8, R13 | `Agregar una tarea` | ✅ `@smoke` |
| Completar descuenta el pendiente | R13 | `Completar una tarea descuenta el pendiente` | ✅ `@regresion` |
| Limpiar completadas (caso C3) | R14 | `Limpiar completadas deja solo lo pendiente` | ✅ `@regresion` |
| Borrar la última muestra el vacío | R15 | `Eliminar la última tarea muestra el mensaje de lista vacía` | ✅ `@regresion` |
| Varias tareas se acumulan | R11 | `Esquema del escenario` (2 ejemplos) | ✅ `@regresion` |
| Título solo con espacios | R9 | — | 🐞 Defecto abierto [DEF-07](05-defectos.md#def-07) |
| Título de 500 caracteres | R12 | — | 🐞 Defecto abierto [DEF-06](05-defectos.md#def-06) |
| Títulos repetidos | R11 | — | ⏸️ Depende de un supuesto sin confirmar |
| Limpiar sin nada completado (C2) | R14 | — | 🐞 Defecto abierto [DEF-08](05-defectos.md#def-08) |
| El campo se vacía antes de tiempo | R10 | — | 🐞 Defecto abierto [DEF-04](05-defectos.md#def-04) |

---

## El recuento, sin maquillar

| | |
| --- | --- |
| Casos diseñados | **19** |
| Automatizados | **9** (47 %) |
| Defectos abiertos sin automatizar | **6** |
| Bloqueados por un supuesto sin confirmar | **2** |
| Cubiertos por otra clase de equivalencia | **1** |
| Pendientes sin más motivo que el tiempo | **2** |

**El 47 % no es una cifra que haya que subir.** Seis de los diez casos no automatizados son
defectos abiertos: automatizar un escenario que falla a propósito deja la suite en rojo
permanente y, a las dos semanas, nadie mira si está verde.

El orden correcto es: se corrige el defecto, **y entonces** se automatiza el caso para que
no vuelva. Ese es el momento en que una prueba de regresión vale lo que cuesta.

Los dos «pendientes sin más motivo que el tiempo» —usuario vacío y clave vacía— sí son
deuda real. Están identificados y valen diez minutos.

---

## Por qué la matriz vive aquí y no en una hoja de cálculo

Porque en una hoja de cálculo se desincroniza del código en la primera semana y nadie se
entera. Aquí viaja en el mismo repositorio y en el mismo *pull request* que el cambio: si
alguien añade un escenario y no toca esta tabla, se ve en el diff.

No es una idea original. Es la misma razón por la que la documentación de una API vive
junto al código y no en un wiki.

---

Siguiente: [4. Análisis de riesgos](04-analisis-riesgos.md)
