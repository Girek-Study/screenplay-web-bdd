# 1. Análisis funcional

Antes de diseñar un caso hay que saber qué hace el producto. No lo que dice la historia de
usuario: lo que hace.

Esto se escribió leyendo [`demo/app.js`](../demo/app.js) y usando la aplicación, porque las
dos fuentes se contradicen más de lo que parece y la que manda es la segunda.

---

## Qué es

Una lista de tareas con sesión. Dos pantallas: ingreso y tareas. Sin servidor y sin
persistencia: todo vive en memoria del navegador.

```
┌─────────────┐   credenciales válidas   ┌──────────────┐
│   Ingreso   │ ───────────────────────▶ │    Tareas    │
│             │ ◀─────────────────────── │              │
└─────────────┘         «Salir»          └──────────────┘
```

---

## Reglas, una por una

### Ingreso

| # | Regla | Dónde está escrita |
| --- | --- | --- |
| R1 | Entra con usuario `demo` y clave `demo123` | En la propia pantalla, a la vista |
| R2 | Usuario o clave vacíos → «Usuario y clave son obligatorios.» | Solo en el código |
| R3 | Credenciales que no coinciden → «Credenciales inválidas.» | Solo en el código |
| R4 | El usuario se recorta por los extremos; **la clave no** | En ningún sitio |
| R5 | La comparación distingue mayúsculas en los dos campos | En ningún sitio |
| R6 | El mensaje de error se oculta al reenviar, no al corregir | En ningún sitio |

Las tres últimas son las interesantes. **Ninguna está documentada**, las tres son
decisiones que alguien tomó sin darse cuenta, y las tres cambian el comportamiento que una
persona percibe. R4 produce directamente el defecto [DEF-01](05-defectos.md#def-01).

### Tareas

| # | Regla | Dónde está escrita |
| --- | --- | --- |
| R7 | Al entrar, el saludo dice «Hola, {usuario}» con el texto tal como se escribió | Solo en el código |
| R8 | Agregar una tarea tarda **250 ms a propósito** | Comentado en el código |
| R9 | El título se recorta por los extremos; si queda vacío, no se agrega nada | Solo en el código |
| R10 | El campo se limpia **antes** de que la tarea exista | En ningún sitio |
| R11 | Se admiten títulos repetidos | En ningún sitio |
| R12 | Sin límite de longitud del título | En ningún sitio |
| R13 | El contador cuenta **pendientes**, no totales, y concuerda en singular y plural | Solo en el código |
| R14 | «Limpiar completadas» borra las marcadas; está siempre activo | Solo en el código |
| R15 | El mensaje de lista vacía aparece solo si **no hay ninguna tarea**, estén completadas o no | Solo en el código |
| R16 | «Salir» borra todas las tareas y vuelve al ingreso | Solo en el código |

---

## El retardo de 250 ms no es un detalle

```js
// demo/app.js
const RETARDO_MS = 250;
```

Está puesto a propósito para que la suite se enfrente a interfaz asíncrona de verdad. Es el
motivo de que en este framework no haya un solo `sleep`: si los escenarios pasan con ese
retardo, es porque esperan por condiciones y no por reloj.

También es el origen de [DEF-04](05-defectos.md#def-04): durante esos 250 ms, lo que la
persona escribió no está en ningún sitio visible.

---

## Lo que la aplicación no hace

Tan importante como lo anterior, porque delimita qué **no** tiene sentido probar:

- **No persiste.** Al recargar se vuelve al ingreso con la lista vacía. Comprobado.
- **No tiene servidor.** No hay errores de red, ni tiempos de espera, ni códigos de estado.
- **No tiene roles.** Un solo usuario, sin permisos.
- **No edita tareas.** Se agregan, se completan y se borran. No se renombran.

Un plan de pruebas que incluya «verificar que la sesión expira» está probando un producto
que no existe. Pasa más de lo que parece.

---

## Preguntas que un análisis honesto deja abiertas

Ninguna de estas tiene respuesta en el código, y las tres cambiarían casos de prueba:

1. **¿Los títulos repetidos son válidos?** El código los permite. Nadie ha dicho si debe.
2. **¿Cuál es el largo máximo de un título?** No hay límite y el diseño se rompe mucho
   antes de llegar a ninguno.
3. **¿El usuario distingue mayúsculas a propósito?** `DEMO` no entra. Es coherente con una
   base de datos sensible a mayúsculas e incoherente con lo que espera cualquiera.

En un producto real, estas tres se preguntan antes de escribir un solo caso. Aquí quedan
anotadas como supuestos, y cada supuesto se marca como tal en el
[diseño de casos](02-diseno-de-casos.md).

---

Siguiente: [2. Diseño de casos](02-diseno-de-casos.md)
