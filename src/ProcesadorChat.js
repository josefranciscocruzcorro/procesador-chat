class ProcesadorChat
{
    /**
     * Flujo de la conversacion, 
     * si pc:true  entonces "respuesta de maquina"
     * si pc:false entonces "respuesta de usuario"
     */
    flujo           = [];
    /**
     * arbol de descicion, motor de la conversacion
     * 
     * [
     *   {
     *     item: "categoria 1",
     *     subitems: []      => OTRO ARBOL con la misma estructura, o un arreglo vacio si no hay mas profundidad
     *     preguntas: [
     *       {
     *         pregunta: "primera pregunta?",
     *         opciones: [
     *           {
     *             opcion: "opcion elejible en la pregunta",
     *             fin: false  => SI ES TRUE ENTONCES TODAS LAS PREGUNTAS TERMINAN AL ELEJIR ESTA OPCION, SI ES FALSE, LAS PREGUNTAS SIGUIENTES CONTINUAN SIN IMPORTAR SI SE ELIJE ESTA OPCION O NO
     *           },
     *         
     *       },
     *     ],
     *     respuestas: [
     *       {
     *         respuesta: "llene este formulario",  => LAS RESPUESTAS SON SOLO MENSAJES QUE SIGUEN UNA CONVERSACION LINEAL SIN IMPORTAR LA RESPUESTA DEL USUARIO, SE EJECUTARAN UNA TRAS OTRA ENTRE MENSAJES DE USUARIO
     *       },
     *     ]
     *   },
     * ]
     */
    arbol           = []; 
    preguntas       = [];
    respuestas      = [];
    opciones        = [];

    constructor (arbol,flujo)
    {
        this.arbol      = arbol;
        this.flujo      = flujo;
    }

    /**
     * 
     * @param {int} msg Es un numero entero que representa el indice del arreglo elejido en el momento del flujo, elije primero en opciones si ubieran, y luego de la lista de items del arbol si existieran, 
     * @returns array retorna el flujo de la conversacion
     */
    chatItem(msg){
        if (this.opciones.length > 0) {
            let opcion = Object.assign({},this.opciones[msg]);
            this.opciones = [];

            this.flujo.push({
                pc : false,
                msg: opcion.opcion
            });

            if (opcion.respuesta) {
                this.flujo.push({
                    pc : true,
                    msg: opcion.respuesta
                });
            }

            if (opcion.fin) {
                this.preguntas = [];
            }
            
            this.procesoPreguntasRespuestas();

            return this.flujo;
        }

        if (this.arbol.length > 0) {
            let opcion = Object.assign({},this.arbol[msg]);
            this.arbol = Object.assign([],(opcion.subitems? opcion.subitems:[]));

            this.flujo.push({
                pc : false,
                msg: opcion.item
            });

            if (opcion.preguntas && opcion.preguntas.length > 0) {
                this.preguntas  = Object.assign([],opcion.preguntas);
            }
            if (opcion.respuestas && opcion.respuestas.length > 0) {
                this.respuestas = Object.assign([],opcion.respuestas);
            }

            if (this.arbol.length <= 0) {
                this.procesoPreguntasRespuestas();
            }

            return this.flujo;
        }

    }

    /**
     * 
     * @param {str} msg Cadena de caracteres enviada por el usuario
     * @returns array devuelve el flujo de la conversacion
     */
    chat(msg){
        this.flujo.push({
            pc : false,
            msg: msg
        });

        this.procesoPreguntasRespuestas();

        return this.flujo;
    }

    /**
     * Procesa las preguntas y respuestas, para siempre agregar al flujo la primera
     * pregunta si hubieran aun preguntas, o la primera respuesta si hubieran aun 
     * respuestas. Una vez enviada la pregunta o respuesta al flujo se procede
     * a eliminarla de la lista de preguntas o respuestas segun corresponda.
     * son prioridad las preguntas.
     */
    procesoPreguntasRespuestas(){
        if(this.preguntas.length > 0){
            this.flujo.push({
                pc : true,
                msg: this.preguntas[0].pregunta
            });

            this.opciones = Object.assign([],this.preguntas[0].opciones);
            this.preguntas.splice(0,1);
        }else if(this.respuestas.length > 0){
            this.flujo.push({
                pc : true,
                msg: this.respuestas[0].respuesta
            });

            this.respuestas.splice(0,1);
        }
    }

}

export default ProcesadorChat;