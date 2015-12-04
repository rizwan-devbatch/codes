$( document ).ready(function() {

  $("#supplier_accounts_btn").click(function(event) {
    $("#supplier_accounts_modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/brands/" + brand_id + "/accounts",
      success: function (data) {
        $("#supplier_accounts_modal_body").empty();
        $("#supplier_accounts_modal_body").append(data.html);
      }
    });
  });
  $("#supplier_accounts_done").click(function(event) {
    suppliers_accounts_done();
  });

  if ($("#brands-list").length) {
    $(window).load(function(){
      get_brands_list();
    });
  }

  var form = $(".search-form");
  var btn = form.find('input[type="button"]');
  var input = form.find('input[type="text"]');

  btn.click(function(){
    if (btn.hasClass("clicked")) {
      input.hide();
      btn.removeClass("clicked");
    } else {
      input.show();
      btn.addClass("clicked");
    }
  });

  $('select#brand_country').change(function(event) {
    var country_code, select_brand_wrapper, url;
    select_brand_wrapper = $('#brand_state_code_wrapper');
    //$('select', select_brand_wrapper).attr('disabled', true);
    country_code = $(this).val();
    url = "/brands/subregion_options?parent_region=" + country_code;
    return select_brand_wrapper.load(url);
  });

  $("#brand_title,#brand_description, #brand_web, #brand_street, #brand_street1, #brand_street2, #brand_city, #brand_zip, #brand_phone, #brand_fax").blur(function() {
    form_brand_save();
  });
  $("#brand_ownership_true, #brand_ownership_false, #brand_state").change(function() {
    form_brand_save();
  });

  // var bitrate, multiple_logo_form, progress_bar, logo_wrapper;
  multiple_logo_form = $("#brand-logo-form");
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

  multiple_images_form = $("#brand-images-form");
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

  if ($("#brands-listing-all").length) {
    $("#brands-listing-all").click(function(){get_brands_list("all");});
  }
  if ($("#brands-listing-own").length) {
    $("#brands-listing-own").click(function(){get_brands_list("own");});
  }
  if ($("#brands-listing-partner").length) {
    $("#brands-listing-partner").click(function(){get_brands_list("partner");});
  }
  if ($("#brands-listing-unpublish").length) {
    $("#brands-listing-unpublish").click(function(){get_brands_list("unpublish");});
  }

  $("#brands-search-form > #search_field").keypress(function(e) {
    var code = e.keyCode || e.which;
    if (code == 13) {
      get_brands_list("search", $(this).val());
    }
  });
});

brand_id = 0;
form_brand_save = function() {
  if (brand_id) {
    $.ajax({
      type: "POST",
      url: "/brands/" + brand_id,
      data: $("#edit_brand_" + brand_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};
suppliers_accounts_done = function() {
  $.ajax({
    type: "POST",
    url: "/brands/" + brand_id + "/accounts_update",
    data: $("#form_supplier_accounts").serialize(),
    success: function (data) {
      $("#supplier_accounts_container").html(data);
      $("#supplier_accounts_modal").modal("hide");
    }
  });
}
get_brands_list = function(type, search) {
  $.get("/brands/index_ajax",
    {type: type, search: search},
    function(data) {
      $("#brands-list").empty();
      $("#brands-list").append(data.html);
    }
  );
};

get_brand_products_list = function() {
  $.get("/brands/" + brand_id + "/products_ajax",
    function(data) {
        $("#brand-products-container").empty();
        $("#brand-products-container").append(data.html);
    }
  );
};

get_brand_stores_list = function() {
  $.get("/brands/" + brand_id + "/stores_ajax",
    function(data) {
        $("#brand-stores-container").empty();
        $("#brand-stores-container").append(data.html);
    }
  );
};


