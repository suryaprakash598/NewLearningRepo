/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/search', 'N/log'], function (record, search, log) {

    function fieldChanged(context) {
        try {
            if (context.sublistId === 'item' && context.fieldId === 'item') {
                var currentRec = context.currentRecord;
                var line = context.line;

                var itemId = currentRec.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });

                if (!itemId) return;

                // Example: Let's get the Wholesale Price (price level internalid: 2)
                var altPriceLevelId = 2; // Replace with your actual price level internal ID

                var altPrice = getItemPrice(itemId, altPriceLevelId);

                if (altPrice) {
                    // set the price into your custom column field
                    currentRec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_advs_base_price', // Replace with your custom column field id
                        value: altPrice
                    });
                }
            }
        } catch (e) {
            log.error('fieldChanged Error', e);
        }
    }

    function getItemPrice(itemId, priceLevelId) {
        var price = null;
        try {
			var inventoryitemSearchObj = search.create({
				   type: "inventoryitem",
				   filters:
				   [
					  ["type","anyof","InvtPart"], 
					  "AND", 
					  ["internalid","anyof",itemId], 
					  "AND", 
					  ["pricing.internalid","anyof",priceLevelId]
				   ],
				   columns:
				   [
					   
					  search.createColumn({
						 name: "unitprice",
						 join: "pricing"
					  }) 
				   ]
				});
				var searchResultCount = inventoryitemSearchObj.runPaged().count;
				log.debug("inventoryitemSearchObj result count",searchResultCount);
				inventoryitemSearchObj.run().each(function(result){
				   // .run().each has a limit of 4,000 results
				    var rate = result.getValue({
						 name: "unitprice",
						 join: "pricing"
					  });
				   price = rate;
				   return true;
				}); 
        } catch (e) {
            log.error('getItemPrice Error', e);
        }
        return price;
    }

    return {
        fieldChanged: fieldChanged
    };
});
