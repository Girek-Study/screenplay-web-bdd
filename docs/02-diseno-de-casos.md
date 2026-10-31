# 2. Diseño de casos

Las técnicas de diseño no son un trámite de certificación: son la diferencia entre
veintiocho casos que prueban lo mismo y nueve que cubren el problema.

Aquí están aplicadas sobre las reglas del [análisis funcional](01-analisis-funcional.md),
con el razonamiento a la vista.

---

## Partición de equivalencia — el ingreso

La idea: si dos entradas van a recorrer el mismo camino dentro del programa, probar las
dos no aporta nada. Se prueba una de cada clase.

| Clase | Usuario | Clave | Resultado esperado |
| --- | --- | --- | --- |
| **V1** Ambos válidos | `demo` | `demo123` | Entra |
| **I1** Usuario vacío | `` | `demo123` | «Usuario y clave son obligatorios.» |
| **I2** Clave vacía | `demo` | `` | «Usuario y clave son obligatorios.» |
| **I3** Usuario incorrecto | `otro` | `demo123` | «Credenciales inválidas.» |
| **I4** Clave incorrecta | `demo` | `otra` | «Credenciales inválidas.» |

Cinco casos, no veinte. Probar `pepe/pepe`, `admin/admin` y `test/test` es repetir **I3**
tres veces: las tres entradas salen por la misma línea del programa.

**I1 e I2 son clases distintas aunque den el mismo mensaje**, porque las produce una
condición distinta del código. Si alguien reordena esas dos condiciones, una de las dos
deja de funcionar y la otra lo tapa.

## Valores límite — donde de verdad se rompe

Los errores viven en los bordes, no en el centro. Las fronteras de esta aplicación:

| Frontera | Valores a probar | Qué pasa de verdad |
| --- | --- | --- |
| Título vacío ↔ con contenido | `""`, `" "`, `"a"` | `" "` se descarta **en silencio** → [DEF-07](05-defectos.md#def-07) |
| Lista vacía ↔ con tareas | 0 y 1 tarea | El mensaje de vacío solo mira el total, no los pendientes |
| Contador singular ↔ plural | 0, 1 y 2 pendientes | Correcto: «0 pendientes», «1 pendiente», «2 pendientes» |
| Longitud del título | 1, 100, **500** caracteres | A 500, la página desborda 4400 px → [DEF-06](05-defectos.md#def-06) |

Ese último valor no salió de la nada: **no hay máximo documentado**, así que la frontera se
busca subiendo hasta que algo se rompe. Se rompió.

## Tabla de decisión — «Limpiar completadas»

Cuando el resultado depende de varias condiciones a la vez, una tabla evita el caso que
nadie pensó.

| | C1 | C2 | C3 | C4 |
| --- | :-: | :-: | :-: | :-: |
| ¿Hay tareas? | No | Sí | Sí | Sí |
| ¿Alguna completada? | — | No | Sí, algunas | Sí, todas |
| **Resultado** | No pasa nada | **No pasa nada** | Quedan las pendientes | Lista vacía |
| ¿Mensaje de lista vacía? | Sí | No | No | Sí |

**C2 es la columna que una lista de casos escrita a mano se salta siempre**: hay tareas,
ninguna completada, se pulsa el botón. No pasa nada, y el botón tampoco dice que no va a
pasar nada → [DEF-08](05-defectos.md#def-08).

**C4 revela otra cosa**: al limpiar todas, la lista queda vacía y aparece el mensaje. Pero
si en vez de limpiarlas solo se marcan completadas, la lista no está vacía y el mensaje no
sale, aunque no quede nada pendiente. Las dos situaciones se parecen en pantalla y son
estados distintos.

## Transición de estados — la sesión

Lo que importa no son los caminos felices, sino las flechas que **no** deberían existir.

```
            credenciales válidas
   ┌──────┐ ─────────────────────▶ ┌────────┐
   │ Fuera│                        │ Dentro │
   └──────┘ ◀───────────────────── └────────┘
       │            «Salir»             │
       │                                │
       └── recargar ────────────────────┘
              (vuelve a Fuera, pierde todo)
```

De aquí salen tres casos que una lista plana no produce:

1. **Salir y volver a entrar.** ¿Quedan tareas de la sesión anterior? No: `boton-salir` las
   borra. Comprobado.
2. **Recargar estando dentro.** Vuelve a Fuera. Es un caso de pérdida de datos silenciosa,
   aceptable aquí porque la aplicación no promete persistir.
3. **Volver atrás con el navegador.** Una sola página, sin rutas: no hay a dónde volver.
   **No se prueba**, porque no existe la transición.

Ese tercero es tan valioso como los otros dos. Un caso que prueba una transición
inexistente siempre pasa, nunca falla, y está en la suite para siempre costando tiempo.

---

## Lo que se decidió no probar, y por qué

| No se prueba | Motivo |
| --- | --- |
| Inyección de HTML en el título | La aplicación usa `textContent`, no `innerHTML`: no hay superficie |
| Expiración de sesión | No existe |
| Errores de red | No hay servidor |
| Varios usuarios a la vez | No hay roles ni concurrencia |
| Rendimiento con mil tareas | El producto no declara ningún volumen esperado |

Escribir esta tabla cuesta cinco minutos y **evita la pregunta de «¿y probaste…?» en cada
revisión**. Un plan sin exclusiones explícitas obliga a defenderse de memoria.

---

## Los supuestos, marcados como tales

Tres reglas del análisis no están confirmadas por nadie. Los casos que dependen de ellas
se escriben igual, pero dicen de qué supuesto cuelgan:

| Supuesto | Si se confirma al revés… |
| --- | --- |
| Los títulos repetidos son válidos | [DEF-05](05-defectos.md#def-05) deja de ser defecto y pasa a ser caso de prueba nuevo |
| No hay longitud máxima de título | [DEF-06](05-defectos.md#def-06) cambia de «falta un límite» a «el límite está mal puesto» |
| El usuario distingue mayúsculas a propósito | Aparece un caso nuevo: `DEMO` debería entrar |

---

Siguiente: [3. Matriz de trazabilidad](03-matriz-trazabilidad.md)
