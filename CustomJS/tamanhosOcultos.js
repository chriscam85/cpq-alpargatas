// Creación del objeto
function ocultaTamanhos(){
	this.modelo;
	this.celdasTamanhos;
}

// Recibe un objeto y setea sus valores a los atributos correspondientes
ocultaTamanhos.prototype.setProperties = function(object){
    this.modelo = object.modelo;
    this.celdasTamanhos = object.celdasTamanhos;
}

// Ejecuta script para ocultar las columnas de tamanahos que no corresponden con el modelo
ocultaTamanhos.prototype.run = function(){
    var me = this;
	consultarCategoria(modelo, function(dato){
        me.consultarCategoriaResponse(me, dato);
    });
}

// Recibe un response con la categoria del modelo y lo usa para consultar los tamanhos
ocultaTamanhos.prototype.consultarCategoriaResponse = function(me, dato){
	consultarDetallesPorModelo(dato, function(dato){
        me.consultarTamanhosResponse(me, dato);
    });
}

// Oculta las columnas tamanhos que no corresponden con el modelo
ocultaTamanhos.prototype.consultarTamanhosResponse = function(me, dato){
    var tamanhos = [];
    $.each(dato, function(key, value){
        var valor = value.tamanho;
        if(!tamanhos.includes(valor)){
            tamanhos.push(valor);
        }
    });
    me.celdasTamanhos.each(function() {
        var n = (this.className.match(/cell-t(\d+)/) || []).pop();
        if(!tamanhos.includes(n) && typeof n !== "undefined"){
            $(this).hide();
            $("#attribute-t" + n).hide();
        }
    });
}