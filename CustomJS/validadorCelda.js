function validadorCelda(){
	this.modelo;
	this.celdasTamanhos;
    this.centro;
    this.canal;
    this.org;
}
validadorCelda.prototype.setProperties = function(object){
    this.modelo = object.modelo;
    this.celdasTamanhos = object.celdasTamanhos;
    this.centro = object.centro;
    this.canal = object.canal;
    this.org = object.org;
}

validadorCelda.prototype.run = function(callback){
    var me = this;
	consultarCategoria(me.modelo, function(dato){
        me.consultarCategoriaResponse(me, dato, function(datos){
            me.consultarDetallesPorModeloResponse(datos);
            callback();
        });
    });
}

validadorCelda.prototype.consultarCategoriaResponse = function(me, dato, callback){
	consultarDetallesPorModeloYEstructura(dato, me.centro, me.canal, me.org, function(datos){
        callback(datos);
    });
}

validadorCelda.prototype.consultarDetallesPorModeloResponse = function(datos){
    this.datos = datos;
    var me = this;
    $.each(this.celdasTamanhos, function(index, value){
        var input = $(value).find("input.text-field");
        var tamanho = ($(input).prop("name").match(/t(\d+)/) || []).pop();
        var indiceColumna = $(input).prop("id").indexOf("-");
        var columna = $(input).prop("id").substring(indiceColumna + 1);
        var columnaValor = $("#cor_coluna-" + columna).val();
        if (!me.datos.some(e => e.tamanho === tamanho && e.cor === columnaValor)) {
            $(value).addClass("celdaInvalida");
        }
    });
}