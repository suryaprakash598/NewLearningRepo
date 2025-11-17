/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/runtime'], function(search, runtime) {

    function beforeLoad(context) {
        try {
            var currentRole = runtime.getCurrentUser().role;
            var form = context.form;
            var currentRecordType = context.newRecord.type;

            // Search your configuration record for field-role mappings
            var configSearch = search.create({
                type: 'customrecord_field_role_visibility',
                columns: ['custrecord_field_id', 'custrecord_allowed_roles']
            });

            var results = configSearch.run().getRange({ start: 0, end: 100 });

            results.forEach(function(result) {
                var fieldId = result.getValue('custrecord_field_id');
                var allowedRoles = result.getValue('custrecord_allowed_roles'); // CSV of role IDs
                if (!fieldId || !allowedRoles) return;

                var allowedRoleIds = allowedRoles.split(',');

                // If current role not in allowed list, hide the field
                if (allowedRoleIds.indexOf(currentRole.toString()) === -1) {
                    var field = form.getField(fieldId);
                    if (field) field.updateDisplayType({ displayType: 'hidden' });
                }
            });
        } catch (e) {
            log.error('Error in beforeLoad', e);
        }
    }

    return {
        beforeLoad: beforeLoad
    };
});
