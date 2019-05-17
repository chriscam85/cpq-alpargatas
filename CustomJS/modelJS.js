// Inicializa variables a utilizar en todo el JS
var modelo = $("#attribute-categoria_novo_text span").text();
var celdasTamanhos = $('td[class*="cell-t"]').not(".cell-totalDigitado");
var cantidadFilas = 12;
var material = "00000000000" + modelo;
var data = $("#DATA_PREV_FAT").val();
var canal = $("#CANAL_DIST").val();
var setor = $("#SETOR_ATIV").val();
var centro = $("#seleccionar_centro_text").val();
var organizacao = $("#ORG_VENDA").val();
var escritorio = $("#ESC_VENDA").val();
var equipe = $("#EQUI_VENDA").val();
var transactionId = $("#TRANSACTION_ID").val();
var tabla = $("table.array");
var tipoMaterial;
var ejecutarIntegracion = $("[name=ejecutarIntegracion]")[0];
var cadenaIntegraciones = [];

// Inicializa objetos/scripts
var ocultaTamanhos = new ocultaTamanhos();
var paginador = new paginarTabla();
var disponibilidade = new allDisponibilidade();
var pivo = new pivo();
var validaCelda = new validadorCelda();
var envioDatos = new envioDatos();
var totalDigitado = new totalDigitado();

// Comienza el flujo del script
$(document).ready(function(){
  consultarTipoMaterial(modelo, function(dato){
    tipoMaterial = dato;
    masterJS();
  });
});

// Setea valores en los objetos, ejecuta los script y agrega los eventos para validar celdas
function masterJS(){
  $(".hideGrid").css('visibility', 'visible');
  $("#validateEnvio").hide();
  $("#add_to_transação, #update").hide();
  
  setPropertiesObjects();
  totalDigitado.run();
  ocultaTamanhos.run();
  paginador.run();
  envioDatos.run();
  validaCelda.run(function(){
    agregarSku();
    if(ejecutarIntegracion.checked){
      var i = 1;
      disponibilidade.run(paginador.filasPorPagina, function(filasDisponibilizadas, datos){
        var celdasObj = obtenerCeldasPorPagina(filasDisponibilizadas);
        setearIntegracion(datos);
        $(ejecutarIntegracion).val(false);
        eventosBlur(celdasObj);
        if(i == disponibilidade.cantidadResquestEjecutados && !$(".material-cantidad").hasClass("agrupamento-MATERIAL") ){
          $(".disp-cantidadDisp").show();
        }
        i++;
      });
    }
    else{
      $("#add_to_transação").show();
      var responsesIntegraciones = $("#datosIntegracion").attr("data-initial-value");
      responsesIntegraciones = JSON.parse(responsesIntegraciones);
      disponibilidade.runResponses(responsesIntegraciones, function(){
        eventosBlur(celdasTamanhos.not(".celdaInvalida"));
      });
    }
  });
}

// Ejecuta el método "SetProperties" de cada objeto
function setPropertiesObjects(){
    
  totalDigitado.setProperties({
    celdasTamanhos : celdasTamanhos
  });
  
  ocultaTamanhos.setProperties({
    modelo: modelo,
    celdasTamanhos: celdasTamanhos
  });

  paginador.setProperties({
    cantidadFilas: cantidadFilas,
    tabla: tabla,
    paginador: $("#pagination")
  });

  disponibilidade.setProperties({
  codMaterial: modelo,
  material: modelo,
  data: data,
  canal: canal,
  setor: setor,
  centro: centro,
  organizacao: organizacao,
  transactionId: transactionId,
  tipoMaterial: tipoMaterial,
  escritorio: escritorio,
  equipe: equipe
  });

  pivo.setProperties({
    bloqueio: $("#bloqueio"),
    pivoLivre: $("[name='pivo_livre']")
  });

  validaCelda.setProperties({
      modelo: modelo,
      celdasTamanhos: celdasTamanhos,
      centro: centro,
      canal: canal,
      org: organizacao
  });

  envioDatos.setProperties({
    botonValidar: $("#validateEnvio"),
    codMaterial: modelo,
    data: data,
    canal: canal,
    setor: setor,
    centro: centro,
    organizacao: organizacao,
    transactionId: transactionId,
    tipoMaterial: tipoMaterial,
    escritorio: escritorio,
    equipe: equipe
  });
}

// Recibe una lista de celdas, le asigna un evento 'blur', con el que se van a realizar las validaciones
function eventosBlur(celdas){
  $.each(celdas, function(index, value){
    $(this).find("input").on('blur', function(){
      var celda = $(this).closest("td");
      validarString(celda);
      if($(this).val() != ""){
        validarCelda(celda, disponibilidade, pivo);
        validarBotonValidaEnvio();
      }
      else{
        removerClases(celda);
      }
    });
  });
}

