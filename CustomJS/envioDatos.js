// Creación del objeto
function envioDatos(){
    this.botonValidar;
    this.celdasAEnviar;
    this.codMaterial;
    this.material;
    this.data;
    this.canal;
    this.setor;
    this.centro;
    this.organizacao;
    this.transactionId;
    this.tipoMaterial;
    this.escritorio;
    this.equipe;
}

// Recibe un objeto y setea sus valores a los atributos correspondientes
envioDatos.prototype.setProperties = function(object){
    this.botonValidar = object.botonValidar;
    this.codMaterial = object.codMaterial;
    this.material = this.codMaterial;
    this.data = object.data;
    this.canal = object.canal;
    this.setor = object.setor;
    this.centro = object.centro;
    this.organizacao = object.organizacao;
    this.transactionId = object.transactionId;
    this.tipoMaterial = object.tipoMaterial;
    this.escritorio = object.escritorio;
    this.equipe = object.equipe;
}

// Agrega el evento click al boton "Validate"
// Arma request para reservar stock y lo ejecuta
// Con el response valida si las celdas son validas
envioDatos.prototype.run = function(){
    var me = this;
    me.botonValidar.on("click", function(){
        me.celdasAEnviar = $(".item-valido");
        var request = me.armarSolicitudEnvioDatos();
        ejecutarEnvioDatosDisponibilidade(request, function(listaSku){
            me.ejecutarEnvioDatosDisponibilidadeDone(listaSku);
        });
    });
}

// Con las celdas a enviar retorna el request armado
envioDatos.prototype.armarSolicitudEnvioDatos = function(){
  var me = this;
  var request = new Object();
  request.Disponibilidade = [];
  $.each(me.celdasAEnviar, function(index, value){
    var tamanho = ($(this).prop("name").match(/t(\d+)/) || []).pop();
    var indiceColumna = $(this).prop("id").indexOf("-");
    var columna = $(this).prop("id").substring(indiceColumna + 1);
    var columnaValor = $("#cor_coluna-" + columna).val();
    var sku = me.material + columnaValor + tamanho;
    var part = new Object();
    part.SKU_c = sku;
    part.QTDE_c = Number($(value).val());
    part.Data_c = me.data;
    part.LinhaVenda_c = sku + me.transactionId;
    part.Canal_c = me.canal;
    part.Setor_c = me.setor;
    part.Centro_c = me.centro;
    part.MTO_c = "N";
    part.Organizacao_c = me.organizacao;
    part.TipoMaterial_c = me.tipoMaterial;
    part.Escritorio_c = me.escritorio;
    part.Equipe_c = me.equipe;
    part.GrupoCli_c = "";
    part.ProntaEntrega_c = "N";
    part.Consulta_c = "0";
    request.Disponibilidade.push(part);
  });
  return request;
}

// Con la lista de sku de response, valida si la celda es valida
// Ejecuta la funcion de ocultar botones
envioDatos.prototype.ejecutarEnvioDatosDisponibilidadeDone = function(listaSku){
    var me = this;
  $.each(listaSku, function(index, value){
    if(value.QTDE_c > 0){
        me.validaCelda(value.SKU_c, true);
    }
    else{
        me.validaCelda(value.SKU_c, false);
    }
  });
  this.ocultaBotones();
}

// Valida si la celda es valida
envioDatos.prototype.validaCelda = function(sku, valido){
    var celda = $('.' + sku);
    if(valido){
        if(!celda.hasClass('item-enviado')){
            celda.addClass('item-enviado');
        }
    }
    else{
        if(!celda.hasClass('item-noEnviado')){
            celda.addClass('item-noEnviado');
        }
    }
}

// Si no hay errores muestra los botones, sino los ocultan
envioDatos.prototype.ocultaBotones = function(){
    var hayError = this.hayItemError();
    if(hayError){
        $("#add_to_transação, #update").hide();
    }
    else{
        $("#add_to_transação, #update").show();
    }
}

// Verifica si hay error
envioDatos.prototype.hayItemError = function(){
    if($(".item-noEnviado").length == 0){
        return false;
    }
    else{
        return true;
    }
}
