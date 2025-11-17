/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/record', 'N/redirect', 'N/search'], 
function(ui, record, redirect, search) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Build form
            var form = ui.createForm({
                title: 'Create Vendor Return Authorization'
            });
			var costsheetid = context.request.parameters.costsheetid;

            // Vendor field
            var vendorField = form.addField({
                id: 'custpage_vendor',
                type: ui.FieldType.SELECT,
                label: 'Select Vendor',
                source: 'vendor'
            });
            vendorField.isMandatory = true;
			
			var vendorItem = form.addField({
                id: 'custpage_vendor_item',
                type: ui.FieldType.SELECT,
                label: 'Item',
                source: 'item'
            });
			vendorItem.defaultValue = 19142;
            vendorItem.isMandatory = true;
			
			var vendorItemLoc = form.addField({
                id: 'custpage_vendor_location',
                type: ui.FieldType.SELECT,
                label: 'Location',
                source: 'location'
            });
			vendorItemLoc.defaultValue = 13;
            vendorItemLoc.isMandatory = true;
			
			var vendorRate = form.addField({
                id: 'custpage_vendor_rate',
                type: ui.FieldType.CURRENCY,
                label: 'Amount' 
            });
			var vendorCostsheet = form.addField({
                id: 'custpage_vendor_costsheet',
                type: ui.FieldType.TEXT,
                label: 'Costsheet ID' 
            });
			 if(costsheetid){
				 vendorCostsheet.defaultValue = costsheetid;
			 }

            form.addSubmitButton({
                label: 'Create VRA'
            });

            context.response.writePage(form);

        } else {
            // POST - Create Vendor Return Authorization
            var vendorId = context.request.parameters.custpage_vendor;
            var vendorItem = context.request.parameters.custpage_vendor_item;
            var vendorAmount = context.request.parameters.custpage_vendor_rate;
            var vendorCS = context.request.parameters.custpage_vendor_costsheet;

            var vra = record.create({
                type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                isDynamic: true
            });

            vra.setValue({
                fieldId: 'entity',
                value: vendorId
            });
			vra.setValue({
                fieldId: 'location',
                value: 13
            });
			if(vendorCS){
				vra.setValue({
                fieldId: 'custbody_advs_vehicle_cost',
                value: vendorCS
				});
			}
			

            // Optionally: Add one default item to return
            // (remove this block if you want an empty VRA)
            vra.selectNewLine({ sublistId: 'item' }); 
			 vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_advs_selected_inventory_type',
                value: 14 // replace with actual item internal ID
            });
            vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol_advs_task_item',
                value: vendorItem // replace with actual item internal ID
            });
			vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                value: vendorItem // replace with actual item internal ID
            });
            vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                value: 1
            });
			vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                value: vendorAmount
            });
			vra.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'amount',
                value: vendorAmount
            });
            vra.commitLine({ sublistId: 'item' });

            var vraId = vra.save({
                enableSourcing: true,
                ignoreMandatoryFields: false
            });
			 
			
            // Redirect to created VRA
            redirect.toRecord({
                type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                id: vraId
            });
        }
    }

    return {
        onRequest: onRequest
    };
});
