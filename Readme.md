# procesador-chat
Es un paquete para crear un flujo de chat a partir de una estructura json de control.
La estructura json "ARBOL DE DESCICION" se detalla acontinuacion: (es un ejemplo)
---

```
[
    {
        "item":     "Nombre del item 1",
        "subitems": [
            {
                "item":       "Nombre item 1",
                "preguntas":  [
                    {
                        "pregunta": "primera pregunta",
                        "opciones": [
                            {
                                "opcion": "si", 
                            },
                            {
                                "opcion": "no",
                                "fin":    true 
                            },
                        ]
                    },
                    {
                        "pregunta": "segunda pregunta",
                        "opciones": [
                            {
                                "opcion": "si", 
                            },
                            {
                                "opcion": "no",
                                "fin":    true 
                            },
                        ]
                    },
                ],
                "respuestas": [
                    {
                        "respuesta": "mensaje 1",
                    },
                    {
                        "respuesta": "mensaje 2",
                    },
                ]
            },
        ]
    },

    {
        "item":       "Nombre item 2",
        "preguntas":  [
            {
                "pregunta": "primera pregunta",
                "opciones": [
                    {
                        "opcion": "si", 
                        "respuesta": "Haz elejido si, adjunta un archivo...",
                    },
                    {
                        "opcion": "no", 
                    },
                ]
            },
            {
                "pregunta": "segunda pregunta",
                "opciones": [
                    {
                        "opcion": "si", 
                    },
                    {
                        "opcion": "no",
                    },
                ]
            },
        ],
        "respuestas": [
            {
                "respuesta": "mensaje 1",
            },
            {
                "respuesta": "mensaje 2",
            },
        ]
    },
]
```
Como se puede apreciar se trata de un ***array de objetos***,
donde cada objeto tiene obligatoriamente el campo ***item*** que es el nombre de la opcion actual procesada:
---
1. El campo ***subitems*** es opcional y dentro va un arbol del mismo tipo, es decir es recursivo, y dentro pueden haber items con mas subitems, la profundidad no esta limitada;
2. El campo ***preguntas*** es un array de objetos tambien, aca el campo ***pregunta*** y ***opciones*** son obligatorios;
   - ***pregunta*** es la pregunta en cuestion, y 
   - ***opciones*** es un arreglo con las opciones de respuesta, ***opciones*** posee el campo: 
    - ***opcion*** que es obligatorio y representa la opcion elejible, y el campo 
    - ***fin*** que es opcional y representa el fin de las preguntas, es decir si existen 10 preguntas y en la pregunta 5 se elije la opcion que finaliza las preguntas, entonces las otras 5 jamas se van a mostrar;
3. El campo ***respuestas*** es un array con objetos con un parametro ***respuesta*** que es obligatorio y es un mensaje que sigue en flujo de la conversacion, estos mensajes siempre estaran presentes en la conversacion.


# Instalación:

```
npm i procesador-chat
```


# Funciones:
Antes de usar cualquier funcion es nesesario que cree una instancia del objeto ***ProcesadorChat***,
que le pedira 2 parametros, el primero es el "ARBOL DE DESCICION", y el segundo puede ser un arreglo vacio
donde se almacenara el flujo de la conversacion.
---
***Respuesta:*** .- en respuesta a cualquiera de las funciones que se mencionarán se enviará un arreglo que contiene el flujo de la conversacion, donde cada elemento se vera asi:
---
```
[
    {
        "pc": false,
        "msg": "mensaje del usuario",
    },
    {
        "pc": true,
        "msg": "mensaje desde el computador",
    },
]
```
- ***pc*** si es false es un mensaje de usuario, si es true es un mensaje de maquina.
- ***msg*** es el mensaje

---

## Invoque las siguientes funciones segun nesesite:

### ***chatItem(msg)***
Esta funcion recibe como parámetro el índice del item elejido por el usuario.

### ***chat(msg)***
Esta funcion recibe como parámetro el texto escrito por el usuario
 

# Flujo:
El flujo de la conversación es el siguiente:

1. Opcion de usuario .- indice elejido de la lista de los items superiores del arbol de descicion
2. La máquina primero revisa si existen opciones de pregunta, elije el item seleccionado por el usuario y lo suma al flujo, luego suma al flujo la siguiente pregunta si hubiere con sus opciones, sino entonces pasa a las respuestas.
3. Se ejecuta solo si no se ejecuto el paso ***2***, Revisa si existen subitems del item actual elejido, si existen subitems estos pasan a convertirse en el arbol principal, Ademas agrega al flujo la siguiente pregunta si hubiere con sus opciones, sino entonces pasa a las respuestas.

Estos 3 pasos se repiten cada vez que la funcion cualquiera es llamada, el procesador termina su trabajo cuando ya no puede enviar mas respuestas de maquina, a partir de ahi dependerea del desarrollador.