function ocultaTamanhos(){
    this.modelo;
    this.celdasTamanhos;
}

ocultaTamanhos.prototype.setProperties = function(object){
    this.modelo = object.modelo;
    this.celdasTamanhos = object.celdasTamanhos;
}

ocultaTamanhos.prototype.run = function(){
    var me = this;
    consultarCategoria(modelo, function(dato){
        me.consultarCategoriaResponse(me, dato);
    });
}

ocultaTamanhos.prototype.consultarCategoriaResponse = function(me, dato){
    consultarDetallesPorModelo(dato, function(dato){
        me.consultarTamanhosResponse(me, dato);
    });
}

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