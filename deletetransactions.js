/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/search', 'N/record', 'N/log', 'N/runtime'], function (search, record, log, runtime) {

    function getInputData() {
        return search.create({
            type: search.Type.SALES_ORDER,
            filters: [
                ['mainline', 'is', 'T'],
                'AND',
                ['status', 'anyof', ['SalesOrd:A', 'SalesOrd:D']] // Pending Approval or Pending Fulfillment
            ],
            columns: ['internalid']
        });
    }

    function map(context) {
        const result = JSON.parse(context.value);
        const salesOrderId = result.id;

        try {
            // Find dependent transactions
            const relatedTrans = findRelatedTransactions(salesOrderId);

            // Delete dependents first
            relatedTrans.forEach(function (trans) {
                try {
                    record.delete({ type: trans.type, id: trans.id });
                    log.audit('Deleted Dependent', `Deleted ${trans.type} ID ${trans.id}`);
                } catch (e) {
                    log.error('Dependent Deletion Error', `Type: ${trans.type}, ID: ${trans.id}, Error: ${e.message}`);
                }
            });

            // Delete the Sales Order
            record.delete({ type: record.Type.SALES_ORDER, id: salesOrderId });
            log.audit('Deleted Sales Order', `ID: ${salesOrderId}`);
        } catch (e) {
            log.error('Sales Order Deletion Error', `ID: ${salesOrderId}, Error: ${e.message}`);
        }
    }

    function findRelatedTransactions(salesOrderId) {
        const relatedTransactions = [];

        const transSearch = search.create({
            type: "transaction",
            filters: [
                ["createdfrom.internalid", "anyof", salesOrderId],
                "AND",
                ["mainline", "is", "T"]
            ],
            columns: ['recordtype', 'internalid']
        });

        transSearch.run().each(function (result) {
            relatedTransactions.push({
                type: result.getValue('recordtype'),
                id: result.getValue('internalid')
            });
            return true;
        });

        return relatedTransactions;
    }

    return {
        getInputData: getInputData,
        map: map
    };
});
