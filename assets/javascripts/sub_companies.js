$( document ).ready(function() {
	

  	// var bitrate, multiple_logo_form, progress_bar, logo_wrapper;
	  sub_company_logo_form = $("#sub_company-logo-form");
	  logo_wrapper = sub_company_logo_form.find(".progress-wrapper");
	  progress_bar = logo_wrapper.find(".progress-bar");
	  sub_company_logo_form.on("fileuploadstart", function() {
	    logo_wrapper.show();
	  });

	  sub_company_logo_form.on("fileuploaddone", function() {
	    logo_wrapper.hide();
	    progress_bar.width(0);
	  });

	  sub_company_logo_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  bitrate = logo_wrapper.find(".bitrate");
	  sub_company_logo_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    bitrate.text((data.bitrate / 1024).toFixed(2) + "Kb/s");
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  sub_company_logo_form.fileupload({
	    dataType: "script",
	    add: function(e, data) {
	      var file, types;
	      types = /(\.|\/)(gif|jpe?g|png|bmp)$/i;
	      file = data.files[0];
	      if (types.test(file.type) || types.test(file.name)) {
	        data.submit();
	      } else {
	        alert(file.name + " must be GIF, JPEG, BMP or PNG file");
	      }
	    }
	  });
});

company_id = 0;
form_company_save = function() {
  if (company_id) {
    $.ajax({
      type: "POST",
      url: "/companies/" + company_id,
      data: $("#edit_company_" + company_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

form_new_product_property_type_save = function(type_id) {
	if (company_id) {
		$.ajax({
		    type: "POST",
		    url: "/companies/product_property_type_save/" + type_id,
		    data: $("#form-new-property-type-"+type_id).serialize(),
		    dataType: "json",
		    format: "js"
	  	});
	}
};

function call_form_new_product_property_save(property_id){
	form_new_product_property_save(property_id);
}

form_new_product_property_save = function(property_id) {
	if (company_id) {
		$.ajax({
		    type: "POST",
		    url: "/companies/product_property_save/" + property_id,
		    data: $("#form-new-property-"+property_id).serialize(),
		    dataType: "json",
		    format: "js"
	  	});
	}
};
