// 1
function validarString(celda){
    var celdaInput = $(celda).find("input");
    var val = celdaInput.val().replace(/\D/g,"");
    celdaInput.val(val);
}