// Creación del objeto
function validadorCelda(){
	this.modelo;
	this.celdasTamanhos;
    this.centro;
    this.canal;
    this.org;
}

// Recibe un objeto y setea sus valores a los atributos correspondientes
validadorCelda.prototype.setProperties = function(object){
    this.modelo = object.modelo;
    this.celdasTamanhos = object.celdasTamanhos;
    this.centro = object.centro;
    this.canal = object.canal;
    this.org = object.org;
}

// Ejecuta el script para que las celdas que no esten en la tabla, no se pueda ingresar cantidades
validadorCelda.prototype.run = function(callback){
    var me = this;
	consultarCategoria(me.modelo, function(dato){
        me.consultarCategoriaResponse(me, dato, function(datos){
            me.consultarDetallesPorModeloResponse(datos);
            callback();
        });
    });
}

// Recibe un response con la categoria del modelo y consulta los datos del modelo por estructura
validadorCelda.prototype.consultarCategoriaResponse = function(me, dato, callback){
	consultarDetallesPorModeloYEstructura(dato, me.centro, me.canal, me.org, function(datos){
        callback(datos);
    });
}

// Recibe una lista de con los detalles del modelo y invalida las celdas que no estan en los detalles
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