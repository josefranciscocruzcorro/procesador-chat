class ProcesadorChat
{
    flujo           = [];
    arbol           = [];
    preguntas       = [];
    respuestas      = [];
    respuestaAuto   = false;
    funcionRes  = ()=>{};

    constructor (arbol,flujo,funcionRes  = (x)=>{return x;})
    {
        this.arbol      = arbol;
        this.flujo      = flujo;
        this.funcionRes = funcionRes;
    }

    chat(msg,auto = false){
        if (auto) {
            do {
                this.flujo = this.procesarPorMSG(msg)
            } while (this.arbol.length > 0 );
            
            if (this.arbol.length <= 0) {
                let plong   = this.preguntas.length;
                let rlong   = this.respuestas.length;
                if (plong > 0) {
                    this.flujo  = this.setPregunta(msg);
                }else if (rlong > 0) {
                    this.flujo = this.setRespuesta(msg);
                }else if (this.respuestaAuto) {
                    this.flujo = this.setResX(msg);
                    this.respuestaAuto = false;
                }
            }
        }else{
            this.flujo = this.procesarPorItem(msg);
        }

        if (this.flujo[this.flujo.length-1].user &&
            this.arbol.length <= 0 &&
            this.preguntas.length <= 0 &&
            this.preguntas.length <= 0 &&
            !this.respuestaAuto) {
            
                this.flujo.push({
                    user:   false,
                    msg:    '---',
                    fin:    true
                });
        }


        return this.flujo;
    }

    procesarPorMSG(msg){
        let res = this.funcionRes(msg,this.arbol);

        this.flujo.push({
            user:   true,
            msg:    opcion.item,
        });

        for (let i = 0; i < this.arbol.length; i++) {
            if (this.arbol[i].item.toLowerCase().trim().indexOf(res.toLowerCase().trim()) > -1) {
                
                return this.procesarPorItem(i);
            }
        }

        return;
    }

    procesarPorItem(index) {
        let opcion  = this.arbol[index];
        let aux     = Object.assign(this.arbol[index]);
        this.arbol  = aux.subitems? aux.subitems : [];
        
        if (opcion.preguntas.length > 0) {
            this.preguntas = opcion.preguntas;
        }
        
        if (opcion.respuestas.length > 0) {
            this.respuestas = opcion.respuestas;
        }
        
        if (opcion.respuestaAuto) {
            this.respuestas = opcion.respuestaAuto;
        }

        this.flujo.push({
            user:   true,
            msg:    opcion.item,
        });

        if (this.arbol.length <= 0) {
            let plong   = this.preguntas.length;
            let rlong   = this.respuestas.length;
            if (plong > 0) {
                this.flujo  = this.setPregunta();
            }else if (rlong > 0) {
                this.flujo = this.setRespuesta();
            }else if (this.respuestaAuto) {
                this.flujo = this.setResX();
                this.respuestaAuto = false;
            }
        }
        
        
        return flujo;
    }

    setPregunta(msg = ''){
        if (msg != '') {
             

            if (this.flujo[this.flujo.length - 1].opc &&
                this.flujo[this.flujo.length - 1].opc.toLowerCase().trim().indexOf(msg.toLowerCase().trim()) <= -1 ) {
                    
                    this.preguntas = [];
            }
            this.flujo.push({
                user:   true,
                msg:    msg,
            });
        }
        if (this.preguntas.length > 0) {
            if (this.preguntas[0].indexOf('::')) {
                let p = this.preguntas[0].split('::');
                this.flujo.push({
                    user:   false,
                    msg:    p[0],
                    opc:    p[1]
                });  
            }else{
                this.flujo.push({
                    user:   false,
                    msg:    this.preguntas[0]
                });
            }
            this.preguntas.splice(0,1);
        }

        return this.flujo;
    }

    setRespuesta(msg = ''){
        if (msg != '') {
            this.flujo.push({
                user:   true,
                msg:    msg,
            });
            if (this.respuestas[0].condicion &&
                this.respuestas[0].condicion.toLowerCase().trim().indexOf(msg.toLowerCase().trim()) <= -1) {
                
                    this.respuestas = [];
            }
        }

        if (this.respuestas.length > 0) {
            if (this.respuestas[0].condicion &&
                this.respuestas[0].condicion.toLowerCase().trim().indexOf(msg.toLowerCase().trim()) > -1) {
                
                    this.flujo.push({
                        user:   false,
                        msg:    this.respuestas[0].respuesta,
                    });

                    this.respuestas = [];

                    return this.flujo;
            }

            this.flujo.push({
                user:   false,
                msg:    this.respuestas[0].respuesta,
            });
            this.respuestas.splice(0,1);
        }
        
        return this.flujo;
    }

    setResX(msg = ''){

        if (msg != '') {
            this.flujo.push({
                user:   true,
                msg:    msg,
            });            
        }
        
        if (this.respuestaAuto) {
            let res = this.funcionRes(msg);
    
            this.flujo.push({
                user:   false,
                msg:    res,
            });            
        }

        return this.flujo;
    }

}

export default ProcesadorChat;