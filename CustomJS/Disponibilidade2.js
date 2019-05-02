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
  
  allDisponibilidade.prototype.runResponses = function(responses, callback){
    var self = this;
    self.ejecutarResponse(self, responses, function(){
      callback();
    });
  }
  
  allDisponibilidade.prototype.armarRequests = function(){
    var self = this;
    $.each(this.listaFilasPaginas, function(index, value){
      var request = self.armarRequestPagina(value, self);
      self.listaRequests.push(request);
    });
    var cantidadRequest = self.listaRequests.filter(function(value, index){return value.Disponibilidade != 0;});
    self.cantidadResquestEjecutados = cantidadRequest.length;
  }
  
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
  
  allDisponibilidade.prototype.agregarDisponibilidadeMATERIAL = function(cantidad, me){
    var material = $(".material-cantidad");
    if(!material.hasClass("agrupamento-MATERIAL")){
      material.addClass("agrupamento-MATERIAL");
      material.text(cantidad);
      $("#attribute-disponibilidadePorModelo").css({display: "block"});
    }
  }
  
  allDisponibilidade.prototype.mostrarMensajeDisponibilidade = function(celda){
      var celdaColor = $(celda).closest("tr").find("td.cell-cor_coluna div");
      var mensaje = celdaColor.find(".mensaje-disponibilidad");
      if(mensaje.length == 0){
          celdaColor.append("<span class='mensaje-disponibilidad'>Disponibilidade</span>");
      }
  }
  
  allDisponibilidade.prototype.filaDisponibilizada = function(celda){
    var fila = $(celda).closest("tr");
    if(!fila.hasClass("fila-disponibilizada")){
      fila.addClass("fila-disponibilizada");
    }
  }
  
  
  
  allDisponibilidade.prototype.paginaEstaCargada = function(pag){
    var objDisponibilidade = this.buscarObjPorPag(pag);
    if(typeof objDisponibilidade === 'undefined'){
      return false;
    }
    var estaCargada = objDisponibilidade.paginaDisponibilizada();
    return estaCargada;
  }
  
  allDisponibilidade.prototype.buscarObjPorPag = function(pag){
    var obj;
    $.each(this.listaObjDisponibilidade, function(index, value){
      if(value.pagina == pag){
        obj = value;
      }
    });
    return obj;
  }
  
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
  
  allDisponibilidade.prototype.validaDisponibilidadeCOR = function(celda){
    var celdaDigitado = $(celda).closest("tr").find("td.cell-totalDigitado");
    var totalDigitado = Number(celdaDigitado.find("input").val());
    var totalCor =  Number(celdaDigitado.find(".cor-cantidad").text());
    if(totalDigitado > totalCor){
      return false;
    }
    else return true;
  }
  
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