/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Sep 2021     Advectus
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){
   
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){
	try{
		var group ='custpage_sublist';
			var LineCount = nlapiGetLineItemCount('custpage_sublist'); 
		var VinArr = [],countValue = 0;
		var stockbooks=[];
		for(var k=1;k<=LineCount;k++){
			var Select = nlapiGetLineItemValue('custpage_sublist', 'custpage_select', k);
			if(Select == 'T'){
				var VinId = nlapiGetLineItemValue(group,'custpage_vin',k);
				var LineId = nlapiGetLineItemValue(group,'custpage_line',k);
				stockbooks.push(VinId);
				if(VinArr[LineId] != null && VinArr[LineId] != undefined){
					
				}else{
					VinArr[LineId] = new Array();
					VinArr[LineId]['vinid'] = VinId;
				}
				countValue++;
			}
		}
		var salesorderSearch = nlapiSearchRecord("salesorder",null,
		[
		   ["type","anyof","SalesOrd"], 
		   "AND", 
		   ["custbody_advs_module_name","anyof","3"], 
		   "AND", 
		   ["mainline","is","T"], 
		   "AND", 
		   ["status","noneof","SalesOrd:G","SalesOrd:C","SalesOrd:H"],  
		   "AND", 
		   ["custbody_advs_st_service_equipment","anyof",stockbooks]
		], 
		[
		   new nlobjSearchColumn("trandate"), 
		   new nlobjSearchColumn("tranid"),  
		   new nlobjSearchColumn("custbody_advs_vin_stock_number"), 
		   new nlobjSearchColumn("custbodycustbodyunit"),  
		   new nlobjSearchColumn("custcol_bus_vin")
		]
		);
		if(salesorderSearch && salesorderSearch.length>0){
			var res = confirm("You have Open RO's with selected Stockbooks. Are you sure to continue?");
			if(res){return true}else{return false}
		}
	}catch(e){
		nlapiLogExecution('error','Error',e.toString())
	}
    return true;
}

 