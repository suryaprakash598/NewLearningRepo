/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/url', 'N/record','N/search'], function (url, record,search) {

    function beforeLoad(context) {
        if (context.type !== context.UserEventType.VIEW) return;

        var newRecord = context.newRecord;
        var lineCount = newRecord.getLineCount({ sublistId: 'item' });

        for (var i = 0; i < lineCount; i++) {
            var itemId = newRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            }); 
			var vinid = newRecord.getSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_advs_vin_link',
                line: i
            });
			if(vinid){
				var stockobj = search.lookupFields({type:'customrecord_stock_book',id:vinid,columns:['name','custrecord_bus_prim_serial']});
				if (itemId) {
					var suiteletUrl = url.resolveScript({
						scriptId: 'customscript_advs_staa_machine_report_pr',
						deploymentId: 'customdeploy_advs_staa_machine_report_pr',
						params: {
							itemid: itemId,
							custparam_stockfld:stockobj.name,
							custparam_vinfld:stockobj.custrecord_bus_prim_serial,
							custparam_from_stock:'T'
						}
					});

					var linkHtml = '<a href="' + suiteletUrl + '" target="_blank" style="color:#0073b7;text-decoration:underline;">View</a>';

					newRecord.setSublistValue({
						sublistId: 'item',
						fieldId: 'custcol_advs_view_link',
						line: i,
						value: linkHtml
					});
				}
			}
			
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});
