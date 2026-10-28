# language: es
@web @tareas
Característica: Gestión de tareas
  Como usuario con sesión iniciada
  quiero anotar, completar y borrar tareas
  para no perder de vista lo que tengo pendiente

  Antecedentes:
    Dado que Ana abre la aplicación
    Y ingresa como "valido"

  @smoke @regresion
  Escenario: Agregar una tarea
    Cuando agrega la tarea "Revisar el informe de regresión"
    Entonces la lista tiene 1 tarea
    Y el contador dice "1 pendiente"

  @regresion
  Escenario: Completar una tarea descuenta el pendiente
    Dado que agrega la tarea "Firmar el acta de pase"
    Cuando completa la tarea "Firmar el acta de pase"
    Entonces el contador dice "0 pendientes"

  @regresion
  Escenario: Limpiar completadas deja solo lo pendiente
    Dado que agrega la tarea "Cerrar el ticket"
    Y agrega la tarea "Actualizar el tablero"
    Y completa la tarea "Cerrar el ticket"
    Cuando limpia las tareas completadas
    Entonces la lista tiene 1 tarea
    Y el contador dice "1 pendiente"

  @regresion
  Escenario: Eliminar la última tarea muestra el mensaje de lista vacía
    Dado que agrega la tarea "Enviar el reporte"
    Cuando elimina la tarea "Enviar el reporte"
    Entonces ve el mensaje de lista vacía

  @regresion
  Esquema del escenario: Varias tareas se acumulan en la lista
    Cuando agrega la tarea "<tarea>"
    Entonces la lista tiene <total> tarea

    Ejemplos:
      | tarea                  | total |
      | Preparar el ambiente   | 1     |
      | Revisar los criterios  | 1     |
