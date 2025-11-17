/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/runtime', 'N/url', 'N/redirect','N/https','N/record','N/search'], 
    function (ui, runtime, url, redirect,https,record,search) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
			var customer = context.request.parameters.custparam_customer_id;
			var recoid = context.request.parameters.custparam_order_id;
            var form = ui.createForm({
                title: 'Print / Email Options'
            });

            // Checkbox: Print
            form.addField({
                id: 'custpage_chk_print',
                type: ui.FieldType.CHECKBOX,
                label: 'Print'
            });
			var recidobj = form.addField({
                id: 'custpage_chk_record_id',
                type: ui.FieldType.TEXT,
                label: 'RecID'
            });
			recidobj.updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });
			if(recoid){
				recidobj.defaultValue=recoid;
			}

            // Checkbox: Email
            var emailChk = form.addField({
                id: 'custpage_chk_email',
                type: ui.FieldType.CHECKBOX,
                label: 'Email'
            });

            // Customer field
            var custField = form.addField({
                id: 'custpage_customer',
                type: ui.FieldType.SELECT,
                label: 'Customer',
                source: 'customer'
            });
			if(customer){
				custField.defaultValue = customer;
				custField.updateDisplayType({ displayType: ui.FieldDisplayType.DISABLED });
			}
           // custField.updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });

            // Email field
            var emailField = form.addField({
                id: 'custpage_email',
                type: ui.FieldType.EMAIL,
                label: 'Email Address'
            });
			if(customer){
			var custData = search.lookupFields({type:'customer',id:customer,columns:['email']});
			var email = (custData && custData.email) ? custData.email : '';
			emailField.defaultValue = email;
			}
            //emailField.updateDisplayType({ displayType: ui.FieldDisplayType.HIDDEN });

            // Add client script
            form.clientScriptModulePath = './AdvsCS_PrintEmail.js';

            form.addSubmitButton({
                label: 'Submit'
            });

            context.response.writePage(form);

        } else {
            var request = context.request;
            var printChecked = request.parameters.custpage_chk_print === 'T';
            var emailChecked = request.parameters.custpage_chk_email === 'T';
            var customerId = request.parameters.custpage_customer;
            var emailAddr = request.parameters.custpage_email;
            var recordid = request.parameters.custpage_chk_record_id;

            if (printChecked) {
                var printSuiteletUrl = url.resolveScript({
                    scriptId: 'customscript_new_repair_order',
                    deploymentId: 'customdeploy_new_repair_order',
                    returnExternalUrl: false,
                    params: { 
							custparam_customer: customerId,
								custparam_from: 'T' ,
								custparam_recid:recordid,
								custparam_rectype:'salesorder'
					}
                });

                // Redirect to print suitelet in a new window
              /*   context.response.sendRedirect({
                    type: https.RedirectType.SUITELET,
                    identifier: 'customscript_new_repair_order',
                    id: 'customdeploy_new_repair_order',
                    parameters: { custparam_customer: customerId,
								custparam_from: 'T' ,
								custparam_recid:recordid,
								custparam_rectype:'salesorder'
								}
                }); */
				 var html = '<html><body>';
				html += '<script>window.open("' + printSuiteletUrl + '", "_blank");</script>';
				html += '<p>Opening in new tab...</p>';
				html += '</body></html>';

				context.response.write(html);
            }

            if (emailChecked) {
                

                // redirect or trigger email logic
                 var PrintUrl = url.resolveScript({
                scriptId: 'customscript_advs_sspa_repair_quote_pdf',
                deploymentId: 'customdeploy_advs_sspa_repair_quote_pdf',
                params: {
                        'custparam_recid': recordid,
                        'custparam_rectype': 'salesorder',
                         'custparam_approvemail': 'T',
						 'custparamcustomer':customerId,
						 'custparamccemail':emailAddr
                    }
                });
				var html = '<html><body>';
				html += '<script>window.open("' + PrintUrl + '", "_blank");window.parent.closePopup();window.parent.location.reload();</script>';
				
				html += '<p>Opening in new tab...</p>';
				html += '</body></html>';
				record.submitFields({type:record.Type.SALES_ORDER,id:recordid,values:{custbody_advs_quote_approval:true},options:{enableSourcing:!1,ignoreMandatoryFields:!0}});
				context.response.write(html);
            }
        }
    }

    return {
        onRequest: onRequest
    };
});
