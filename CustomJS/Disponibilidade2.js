// Creación del objeto
function allDisponibilidade(){
  this.codMaterial;
  this.material;
  this.data;
  this.canal;
  this.setor;
  this.escritorio;
  this.equipe;
  this.centro;
  this.organizacao;
  this.transactionId;
  this.tipoMaterial;
  this.listaFilasPaginas;
  this.listaObjDisponibilidade = [];
  this.listaRequests = [];
  this.cantidadResquestEjecutados;
}

// Recibe un objeto y setea sus valores a los atributos correspondientes
allDisponibilidade.prototype.setProperties = function(object){
  this.codMaterial = object.codMaterial;
  this.material = object.material;
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

// Recibe una lista de filas a ejecutar, arma una lista de request y ejecuta la integracion
// Ejecuta los responses recibidos
// Ejecuta la funcion callback luego de ejecutar cada response
allDisponibilidade.prototype.run = function(listaFilasPaginas, callback){
  var self = this;
  this.listaFilasPaginas = listaFilasPaginas;
  this.armarRequests();
  this.ejecutarRequest(function(datos, index){
    var numLista = index;
    self.ejecutarResponse(self, datos, function(){
      callback(self.listaFilasPaginas[numLista], datos);
    });
  });
}

// Ejecuta el response recibido por parametro y luego ejecuta la funcion callback
allDisponibilidade.prototype.runResponses = function(responses, callback){
  var self = this;
  self.ejecutarResponse(self, responses, function(){
    callback();
  });
}

// Por cada lista de filas por pagina arma un request y lo carga en el array "listaRequest"
// Setea el valor "cantidadResquestEjecutados" con la cantidad de request
allDisponibilidade.prototype.armarRequests = function(){
  var self = this;
  $.each(this.listaFilasPaginas, function(index, value){
    var request = self.armarRequestPagina(value, self);
    self.listaRequests.push(request);
  });
  var cantidadRequest = self.listaRequests.filter(function(value, index){return value.Disponibilidade != 0;});
  self.cantidadResquestEjecutados = cantidadRequest.length;
}

// Recibe filas y a partir de los datos devuelve un request
allDisponibilidade.prototype.armarRequestPagina = function(filasPag, me){
      var self = me;
      var request = new Object();
      request.Disponibilidade = [];
      $.each(filasPag, function(index, value){
          var filas = $(this).find("td[class*='cell-t']").not('.celdaInvalida');
          var celdasFila = filas.find("input.text-field:not([name='cor_coluna'], [name='totalDigitado'])");
          celdasFila.each(function(i, v) {
              var clases = $(this).attr("class");
              var sku = clases.substring(clases.indexOf(self.codMaterial));
              var part = new Object();
              part.SKU_c = sku;
              part.QTDE_c = 0;
              part.Data_c = self.data;
              part.LinhaVenda_c = sku + me.transactionId;
              part.Canal_c = self.canal;
              part.Setor_c = self.setor;
              part.Centro_c = self.centro;
              part.MTO_c = "N";
              part.Organizacao_c = self.organizacao;
              part.TipoMaterial_c = self.tipoMaterial;
              part.Escritorio_c = self.escritorio;
              part.Equipe_c = self.equipe;
              part.GrupoCli_c = "";
              part.ProntaEntrega_c = "N";
              part.Consulta_c = "1";
              request.Disponibilidade.push(part);
          });
      });
      return request;
}

// Con la lista de request armados, ejecuta la integracion con OIC y luego ejecuta la funcion
// callback pasandole el response y el indice
allDisponibilidade.prototype.ejecutarRequest = function(callback){
  var self = this;
  var listas = this.listaRequests;
    $.each(listas, function(index, value){
      var pr = JSON.stringify(value);
      ejecutarIntegracionDisponibilidade(this, function(datos){
          if(typeof datos !== 'undefined'){
            callback(datos, index);
          }
      });
    });
}

// Recibe un response y por cada celda analiza la agrupacion que le corresponde
// Luego ejecuta la funcion callback
allDisponibilidade.prototype.ejecutarResponse = function(me, datos, callback){
  $.each(datos, function(index, value){
    var cantidad;
    isNaN(parseInt(value.QTDE_c)) ? cantidad = 0 : cantidad = parseInt(value.QTDE_c);
    if(value.Agrupamento_c == "SKU"){
      me.agregarDisponibilidadeSKU($("." + value.SKU_c), cantidad, me);        
    }
    else if(value.Agrupamento_c == "COR"){
      me.agregarDisponibilidadeCOR($("." + value.SKU_c), cantidad, me);
    }
    else if(value.Agrupamento_c == "LIVRE"){
      me.agregarDisponibilidadeLIVRE($("." + value.SKU_c), me);
    }
    else if(value.Agrupamento_c == "DISP"){
      me.agregarDisponibilidadeDISP($("." + value.SKU_c), cantidad, me);
    }
    else if(value.Agrupamento_c == "MATERIAL"){
      me.agregarDisponibilidadeMATERIAL(cantidad, me);
    }
  });
  callback();
}

// Recibe una celda y una cantidad y le agrega la disponibilidad por SKU
allDisponibilidade.prototype.agregarDisponibilidadeSKU = function(celda, cantidad, me){
    $(celda).addClass("agrupamento-SKU");
    var padre = $(celda).parent();
    if(!padre.hasClass("error-qtd")){
        if(padre.find(".disp-cantidad").length == 0){     
            padre.append("<span class='disp-cantidad'>" + cantidad + "</span>");
        }
        else{
            padre.find(".disp-cantidad").show();
        }
    }
    me.mostrarMensajeDisponibilidade(celda);
    me.filaDisponibilizada(celda);
}

// Recibe una celda y una cantidad y le agrega la disponibilidad por Disponibilidade
allDisponibilidade.prototype.agregarDisponibilidadeDISP = function(celda, cantidad, me){
    $(celda).addClass("agrupamento-DISP");
    var padre = $(celda).parent();
    if(!padre.hasClass("error-qtd")){
        if(padre.find(".disp-cantidadDisp").length == 0){     
            padre.append("<span class='disp-cantidadDisp'>" + cantidad + "</span>");
        }
    }
    padre.find(".disp-cantidadDisp").hide();
    me.mostrarMensajeDisponibilidade(celda);
    me.filaDisponibilizada(celda);
}

// Recibe una celda y una cantidad y le agrega la disponibilidad por COR
allDisponibilidade.prototype.agregarDisponibilidadeCOR = function(celda, cantidad, me){
  $(celda).addClass("agrupamento-COR");
  var totalDigitado = $(celda).closest("tr").find("td.cell-totalDigitado");
  if(totalDigitado.find(".cor-cantidad").length == 0){     
      totalDigitado.append("<span class='cor-cantidad'>" + cantidad + "</span>");
  }
  else{
      totalDigitado.find(".cor-cantidad").show();
  }
  me.mostrarMensajeDisponibilidade(celda);
  me.filaDisponibilizada(celda);
}

// Recibe una celda y una cantidad y le agrega la disponibilidad LIVRE
allDisponibilidade.prototype.agregarDisponibilidadeLIVRE = function(celda, me){
  $(celda).addClass("agrupamento-LIVRE");
  var totalDigitado = $(celda).closest("tr").find("td.cell-totalDigitado");
  if(totalDigitado.find(".livre-cantidad").length == 0){     
      totalDigitado.append("<span class='livre-cantidad'>LIVRE</span>");
  }
  else{
      totalDigitado.find(".livre-cantidad").show();
  }
  me.mostrarMensajeDisponibilidade(celda);
  me.filaDisponibilizada(celda);
}

// Recibe una celda y una cantidad y le agrega la disponibilidad por MATERIAL
allDisponibilidade.prototype.agregarDisponibilidadeMATERIAL = function(cantidad, me){
  var material = $(".material-cantidad");
  if(!material.hasClass("agrupamento-MATERIAL")){
    material.addClass("agrupamento-MATERIAL");
    material.text(cantidad);
    $("#attribute-disponibilidadePorModelo").css({display: "block"});
  }
}

// Muesta el mensaje de "Disponibilidade" debajo de la columna de COR
allDisponibilidade.prototype.mostrarMensajeDisponibilidade = function(celda){
    var celdaColor = $(celda).closest("tr").find("td.cell-cor_coluna div");
    var mensaje = celdaColor.find(".mensaje-disponibilidad");
    if(mensaje.length == 0){
        celdaColor.append("<span class='mensaje-disponibilidad'>Disponibilidade</span>");
    }
}

// Agrega una clase "fila-disponibilizada" a la fila de la celda recibida por parametro
allDisponibilidade.prototype.filaDisponibilizada = function(celda){
  var fila = $(celda).closest("tr");
  if(!fila.hasClass("fila-disponibilizada")){
    fila.addClass("fila-disponibilizada");
  }
}

// Recibe una celda y valida su valor por agrupamento SKU-DISP
allDisponibilidade.prototype.validaDisponibilidadeSKU_DISP = function(celda){
  var valorCelda = Number(celda.find("input").val());
  var valorDisponible = Number(celda.find("span").text());
  if(valorCelda > valorDisponible){
      return false;
  }
  else{
      return true;
  }
}

// Recibe una celda y valida su valor por agrupamento COR
allDisponibilidade.prototype.validaDisponibilidadeCOR = function(celda){
  var celdaDigitado = $(celda).closest("tr").find("td.cell-totalDigitado");
  var totalDigitado = Number(celdaDigitado.find("input").val());
  var totalCor =  Number(celdaDigitado.find(".cor-cantidad").text());
  if(totalDigitado > totalCor){
    return false;
  }
  else return true;
}

// Recibe una lista de celdas y valida su valor por agrupamento Material
allDisponibilidade.prototype.validaDisponibilidadeMaterial = function(celdas){
  var celdasInput = celdas.find("input");
  var cantidad = Number($(".material-cantidad").text());
  var celdasNumero = $.map(celdasInput.slice(0), function(value){
    return Number($(value).val());
  });
  var totalCeldas = celdasNumero.reduce(function(valorAnterior, valorActual, indice, vector){
    return valorAnterior + valorActual;
  });
  if(totalCeldas > cantidad){
    return false;
  }
  else return true;
}