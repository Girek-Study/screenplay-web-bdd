# 5. Defectos encontrados

Ocho, en una sesión de exploración de unos veinte minutos sobre la app de ejemplo. Todos
reproducibles: se levanta con `npm run demo` y se siguen los pasos.

Ninguno lo detecta la suite de este repositorio, y eso es
[lo más interesante de esta carpeta](README.md#el-resultado-incómodo).

| Id | Resumen | Severidad |
| --- | --- | :-: |
| [DEF-01](#def-01) | El usuario se recorta y la clave no | Media |
| [DEF-02](#def-02) | El mensaje de error no se anuncia a un lector de pantalla | **Alta** |
| [DEF-03](#def-03) | El error sigue en pantalla mientras se corrige | Baja |
| [DEF-04](#def-04) | El campo se vacía antes de que la tarea exista | Media |
| [DEF-05](#def-05) | Admite dos tareas con el mismo texto | Media |
| [DEF-06](#def-06) | Un título largo rompe la maquetación | **Alta** |
| [DEF-07](#def-07) | Una tarea en blanco se descarta en silencio | Media |
| [DEF-08](#def-08) | «Limpiar completadas» está activo sin nada que limpiar | Baja |

---

## DEF-01

**El usuario se recorta por los extremos y la clave no**

| | |
| --- | --- |
| **Pasos** | 1. Escribir `" demo "` (con espacios) y `demo123` → entra.<br>2. Escribir `demo` y `"demo123 "` (con un espacio final) → no entra. |
| **Esperado** | El mismo tratamiento en los dos campos, sea cual sea |
| **Obtenido** | El usuario se recorta; la clave se compara literalmente |
| **Severidad** | Media |
| **Causa** | `demo/app.js`: `$('usuario').value.trim()` frente a `$('clave').value` |

Importa porque un gestor de contraseñas, o pegar desde un correo, arrastra un espacio final
con una facilidad notable. La persona ve una clave correcta y un mensaje que dice que no lo
es. Es de los fallos que acaban en una llamada a soporte.

Recortar la clave también es defendible —hay quien lo prohíbe a propósito— pero entonces
hay que recortar el usuario igual. Lo que no se sostiene es cada campo con un criterio.

## DEF-02

**El mensaje de error no se anuncia a un lector de pantalla**

| | |
| --- | --- |
| **Pasos** | 1. Pulsar «Ingresar» con los campos vacíos.<br>2. Inspeccionar `[data-testid="error-login"]`. |
| **Esperado** | `role="alert"` o `aria-live="polite"` |
| **Obtenido** | Ninguno de los dos |
| **Severidad** | Alta |

El mensaje aparece y se ve. Para quien usa un lector de pantalla **no existe**: el foco
sigue en el formulario, nada anuncia el cambio, y lo único que ocurre es que el botón
parece no responder.

Es alta porque deja fuera del producto a una persona entera, y porque se arregla con un
atributo.

## DEF-03

**El error sigue en pantalla mientras se corrige**

| | |
| --- | --- |
| **Pasos** | 1. Entrar mal y ver el error.<br>2. Corregir usuario y clave **sin enviar**. |
| **Esperado** | El mensaje desaparece al empezar a corregir |
| **Obtenido** | Sigue visible hasta volver a enviar |
| **Severidad** | Baja |

Ruido, no bloqueo. Se anota para no volver a encontrarlo dentro de seis meses y gastar otra
vez el tiempo de investigarlo.

## DEF-04

**El campo se vacía antes de que la tarea exista**

| | |
| --- | --- |
| **Pasos** | 1. Escribir un título y pulsar «Agregar».<br>2. Mirar la pantalla durante los 250 ms siguientes. |
| **Esperado** | El texto se conserva hasta confirmar, o algo indica que está en curso |
| **Obtenido** | El campo queda vacío y la lista todavía no tiene la fila |
| **Severidad** | Media |
| **Causa** | `demo/app.js`: `campo.value = ''` se ejecuta **antes** del `setTimeout` |

Durante un cuarto de segundo, lo que la persona escribió no está en ninguna parte. Aquí el
agregado no puede fallar; con un servidor de por medio, un fallo se lleva el texto sin
dejar rastro y sin posibilidad de reintentar.

El patrón correcto —vaciar al confirmar, o restaurar si falla— cuesta lo mismo de escribir.

## DEF-05

**Admite dos tareas con el mismo texto**

| | |
| --- | --- |
| **Pasos** | Agregar dos veces el mismo título. |
| **Esperado** | Sin definir: depende de un supuesto que nadie ha confirmado |
| **Obtenido** | Dos filas idénticas, sin forma de distinguirlas |
| **Severidad** | Media |

Dos consecuencias distintas:

- **Para la persona:** dos filas iguales y ninguna pista de cuál completó.
- **Para las pruebas:** cualquier localizador por texto encuentra dos elementos. Está
  explicado en el [análisis de riesgos](04-analisis-riesgos.md#el-riesgo-que-la-suite-no-puede-ver).

Se reporta como pregunta, no como fallo: *¿deben permitirse?* Si la respuesta es sí, hace
falta un identificador visible. Si es no, falta una validación.

## DEF-06

**Un título largo rompe la maquetación**

| | |
| --- | --- |
| **Pasos** | 1. Entrar.<br>2. Agregar una tarea con 500 caracteres sin espacios (`'A'.repeat(500)`). |
| **Esperado** | El texto se ajusta, se recorta, o el campo no deja escribir tanto |
| **Obtenido** | **4400 px de desborde horizontal.** La página entera se puede desplazar de lado |
| **Severidad** | Alta |

Medido, no estimado:

```js
document.documentElement.scrollWidth - document.documentElement.clientWidth  // 4400
```

Rompe la página completa, no solo la fila: el pie, el contador y el botón de salir se van
fuera de la pantalla. En un teléfono es inmanejable.

Son dos arreglos y conviene hacer los dos: un `maxlength` en el campo, porque el límite hay
que decirlo antes de escribir, y `overflow-wrap: anywhere` al pintar, porque el dato puede
llegar de otro sitio que no sea ese campo.

## DEF-07

**Una tarea en blanco se descarta en silencio**

| | |
| --- | --- |
| **Pasos** | 1. Escribir solo espacios.<br>2. Pulsar «Agregar». |
| **Esperado** | Un aviso de que el título es obligatorio |
| **Obtenido** | No se agrega nada, no se limpia el campo y no se dice nada |
| **Severidad** | Media |

Desde fuera es indistinguible de un botón roto. El código lo hace a propósito
(`if (!titulo) return;`), lo cual es peor: la decisión está tomada y no se comunicó.

Cualquier formulario que descarta una entrada tiene que decir por qué. Si no, la persona
vuelve a pulsar, piensa que la aplicación se colgó, y recarga —perdiendo todo lo demás—.

## DEF-08

**«Limpiar completadas» está activo sin nada que limpiar**

| | |
| --- | --- |
| **Pasos** | Con tareas pendientes y ninguna completada, pulsar «Limpiar completadas». |
| **Esperado** | El botón deshabilitado |
| **Obtenido** | Se puede pulsar y no ocurre nada |
| **Severidad** | Baja |

Es la columna **C2** de la [tabla de decisión](02-diseno-de-casos.md#tabla-de-decisión--limpiar-completadas),
la que una lista de casos escrita a mano se salta siempre. Lo incluyo sobre todo por eso:
la técnica lo encontró sin que nadie fuera especialmente listo.

---

## Qué hacer con esto

El orden que seguiría, y el motivo:

1. **DEF-06 y DEF-02**, las dos altas. Una rompe la pantalla, la otra deja a alguien fuera.
2. **DEF-01 y DEF-07**, medias y de arreglo trivial, de las que generan soporte.
3. **DEF-05**, que antes de arreglarse necesita una respuesta de producto.
4. **DEF-03, DEF-04 y DEF-08**, cuando toque tocar esa parte.

Y después de cada arreglo, el escenario correspondiente de la
[matriz](03-matriz-trazabilidad.md) deja de estar en blanco. Ese es el momento de
automatizarlo: cuando comprobar que no vuelve tiene sentido.

---

Volver al [índice](README.md)
