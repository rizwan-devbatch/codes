$( document ).ready(function() {

  $("#product_stores_btn").click(function(event) {
    $("#product_stores_modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/products/" + product_id + "/stores",
      success: function (data) {
        $("#product_stores_modal_body").empty();
        $("#product_stores_modal_body").append(data.html);
      }
    });
  });
  $("#product_stores_done").click(function(event) {
    product_stores_done();
  });

  $("#product_addons_btn").click(function(event) {
    $("#product_addons_modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/products/" + product_id + "/addons",
      success: function (data) {
        $("#product_addons_modal_body").empty();
        $("#product_addons_modal_body").append(data.html);
      }
    });
  });
  $("#product_addons_done").click(function(event) {
    product_addons_done();
  });

  if ($("#products-list").length) {
    $(window).load(function(){
      get_products_list();
    });
  }
    //for add and remove buttons for shiipng
    
  // end
    
   $("#product_title, #product_description, #product_start_date, #product_end_date, #product_category_id, #product_sub_category_id, #product_secondary_category_id, #product_sku, #product_quantity,#product_sub_categories_title, #product_quantity_unit, #product_price, #product_cost, #product_discount, #product_brand_id, #product_name, #product_height, #product_width, #product_length, #product_weight,#product_categories_title").blur(function() {
      form_product_save();
    });
    $("#product_own_brand_true, #product_own_brand_false, #product_status_true, #product_status_false, #product_product_deliver_shop, #product_owner_true, #product_owner_false, #product_product_deliver_deliver, #product_product_deliver_both").change(function() {
      form_product_save();
    });

    // var bitrate, multiple_images_form, progress_bar, image_wrapper;
   multiple_term_form = $("#product-term-form");
    term_wrapper = multiple_term_form.find(".progress-wrapper");
    progress_bar = images_wrapper.find(".progress-bar");
    multiple_term_form.on("fileuploadstart", function() {
      term_wrapper.show();
    });

    multiple_term_form.on("fileuploaddone", function() {
      term_wrapper.hide();
      progress_bar.width(0);
    });

    multiple_term_form.on("fileuploadprogressall", function(e, data) {
      var progress;
      progress = parseInt(data.loaded / data.total * 100, 10);
      progress_bar.css("width", progress + "%").text(progress + "%");
    });

    bitrate = term_wrapper.find(".bitrate");
    multiple_term_form.on("fileuploadprogressall", function(e, data) {
      var progress;
      bitrate.text((data.bitrate / 1024).toFixed(2) + "Kb/s");
      progress = parseInt(data.loaded / data.total * 100, 10);
      progress_bar.css("width", progress + "%").text(progress + "%");
    });

    multiple_term_form.fileupload({
      dataType: "script",
      add: function(e, data) {
        var file, types;
        types = /(\.|\/)(pdf|docx|doc)$/i;
        file = data.files[0];
        if (types.test(file.type) || types.test(file.name)) {
          data.submit();
        } else {
          alert(file.name + " must be PDF, DOCX, DOC file");
        }
      }
    });

    multiple_images_form = $("#product-images-form");
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
    

if ($("#products-listing-all").length) {
    $("#products-listing-all").click(function(){get_products_list("all");});
  }
  if ($("#products-listing-own").length) {
    $("#products-listing-own").click(function(){get_products_list("own");});
  }
  if ($("#products-listing-partner").length) {
    $("#products-listing-partner").click(function(){get_products_list("partner");});
  }
  if ($("#products-listing-unpublish").length) {
    $("#products-listing-unpublish").click(function(){get_products_list("unpublish");});
  }

      $("#products-search-form > #search_field").keypress(function(e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        get_products_list("search", $(this).val());
      }
    });
  });


  product_id = 0;
  form_product_save = function() {
    if (product_id) {
      $.ajax({
        type: "POST",
        url: "/products/" + product_id,
        data: $("#edit_product_" + product_id).serialize(),
        dataType: "json",
        format: "js"
      });
    }
  };

  get_products_list = function(type, search) {
    $.get("/products/index_ajax",
      {type: type, search: search},
      function(data) {
        $("#products-list").empty();
        $("#products-list").append(data.html);
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

  product_stores_done = function() {
  $.ajax({
    type: "POST",
    url: "/products/" + product_id + "/stores_update",
    data: $("#form_product_stores").serialize(),
    success: function (data) {
      $("#product_stores_container").html(data);
      $("#product_stores_modal").modal("hide");
    }
  });
}

product_addons_done = function() {
  $.ajax({
    type: "POST",
    url: "/products/" + product_id + "/addons_update",
    data: $("#form_product_addons").serialize(),
    success: function (data) {
      $("#product_addons_container").html(data);
      $("#product_addons_modal").modal("hide");
    }
  });
}

