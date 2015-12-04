$( document ).ready(function() {
  
  $("#campaign_stores_btn").click(function(event) {
    $("#campaign_stores_modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/campaigns/" + campaign_id + "/stores",
      success: function (data) {
        $("#campaign_stores_modal_body").empty();
        $("#campaign_stores_modal_body").append(data.html);
      }
    });
  });
  $("#campaign_stores_done").click(function(event) {
    campaign_stores_done();
  });


  if ($("#campaigns-list").length) {
    $(window).load(function(){
      get_campaigns_list();
    });
  }

  $("#campaign_title, #campaign_description, #campaign_terms, #campaign_shipment_discount, #campaign_make_it_better_upper_section,#campaign_sender_customers").blur(function() {
    form_campaign_save();
  });
  $("input[name='campaign[loyalty_program]'], #campaign_store_id, #campaign_brand_id, #campaign_product_id,#campaign_chk_sender_customers, #campaign_chk_make_it_better, #campaign_chk_shipment_discount").change(function() {
    form_campaign_save();
  });
  $("input[name='campaign[template_id]']").change(function() {
    form_campaign_tempalte_save();
  });

  multiple_images_form = $("#campaign-images-form");
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

  if ($("#campaigns-listing-all").length) {
    $("#campaigns-listing-all").click(function(){get_campaigns_list("all");});
  }

  $("#campaigns-search-form > #search_field").on("keypress", function() {
    if (event.which == 13) {
      event.preventDefault();
      get_campaigns_list();
    }
  });

  /*$("#campaigns-tabs a").click(function (e) {
    e.preventDefault();
    if ($(this).attr("id") == "campaigns-tabs-campaigns") {
      if ($("#campaigns").not(":visible")) {
        $("#campaigns").show();
      }
      if ($("#terms").is(":visible")) {
        $("#terms").hide();
      }
      if ($("#membership-container").is(":visible")) {
        $("#membership-container").hide();
      }
    } else if ($(this).attr("id") == "campaigns-tabs-terms") {
      if ($("#campaigns").is(":visible")) {
        $("#campaigns").hide();
      }
      if ($("#terms").not(":visible")) {
        $("#terms").show();
      }
      if ($("#membership-container").is(":visible")) {
        $("#membership-container").hide();
      }
    } else {
      if ($("#campaigns").is(":visible")) {
        $("#campaigns").hide();
      }
      if ($("#terms").is(":visible")) {
        $("#terms").hide();
      }
      if ($("#membership-container").not(":visible")) {
        $("#membership-container").show();
      }      
    }
  });*/

  // $("#campaign_earn_point_extra").blur(function() {
  //   form_campaign_lower_section("edit_campaign_earn_point_extra");
  // });
  $("#campaign_make_it_better").blur(function() {
    form_campaign_lower_section("edit_campaign_make_it_better");
  });
  $("#campaign_referral_fees").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_fees");
  });


  $("#campaign_amount_spend_on_product").blur(function() {
    form_campaign_lower_section("edit_campaign_amount_spend_on_product");
  });
  $("#campaign_amount_spend_on_brand").blur(function() {
    form_campaign_lower_section("edit_campaign_amount_spend_on_brand");
  });
  $("#campaign_make_it_better_giving_credit").blur(function() {
    form_campaign_lower_section("edit_campaign_make_it_better_giving_credit");
  });
  $("#campaign_referral_credit").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_credit");
  });


  $("#campaign_buy_product_id_at_brand").blur(function() {
    form_campaign_lower_section("edit_campaign_buy_product_id_at_brand");
  });
  $("#campaign_get_product_id_at_brand").blur(function() {
    form_campaign_lower_section("edit_campaign_get_product_id_at_brand");
  });
  $("#campaign_make_it_better_giving_qunatity").blur(function() {
    form_campaign_lower_section("edit_campaign_make_it_better_giving_quantity");
  });
  $("#campaign_referral_quantity").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_quantity");
  });


  $("#campaign_referral_fees_points_by").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_fees_points_by");
  });
 $("#campaign_required_points_reduced").blur(function() {
    form_campaign_lower_section("edit_campaign_required_points_reduced");
  });
 $("#campaign_make_it_better_further_reduced_points").blur(function() {
    form_campaign_lower_section("edit_campaign_make_it_better_further_reduced_points");
  });
 

  
 $("#campaign_portion_to_be_paid").blur(function() {
    form_campaign_lower_section("edit_campaign_portion_to_be_paid");
  });
 $("#campaign_required_points_reduced_by").blur(function() {
    form_campaign_lower_section("edit_campaign_required_points_reduced_by");
  });
  $("#campaign_make_it_better_by_reduced_points").blur(function() {
    form_campaign_lower_section("edit_campaign_make_it_better_by_reduced_points");
  });
  $("#campaign_referral_fees_cashplus").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_fees_cashplus");
  });
 

  $("#campaign_kickstart_spent_product_id").blur(function() {
    form_campaign_lower_section("edit_campaign_kickstart_spent_product_id");
  });
  $("#campaign_within_number_of_days").blur(function() {
    form_campaign_lower_section("edit_campaign_within_number_of_days");
  });
  $("#campaign_referral_fees_booster").blur(function() {
    form_campaign_lower_section("edit_campaign_referral_fees_booster");
  });


  $("#campaign_compensation_discount").blur(function() {
    form_campaign_lower_section("edit_campaign_compensation_discount");
  });
  $("#campaign_cash_plus_discount").blur(function() {
    form_campaign_lower_section("edit_campaign_cash_plus_discount");
  });


  if(!$('#campaign_chk_shipment_discount').is(':checked')){
    $('#campaign_shipment_discount').hide();
    $('#campaign_shipment_discount').val('');
    $('.campaign_adon').attr("style", "display: none !important");
  }
  $('#campaign_chk_shipment_discount').change(function(){
    if($('#campaign_chk_shipment_discount').is(':checked')){
      $('#campaign_shipment_discount').show();
      $('.campaign_adon').attr("style", "display: inlin-block !important");
    } else {
      $('#campaign_shipment_discount').hide();
      $('#campaign_shipment_discount').val('');
      $('.campaign_adon').attr("style", "display: none !important");
    }
  });
  if(!$('#campaign_chk_make_it_better').is(':checked')){
    $('#campaign_make_it_better_upper_section').hide();
    $('#campaign_make_it_better_upper_section').val('');
  }
  $('#campaign_chk_make_it_better').change(function(){
    if($('#campaign_chk_make_it_better').is(':checked')){
      $('#campaign_make_it_better_upper_section').show();
    } else {
      $('#campaign_make_it_better_upper_section').val('');
      $('#campaign_make_it_better_upper_section').hide();
    }
  });
  if(!$('#campaign_chk_sender_customers').is(':checked')){
    $('#campaign_sender_customers').hide();
    $('#campaign_sender_customers').hide();
  }
  $('#campaign_chk_sender_customers').change(function(){
    if($('#campaign_chk_sender_customers').is(':checked')){
      $('#campaign_sender_customers').show();
    } else {
      $('#campaign_sender_customers').val('');
      $('#campaign_sender_customers').hide();
    }
  });


});

