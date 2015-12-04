$( document ).ready(function() {
	
  	

  	
});
function call_form_shipment_save(form){
  form_shipment_save(form);  
}
form_shipment_save = function(form_id) {
  if (form_id) {
    $.ajax({
      type: "POST",
      url: "/shipments/" + form_id,
      data: $("#edit_shipment_" + form_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};