// Realiza todas las validaciones de agrupaciones por disponibilidad
function validarCelda(celda, disponibilidade, pivo){
  var celdasConPedido = $('td[class*="cell-t"]').not(".cell-totalDigitado, .celdaInvalida")
  .filter(function(index, value) 
    {var valor = $(value).find("input").val(); return valor != "";});
  var pivoValido = pivo.validaPivoTotal(celdasConPedido);
  if(!pivoValido){
    validaClasesCeldas(celdasConPedido, false);
  }
  else{
    validaClasesCeldas(celdasConPedido, true);
    var inputError = celda.find("input");
    if(inputError.hasClass("agrupamento-SKU")){
      if(disponibilidade.validaDisponibilidadeSKU_DISP(celda)){
        validaClasesCeldas(celda, true);
      }
      else{
        validaClasesCeldas(celda, false);
      }
    }
    else if(!$(".material-cantidad").hasClass("agrupamento-MATERIAL") && inputError.hasClass("agrupamento-DISP")){
      if(disponibilidade.validaDisponibilidadeSKU_DISP(celda)){
        validaClasesCeldas(celda, true);
      }
      else{
        validaClasesCeldas(celda, false);
      }
    }
    else if(inputError.hasClass("agrupamento-COR")){
      var celdasFila = inputError.closest("tr").find('td[class*="cell-t"]').not(".cell-totalDigitado, .celdaInvalida").filter(function(index, value) {var valor = $(value).find("input").val(); return valor != "";});
      if(disponibilidade.validaDisponibilidadeCOR(celda)){
        validaClasesCeldas(celdasFila, true);
      }
      else{
        validaClasesCeldas(celdasFila, false);
      }
    }
    else if(inputError.hasClass("agrupamento-LIVRE")){
      validaClasesCeldas(celdasConPedido, true);
    }
    else if($(".material-cantidad").hasClass("agrupamento-MATERIAL")){
      var celdasMaterial = celdasConPedido.filter(function(index, value){var inp = $(value).find("input"); return !inp.hasClass("agrupamento-LIVRE") && !inp.hasClass("agrupamento-COR") && !inp.hasClass("agrupamento-SKU");})
      if(disponibilidade.validaDisponibilidadeMaterial(celdasMaterial)){
        validaClasesCeldas(celdasMaterial, true);
      }
      else{
        validaClasesCeldas(celdasMaterial, false);
      }
    }
  }
}

// Recibe una lista de celdas y una condicion
// Si la condicion es true, marca esas celdas como validas
// Si la condicion es false, las marca con un error
function validaClasesCeldas(celdas, condicion){
  var celdaError = celdas.find("div.attribute-field-container");
  var inputError = celdaError.find("input");
  if(condicion){
      celdaError.removeClass("error-qtd");
      inputError.removeClass("item-valido");
      inputError.addClass("item-valido");
    }
    else{
      inputError.removeClass("item-valido");
      celdaError.removeClass("error-qtd");
      celdaError.addClass("error-qtd");
  }
}

// Si no hay celdas con error, muestra el boton "Validate"
function validarBotonValidaEnvio(){
  var error = $(".error-qtd");
  if(error.length == 0){
    $("#validateEnvio").show();
  }
  else{
    $("#validateEnvio").hide();
  }
}

// Recibe una celda y le quita todas las clases para validaciones
function removerClases(celda){
  var celdaError = celda.find("div.attribute-field-container");
  var inputValido = celdaError.find("input");
  celdaError.removeClass("error-qtd");
  inputValido.removeClass("item-valido");
  inputValido.removeClass("item-noEnviado");
  inputValido.removeClass("item-enviado");
}

// Recibe una lista de filas y retorna una lista con todas las celdas de las filas recibidas
function obtenerCeldasPorPagina(filasDisponibilizadas){
  var celdas = [];
  $.each(filasDisponibilizadas, function(index, value){
    var tds = $(value).find("td[class*='cell-t']").not('.celdaInvalida, .cell-totalDigitado');
    $.each(tds, function(index, value){
      celdas.push(value);
    });
  });
  return celdas;
}

// Recibe un response de una integracion y lo agrega a la array global "cadenaIntegraciones"
// Setea del array en el atributo "#datosIntegracion"
function setearIntegracion(datos){
  $.each(datos, function(index, value){
    cadenaIntegraciones.push(JSON.stringify(value));
  });
  var cad = "[" + cadenaIntegraciones.toString() + "]";
  $("#datosIntegracion").text(cad);
  $("#datosIntegracion").attr("data-initial-value", cad);
}

// A todos los inputs de celdas Tamanhos, les agrega una clase con su SKU
function agregarSku(){
  var celdasFila = $(celdasTamanhos).find("input.text-field:not([name='cor_coluna'], [name='totalDigitado'])");
  celdasFila.each(function(i, v) {
    var tamanho = ($(this).prop("name").match(/t(\d+)/) || []).pop();
    var indiceColumna = $(this).prop("id").indexOf("-");
    var columna = $(this).prop("id").substring(indiceColumna + 1);
    var columnaValor = $("#cor_coluna-" + columna).val();
    var sku = modelo + columnaValor + tamanho;
    $(this).addClass(sku);
  });
}