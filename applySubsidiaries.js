/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/runtime'], function(record, runtime) {
    function execute(context) {
        var itemId = runtime.getCurrentScript().getParameter('custscript_item_internal_id');

        if (itemId) {
            var rec = record.load({
                type: record.Type.INVENTORY_ITEM,
                id: itemId,
                isDynamic: true
            });

            // Example: Add more subsidiaries
            var subsidiaries = ['1','2','3']; // internal IDs of subsidiaries
            rec.setValue({
                fieldId: 'subsidiary',
                value: subsidiaries
            });

            rec.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            log.audit('Updated subsidiaries', subsidiaries);
        }
    }
    return { execute: execute };
});
