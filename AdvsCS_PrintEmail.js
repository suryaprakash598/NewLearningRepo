/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define([], function () {

    function pageInit(context) {
		 jQuery('#custpage_customer_display').closest('table').hide()
	}

    function fieldChanged(context) {
        if (context.fieldId === 'custpage_chk_email') {
            var emailChecked = context.currentRecord.getValue({ fieldId: 'custpage_chk_email' });
			  
            if (emailChecked) {
                jQuery('#custpage_customer_display').closest('table').show()
            } else {
               jQuery('#custpage_customer_display').closest('table').hide()
            }
        }
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged
    };
});
