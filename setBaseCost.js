/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search', 'N/log'], function(record, search, log) {

    function beforeSubmit(context) {
        try {
            var newRec = context.newRecord;
            var type = newRec.type;

            // Only apply to Inventory Items
            if (type !== record.Type.INVENTORY_ITEM) return;

            var purchasePrice = newRec.getValue({ fieldId: 'purchaseprice' });
            if (!purchasePrice) {
                log.debug('No Purchase Price', 'Skipping price update');
                return;
            }

            // Get the line count of price sublist
            var lineCount = newRec.getLineCount({ sublistId: 'price' });

            for (var i = 0; i < lineCount; i++) {
                var priceLevel = newRec.getSublistValue({
                    sublistId: 'price',
                    fieldId: 'pricelevel',
                    line: i
                });

                var currency = newRec.getSublistValue({
                    sublistId: 'price',
                    fieldId: 'currency',
                    line: i
                });

                // '1' is internal ID of Base Price
                if (priceLevel === '1' && currency === '1') { // '1' for USD usually
                    newRec.setSublistValue({
                        sublistId: 'price',
                        fieldId: 'price_1_',
                        line: i,
                        value: purchasePrice
                    });

                    log.debug('Price Updated', 'Base Price (USD) set to ' + purchasePrice);
                }
            }
        } catch (e) {
            log.error('Error in beforeSubmit', e);
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
