/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search'],
    function(search) {
        function pageInit(context) {
            if (context.mode !== 'copy')
                return;
			var _itemship = getUrlParameter('itemship');
			if(_itemship){
				var ifobj = search.lookupFields({type:'itemfulfillment',id:_itemship,columns:['trandate']});
				var trandate = ifobj.trandate;
				 var currentRecord = context.currentRecord;
					currentRecord.setValue({
						fieldId: 'trandate',
						value: new Date(trandate)
					});
			}
           
        }
		 function getUrlParameter(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };
         
        return {
            pageInit: pageInit, 
        };
    }); 