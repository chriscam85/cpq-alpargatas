function paginarTabla(){
    this.cantidadDeFilasPorPagina;
    this.tabla;
    this.listRows;
    this.filasPorPagina = [];
    this.filasPagina = [];
    this.paginaActual = 0;
    this.paginador;
    this.flechaRight;
    this.flechaLeft;
    this.cantidadDePaginas;
    
}

paginarTabla.prototype.setProperties = function(object){
    this.cantidadDeFilasPorPagina = object.cantidadFilas;
    this.tabla = object.tabla;
    this.listRows = this.tabla.find("tbody tr");
    this.filasPorPagina = [];
    this.filasPagina = [];
    this.paginaActual = 0;
    this.paginador = object.paginador;
    this.flechaRight;
    this.flechaLeft;
    this.cantidadDePaginas;
}

paginarTabla.prototype.run = function(){
    this.cargarPaginas();
    this.paginar();
    this.ingresarFlechas();
}

paginarTabla.prototype.cargarPaginas = function() {
    var filasPag = this.filasPagina;
    var cantFilas = this.cantidadDeFilasPorPagina;
    var filasPorPag = this.filasPorPagina;
    $.each(this.listRows, function(index, value){
        var numeroFila = Number($(value).find("th").text());
        if(numeroFila % cantFilas != 0){
            filasPag.push(this);
        }
        else{
            filasPag.push(this);
            var clone = filasPag.slice(0);
            filasPorPag.push(clone);
            filasPag.length = 0;
        }
    });
    
    var clone = filasPag.slice(0);
    filasPorPag.push(clone);
    filasPag.length = 0;
    this.cantidadDePaginas = filasPorPag.length;
}

paginarTabla.prototype.paginar = function() {
    var paginaActual = this.paginaActual;
    $.each(this.filasPorPagina, function(index, value){
        if(index == paginaActual){
            value.map(function(x){
                $(x).addClass("filaVisible");
            })
        }
        else{
            value.map(function(x){
                $(x).addClass("filaOculta");
            })
        }
    });
}

paginarTabla.prototype.ingresarFlechas = function() {
    this.paginador.addClass("flechasPadre");
    this.paginador.append('<div class="flechaLeft"></div>')
    this.paginador.append('<div class="flechaRight"></div>')
    this.flechaLeft = this.paginador.find(".flechaLeft");
    this.flechaRight = this.paginador.find(".flechaRight");
    this.agregarEventosClick();
    this.actualizarFlechas();
}

paginarTabla.prototype.agregarEventosClick = function() {
    var me = this;
    var funcionSiguiente = this.paginaSiguiente;
    var funcionAnterior = this.paginaAnterior;
    this.flechaRight.on("click", function(){
        funcionSiguiente(me);
    });
    this.flechaLeft.on("click", function(){
        funcionAnterior(me);
    });
}

paginarTabla.prototype.paginaSiguiente = function(me){
    if(me.hayPagSiguiente()){
        var paginaSiguiente = me.paginaActual + 1;
        $.each(me.filasPorPagina, function(index, value){
            if(index == paginaSiguiente){
                value.map(function(x){
                    $(x).removeClass("filaOculta");
                    $(x).addClass("filaVisible");
                })
            }
            else{
                value.map(function(x){
                    $(x).removeClass("filaVisible");
                    $(x).addClass("filaOculta");
                })
            }
        });
        me.paginaActual = paginaSiguiente;
        me.actualizarFlechas();
    }
}

paginarTabla.prototype.hayPagSiguiente = function() {
    if(this.paginaActual + 1 <= this.cantidadDePaginas - 1){
        return true;
    }
    else {
        return false;
    }
}

paginarTabla.prototype.paginaAnterior = function(me){
    if(me.hayPagAnterior()){
        var paginaAnterior = me.paginaActual - 1;
        $.each(me.filasPorPagina, function(index, value){
            if(index == paginaAnterior){
                value.map(function(x){
                    $(x).removeClass("filaOculta");
                    $(x).addClass("filaVisible");
                })
            }
            else{
                value.map(function(x){
                    $(x).removeClass("filaVisible");
                    $(x).addClass("filaOculta");
                })
            }
        });
        me.paginaActual = paginaAnterior;
        me.actualizarFlechas();
    }
}

paginarTabla.prototype.hayPagAnterior = function() {
    if(this.paginaActual - 1 >= 0){
        return true;
    }
    else {
        return false;
    }
}

paginarTabla.prototype.actualizarFlechas = function() {
    if(this.hayPagAnterior()){
        this.flechaLeft.removeClass("flechaLeftActiva");
        this.flechaLeft.addClass("flechaLeftActiva");
        this.flechaLeft.removeClass("flechaLeftNoActiva");
    }
    else{
        this.flechaLeft.removeClass("flechaLeftNoActiva");
        this.flechaLeft.addClass("flechaLeftNoActiva");
        this.flechaLeft.removeClass("flechaLeftActiva");
    }
    if(this.hayPagSiguiente()){
        this.flechaRight.removeClass("flechaRightActiva");
        this.flechaRight.addClass("flechaRightActiva");
        this.flechaRight.removeClass("flechaRightNoActiva");
    }
    else{
        this.flechaRight.removeClass("flechaRightNoActiva");
        this.flechaRight.addClass("flechaRightNoActiva");
        this.flechaRight.removeClass("flechaRightActiva");
    }
}