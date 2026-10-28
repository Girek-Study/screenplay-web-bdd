# language: es
@web @sesion
Característica: Ingreso a la aplicación
  Como usuario registrado
  quiero entrar con mis credenciales
  para gestionar mis tareas

  Antecedentes:
    Dado que Ana abre la aplicación

  @smoke @regresion
  Escenario: Ingreso con credenciales válidas
    Cuando ingresa como "valido"
    Entonces ve la pantalla de tareas
    Y el saludo dice "Hola, demo"

  @regresion
  Escenario: La clave equivocada no deja entrar
    Cuando intenta ingresar como "invalido"
    Entonces ve el mensaje de error "Credenciales inválidas."
    Y sigue fuera de la pantalla de tareas

  @regresion
  Escenario: Al salir vuelve al ingreso
    Dado que ingresa como "valido"
    Cuando cierra la sesión
    Entonces ve la pantalla de ingreso
