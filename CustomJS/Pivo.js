// Creación del objeto
function pivo(){
  this.bloqueio;
  this.cotaDisponivel;
  this.pivoLivre;
}

// Recibe un objeto y setea sus valores a los atributos correspondientes
pivo.prototype.setProperties = function(object){
  this.bloqueio = object.bloqueio.val().toLowerCase();
  this.cotaDisponivel = parseInt($(".cota-disponivel .attribute-field[name$='"+this.bloqueio+"']").val());
  this.pivoLivre = object.pivoLivre.prop('checked'); 
}

// Valida si el valor de la celda recibida por parametro es valida
pivo.prototype.validaPivo = function(celda){
  var valorCelda = Number(celda.find("input").val());
  if(valorCelda > this.cotaDisponivel && !this.pivoLivre){
      return false;
  }
  else{
      return true;
  }
}

// Valida si el valor total de la lista de celdas recibida por parametros es valida
pivo.prototype.validaPivoTotal = function(celda){
var celdasInput = celda.find("input");
var celdasNumero = $.map(celdasInput.slice(0), function(value){
  return Number($(value).val());
});
var totalCeldas = celdasNumero.reduce(function(valorAnterior, valorActual, indice, vector){
  return valorAnterior + valorActual;
});
if(totalCeldas > this.cotaDisponivel && !this.pivoLivre){
  return false;
}
else{
  return true;
}
}