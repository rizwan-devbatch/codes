
$( document ).ready(function() {

    if ($('#customer_start_date').length) {
      $('#customer_start_date').datepicker({
        format: 'yyyy-mm-dd',
        daysOfWeekDisabled: [0]
      });  
    }
    
    if ($('#customer_end_date').length) {
      $('#customer_end_date').datepicker({
        format: 'yyyy-mm-dd',
        daysOfWeekDisabled: [0]
      });  
    }   
    $('#customer_start_date').datepicker().on('changeDate', function (e) {
      date1 = change_formate(e);
      $('#customer_start_date').val(date1);
      $('#start_hidden').val(date1);
      $('#customer_end_date').datepicker('setStartDate', date1); 
      $('#customer_end_date').datepicker('update', $('#end_hidden').val());
    });

    $('#customer_end_date').datepicker().on('changeDate', function (e) {
      date2 = change_formate(e);
      $('#customer_end_date').val(date2);
      $('#end_hidden').val(date2);
      $('#customer_start_date').datepicker('setEndDate', date2);
      $('#customer_start_date').datepicker('update', $('#start_hidden').val());
    });

    if ($("#customers-list").length) {
      $(window).load(function(){
        get_customers_list();
      });
    }
   
   $('select#customer_country').change(function(event) {
    var country_code, select_customer_wrapper, url;
    select_customer_wrapper = $('#customer_state_code_wrapper');
    //$('select', select_brand_wrapper).attr('disabled', true);
    country_code = $(this).val();
    url = "/customers/subregion_options?parent_region=" + country_code;
    return select_customer_wrapper.load(url);
  });
  
   $("#customer_title, #customer_fisrt_name, #customer_last_name, #customer_brand_id, #customer_user_id, #customer_address_line1, #customer_address_line2, #customer_address_line3, #customer_city, #customer_state, #customer_country, #customer_zipcode, #customer_phone, #customer_work_phone, #customer_membership_number, #customer_membership_tier, #customer_start_date, #customer_end_date, #customer_date_of_birth, #customer_email").blur(function() {
      form_customer_save();
    });
    $("#customer_status_true, #customer_status_false, #customer_gender_true, #customer_gender_false").change(function() {
      form_customer_save();
    });

    // var bitrate, multiple_images_form, progress_bar, image_wrapper;
   
    multiple_logo_form = $("#customer-logo-form");
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

  if ($("#customers-listing-all").length) {
    $("#customers-listing-all").click(function(){get_customers_list("all");});
  }
  if ($("#customers-listing-nuWallet").length) {
    $("#customers-listing-nuWallet").click(function(){get_customers_list("nuWallet");});
  }
  if ($("#customers-listing-nonWallet").length) {
    $("#customers-listing-nonWallet").click(function(){get_customers_list("nonWallet");});
  }
  if ($("#customers-listing-facebook").length) {
    $("#customers-listing-facebook").click(function(){get_customers_list("facebook");});
  }
  if ($("#customers-listing-twitter").length) {
    $("#customers-listing-twitter").click(function(){get_customers_list("twitter");});
  }
  if ($("#customers-listing-unpublish").length) {
    $("#customers-listing-unpublish").click(function(){get_customers_list("unpublish");});
  }

      $("#customers-search-form > #search_field").keypress(function(e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        get_customers_list("search", $(this).val());
      }
    });
  });

  customer_id = 0;
  form_customer_save = function() {
    if (customer_id) {
      $.ajax({
        type: "POST",
        url: "/customers/" + customer_id,
        data: $("#edit_customer_" + customer_id).serialize(),
        dataType: "json",
        format: "js"
      });
    }
  };

  get_customers_list = function(type, search) {
    $.get("/customers/index_ajax",
      {type: type, search: search},
      function(data) {
        $("#customers-list").empty();
        $("#customers-list").append(data.html);
      }
    );
  };

  form_imports_new = function() {
    $("#form-new-imports-modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/customers/imports_new",
      success: function (data) {
        $("#form-new-imports-modal-body").empty();
        $("#form-new-imports-modal-body").append(data.html);
      }
    });
  };
