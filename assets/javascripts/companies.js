$( document ).ready(function() {
	$('select#company_country').change(function(event) {
	    var country_code, select_company_wrapper, url;
	    select_company_wrapper = $('#company_state_code_wrapper');
	    //$('select', select_brand_wrapper).attr('disabled', true);
	    country_code = $(this).val();
	    url = "/users/subregion_options?parent_region=" + country_code;
	    return select_company_wrapper.load(url);
  	});
  	$("#company_name, #company_address_1, #company_address_2, #company_address_3, #company_city, #company_zip, #company_phone_no, #company_fax").blur(function() {
	    form_company_save();
  	});
  	$("#company_state").change(function() {
	    form_company_save();
  	});

  	// var bitrate, multiple_logo_form, progress_bar, logo_wrapper;
	  multiple_logo_form = $("#company-logo-form");
	  logo_wrapper = multiple_logo_form.find(".progress-wrapper");
	  progress_bar = logo_wrapper.find(".progress-bar");
	  multiple_logo_form.on("fileuploadstart", function() {
	    logo_wrapper.show();
	  });

	  multiple_logo_form.on("fileuploaddone", function() {
	    logo_wrapper.hide();
	    progress_bar.width(0);
	  });

	  multiple_logo_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  bitrate = logo_wrapper.find(".bitrate");
	  multiple_logo_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    bitrate.text((data.bitrate / 1024).toFixed(2) + "Kb/s");
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  multiple_logo_form.fileupload({
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

	  multiple_images_form = $("#company-images-form");
	  images_wrapper = multiple_images_form.find(".progress-wrapper");
	  progress_bar = images_wrapper.find(".progress-bar");
	  multiple_images_form.on("fileuploadstart", function() {
	    images_wrapper.show();
	  });

	  multiple_images_form.on("fileuploaddone", function() {
	    images_wrapper.hide();
	    progress_bar.width(0);
	  });

	  multiple_images_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  bitrate = images_wrapper.find(".bitrate");
	  multiple_images_form.on("fileuploadprogressall", function(e, data) {
	    var progress;
	    bitrate.text((data.bitrate / 1024).toFixed(2) + "Kb/s");
	    progress = parseInt(data.loaded / data.total * 100, 10);
	    progress_bar.css("width", progress + "%").text(progress + "%");
	  });

	  multiple_images_form.fileupload({
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
form_sub_company_save = function(form_id) {
  if (form_id) {
    $.ajax({
      type: "POST",
      url: "/sub_companies/" + form_id,
      data: $("#edit_sub_company_" + form_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};