form_campaign_save = function() {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      url: "/campaigns/" + campaign_id,
      data: $("#edit_campaign_" + campaign_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

form_campaign_tempalte_save = function() {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      url: "/campaigns/"+ campaign_id +"/update_template/",
      data: $("#edit_campaign_template_" + campaign_id).serialize(),
    });
  }
};

save_campaign_product_properties = function(type_id,property_id,price) {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/campaigns/"+ campaign_id +"/product_properties_save",
      data: {product_property_type_id:type_id,product_property_id:property_id,product_price:price},
    });
  }
};
save_campaign_product_y_properties = function(type_id,property_id,price) {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      url: "/campaigns/"+ campaign_id +"/product_y_properties_save",
      data: {product_property_type_id:type_id,product_property_id:property_id,product_price:price},
    });
  }
};

form_campaign_lower_section = function(form_container) {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      url: "/campaigns/" + campaign_id,
      data: $("#" + form_container).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

campaign_stores_done = function() {
  $.ajax({
    type: "POST",
    url: "/campaigns/" + campaign_id + "/stores_update",
    data: $("#form_campaign_stores").serialize(),
    success: function (data) {
      $("#campaign_stores_container").html(data);
      $("#campaign_stores_modal").modal("hide");
    }
  });
}  

form_campaign_advertisement_section_save = function(campaign_id, type) {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      url: $("#edit_campaign_customer_" + type + "_" + campaign_id).attr("action"),
      data: $("#edit_campaign_customer_" + type + "_" + campaign_id).serialize(),
    });
  }
};

get_campaigns_list = function(type, search, search_value) {
  $.get("/campaigns/index_ajax",
    {type: type, search: search, search_value: search_value},
    function(data) {
      $("#rewards-list").empty();
      $("#rewards-list").append(data.html);
    }
  );
};

form_point_booster_save = function(booster_id, type) {
  if (campaign_id) {
    $.ajax({
      type: "POST",
      url: $("#edit_point_booster_" + type + "_" + booster_id).attr("action"),
      data: $("#edit_point_booster_" + type + "_" + booster_id).serialize(),
    });
  }
};