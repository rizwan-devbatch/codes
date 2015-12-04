
$( document ).ready(function() {
    if ($("#stores-list").length) {
      $(window).load(function(){
        get_stores_list();
      });
    }
   
   $('select#store_country').change(function(event) {
    var country_code, select_store_wrapper, url;
    select_store_wrapper = $('#store_state_code_wrapper');
    //$('select', select_brand_wrapper).attr('disabled', true);
    country_code = $(this).val();
    url = "/stores/subregion_options?parent_region=" + country_code;
    return select_store_wrapper.load(url);
  });
  
   $("#store_title, #store_store_id, #store_web, #store_address1, #store_address2, #store_address3, #store_city, #store_state, #store_country, #store_zipcode, #store_phone, #store_order_number, #store_device_id, #store_brand_id, #store_sub_company_id, #store_store_id, #store_upload_reicpt").blur(function() {
      form_store_save();
    });
    $("#store_store_type_true, #store_store_type_false, #store_selling_type_true, #store_selling_type_false, #store_status_true, #store_status_false").change(function() {
      form_store_save();
    });
    // $("#store_sub_company_id").change(function(){
    //   $(this).val();
    // });
    $("#store_default_store").change(function() {
      if($('#store_default_store').is(':checked')){
        console.log($(this).attr('data-value'));
        if($(this).attr('data-value') == 'false'){
          alert('Company can make only one default store,Please remove the other default stores to make it default.')
          $(this).attr('checked',false);
        } else {
          form_store_save();    
        }  
      } else {
        form_store_save();  
      }
      
    });

    // var bitrate, multiple_images_form, progress_bar, image_wrapper;
   
    multiple_images_form = $("#store-images-form");
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


  if ($("#stores-listing-all").length) {
    $("#stores-listing-all").click(function(){get_stores_list("all");});
  }
  if ($("#stores-listing-brick").length) {
    $("#stores-listing-brick").click(function(){get_stores_list("brick");});
  }
  if ($("#stores-listing-web").length) {
    $("#stores-listing-web").click(function(){get_stores_list("web");});
  }
  if ($("#stores-listing-unpublish").length) {
    $("#stores-listing-unpublish").click(function(){get_stores_list("unpublish");});
  }

      $("#stores-search-form > #search_field").keypress(function(e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        get_stores_list("search", $(this).val());
      }
    });
  });

  store_id = 0;
  form_store_save = function() {
    if (store_id) {
      $.ajax({
        type: "POST",
        url: "/stores/" + store_id,
        data: $("#edit_store_" + store_id).serialize(),
        dataType: "json",
        format: "js"
      });
    }
  };

  get_stores_list = function(type, search) {
    $.get("/stores/index_ajax",
      {type: type, search: search},
      function(data) {
        $("#stores-list").empty();
        $("#stores-list").append(data.html);
      }
    );
  };

 
 get_brands_list = function(type, search) {
    $.get("/brands/index_ajax",
      {type: type, search: search},
      function(data) {
        $("#brands-list").empty();
        $("#brands-list").append(data.html);
      }
    );
  };
 

