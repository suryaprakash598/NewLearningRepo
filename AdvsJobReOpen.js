/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record'], function(record) {

    function onRequest(context) {
        var req = context.request;

        var recId   = req.parameters.recordid;
        var newVal  = req.parameters.newvalue;

        // SET YOUR RECORD TYPE + FIELD ID
        var recType = 'customrecord_advs_task_record';
        var fieldId = 'custrecord_st_r_t_status';
			log.debug('data',{recType,recId,fieldId})
        try {
          var _id =  record.submitFields({
                type: recType,
                id: recId,
                values: {'custrecord_st_r_t_status':''}
            });
			if(_id){
				var obj = {
					success: true,
					id: recId
				};

				context.response.write(JSON.stringify(obj));
			}else{
				 context.response.write(JSON.stringify({
					success: false,
					message: 'Job Reopen Issue'
				}));
			}
            
        }
        catch (e) {
            context.response.write(JSON.stringify({
                success: false,
                message: e.message
            }));
        }
    }

    return { onRequest: onRequest };
});
