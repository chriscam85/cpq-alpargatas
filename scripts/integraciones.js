function consultarCategoria(dato, callback){
    return $.ajax({
        type: "GET",
        url: "https://alpargatastest1.bigmachines.com/rest/v6/customDT_MODELO?q={'cod_modelo':"+dato+"}",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            var model = result.items[0].modelo;
            callback(model);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function consultarDetallesPorModelo(dato, callback){
    return  $.ajax({
        type: "GET",
        url: "https://alpargatastest1.bigmachines.com/rest/v6/customDT_RELAC_PROD?q={modelo:'"+dato+"'}",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            callback(result.items);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}


function consultarTipoMaterial(dato, callback){
    return $.ajax({
        type: "GET",
        url: "https://alpargatastest1.bigmachines.com/rest/v6/customDT_MODELO?q={'cod_modelo':"+dato+"}",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            var model = result.items[0].tipo_material;
            callback(model);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}


function ejecutarIntegracionDisponibilidade(solicitud, callback){
    return $.ajax({
        type: "POST",
        url: "https://devalpaoic-alpargatas.integration.ocp.oraclecloud.com/ic/api/integration/v1/flows/rest/FLOW_GET_DISPONIBIL/2.0/",
        contentType: "application/json",
        data: JSON.stringify(solicitud),
        dataType: "json",
        beforeSend: this.setHeaderOIC,
        success : function(data) {
            callback(data.listSKU);
        }
    });
}

function consultarDetallesPorModeloYEstructura(modelo, centro, canal, org, callback){
    return $.ajax({
        type: "GET",
        url: "https://alpargatastest1.bigmachines.com/rest/v6/customDT_RELAC_PROD?q={modelo:'" + modelo +"', centro: '" + centro + "', canal_dist:'" + canal + "', org_venda:'" + org + "'}",
        data: {},
        contentType: "application/json",
        dataType: "json",
        success: function (result) {
            callback(result.items);
        },
        error: function (xhr) {
            console.log(xhr);
        }
    });
}

function ejecutarEnvioDatosDisponibilidade(solicitud, callback){
    return $.ajax({
        type: "POST",
        url: "https://devalpaoic-alpargatas.integration.ocp.oraclecloud.com/ic/api/integration/v1/flows/rest/FLOW_GET_DISPONIBIL/2.0/",
        contentType: "application/json",
        data: JSON.stringify(solicitud),
        dataType: "json",
        beforeSend: setHeaderOIC,
        success : function(data) {
            callback(data.listSKU);
        }
    });
}


function setHeaderOIC(xhr) {
    xhr.setRequestHeader('Authorization', "Basic " + btoa("integration:Ora@123456789"));
}