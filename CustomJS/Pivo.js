function pivo(){
    this.bloqueio;
    this.cotaDisponivel;
    this.pivoLivre;
}

pivo.prototype.setProperties = function(object){
    this.bloqueio = object.bloqueio.val().toLowerCase();
    this.cotaDisponivel = parseInt($(".cota-disponivel .attribute-field[name$='"+this.bloqueio+"']").val());
    this.pivoLivre = object.pivoLivre.prop('checked'); 
}

pivo.prototype.validaPivo = function(celda){
    var valorCelda = Number(celda.find("input").val());
    if(valorCelda > this.cotaDisponivel && !this.pivoLivre){
        return false;
    }
    else{
        return true;
    }
}

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