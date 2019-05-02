function totalDigitado(){
    this.celdasTamanhos;
}

totalDigitado.prototype.setProperties = function(object){
    this.celdasTamanhos = object.celdasTamanhos;
}

totalDigitado.prototype.run = function(){
    var me = this;
    $.each(this.celdasTamanhos, function(index, value){
        var inputActual = $(this).find('input');
        inputActual.on('input', function(){
            me.sumarTotal(this);
        });
    });
}

totalDigitado.prototype.sumarTotal = function(celda){
    var valActual = celda.value;
    if (valActual){
        valActual = valActual.replace(/[^\d]+/g,'');
        if(valActual > 0){
            valActual = parseInt(valActual);
            celda.value = valActual;
        }
        else{
            valActual = 0;
            celda.value = "";
        }
    }
    else{
        valActual = 0;
        celda.value = "";
    }
    var celdaTotal = $(celda).closest("tr").find("td.cell-totalDigitado input");
    var hermanos = $(celda).parent().parent().siblings();
    var countHermanos = 0;
    for (let i = 3; i < hermanos.length; i++) {
        var valInputsHermanos = hermanos[i].childNodes[0].childNodes[0].value
        if( valInputsHermanos && valInputsHermanos != "undefined"){
            
            valInputsHermanos = valInputsHermanos.replace(/[^\d]+/g,'');
            
            if(valInputsHermanos > 0){
                countHermanos += parseInt(valInputsHermanos)
                
            }
        }
    }
    var countTotal = parseInt(valActual) + parseInt(countHermanos);
    
    celdaTotal.val(countTotal);
    
}