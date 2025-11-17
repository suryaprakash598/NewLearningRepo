/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/task'], function(task) {
    function afterSubmit(context) {
        try {
            if (context.type === context.UserEventType.CREATE) {
                var itemId = context.newRecord.id;

                var scheduledTask = task.create({
                    taskType: task.TaskType.SCHEDULED_SCRIPT,
                    scriptId: 'customscript_add_subsidiaries_item', // your scheduled script ID
                    deploymentId: 'customdeploy_add_subsidiaries_item', // deployment ID
                    params: {
                        custscript_item_internal_id: itemId
                    }
                });
                scheduledTask.submit();
            }
        } catch (e) {
            log.error('Error triggering scheduled script', e);
        }
    }
    return {
        afterSubmit: afterSubmit
    };
});
