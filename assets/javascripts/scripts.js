/**
 * App scripts Created on 11/17/14.
 */

//doc ready function
$(document).ready(function() {
  
  if ($("#marketers input[type='checkbox']").length) {
    if ($("#marketers input[type='checkbox']").is(':checked')) {
      $("#marketers_others").hide();
    } else {
      $("#marketers_others").show();
    }  
  }

  if ($("#approvers input[type='checkbox']").length) {
    if ($("#approvers input[type='checkbox']").is(':checked')) {
      $("#approvers_others").hide();
    } else {
      $("#approvers_others").show();
    }  
  }

  if ($("#cashiers input[type='checkbox']").length) {
    if ($("#cashiers input[type='checkbox']").is(':checked')) {
      $("#cashiers_others").hide();
    } else {
      $("#cashiers_others").show();
    }  
  }

  $("#marketers input[type='checkbox']").change(function(){
    if($(this).is(":checked")) {
        $("#marketers_others").hide();
    } else {
      $("#marketers_others").show();
    }  
  });

  $("#approvers input[type='checkbox']").change(function(){
    if($(this).is(":checked")) {
        $("#approvers_others").hide();
    } else {
      $("#approvers_others").show();
    }  
  });

  $("#cashiers input[type='checkbox']").change(function(){
    if($(this).is(":checked")) {
        $("#cashiers_others").hide();
    } else {
      $("#cashiers_others").show();
    }  
  });

  $("#add_marketers").click(function(){
    $("#marketers_others").append('<div class="form-group"><input style="width:80%" type="email" name="marketers_email[]" placeholder="Email" %><a onclick=remove_others_input($(this)) class="add-remove-btn v-align-action-btn" href="javascript:void(0)" >-</a></div>');
  });

  $("#add_approvers").click(function(){
    $("#approvers_others").append('<div class="form-group"><input style="width:80%" type="email" name="approvers_email[]" placeholder="Email" %><a onclick=remove_others_input($(this)) class="add-remove-btn v-align-action-btn" href="javascript:void(0)" >-</a></div>');
  });

  $("#add_cashiers").click(function(){
    $("#cashiers_others").append('<div class="form-group"><input style="width:80%" type="email" name="cashiers_email[]" placeholder="Email" %><a onclick=remove_others_input($(this)) class="add-remove-btn v-align-action-btn" href="javascript:void(0)" >-</a></div>');
  });
  

  resize_list_cotainer();
  $(".brand-web").attr("maxlength","1000");
  //$(".brand-web").maxlength();

  $("textarea").bind("update.maxlength", function(event, element, lastLength, length, maxLength, left){});

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

  $(".all_whole_numbers").on("keypress keyup blur",function (event) {
    validateWholeNumbers($(this));
  });

 $(".all_numbers").on("keypress keyup blur",function (event) {    
     validateNumbers($(this));
  });  
  
  $("#indefinite").change(function() {
    if ($(this).is(':checked')) {
      $('#end_date_calendar').addClass("datepicker_outer");
      $('#end_date_calendar .datepicker').addClass("datepicker_inner");
      $('#enddate_formated').text('Indefinite');

      $("#end_date_container").hide();
      $("#myModalLabel").text("Start Date"); 
      $("#start_date_container").show();

      formSave();
      setStartEndDates();
      $(".startdate_modal").modal('hide');
      $('#next_date').show();
      $('#prev_date').hide();
    } else {
      $('#end_date_calendar').show();
      $('#end_date_calendar').removeClass("datepicker_outer");
      $('#end_date_calendar .datepicker').removeClass("datepicker_inner");
      formSave();
      setStartEndDates();
      $('#start_date_calendar').datepicker('update', $('#start_date').val());
    }
    
  });
  if ($('#start_date_calendar').length) {
    $('#start_date_calendar').datepicker({
      format: 'yyyy-mm-dd'
    });  
  }
  
  if ($('#end_date_calendar').length) {
    $('#end_date_calendar').datepicker({
      format: 'yyyy-mm-dd'
    });  
  }   

  setStartEndDates();
  setDates();

  $('#start_date_calendar').datepicker().on('changeDate', function (e) {
    date1 = change_formate(e);
    $('#start_date').val(date1);
    $('#startdate_formated').text(date1+' - ');
    $('#end_date_calendar').datepicker('setStartDate', date1); 
    $('#end_date_calendar').datepicker('update', $('#end_date').val());
    formSave();
    $("#start_date_container").hide();
    $("#myModalLabel").text("End Date");
    $("#end_date_container").show();
    $('#next_date').hide();
    $('#prev_date').show();
  });

  $('#end_date_calendar').datepicker().on('changeDate', function (e) {
    date2 = change_formate(e);
    $('#end_date').val(date2);
    $('#enddate_formated').text(date2);
    $('#start_date_calendar').datepicker('setEndDate', date2);
    $('#start_date_calendar').datepicker('update', $('#start_date').val());
    formSave();
    $("#end_date_container").hide();
    $("#myModalLabel").text("Start Date"); 
    $("#start_date_container").show();
    $(".startdate_modal").modal('hide');
    $('#next_date').show();
    $('#prev_date').hide();
  });

  if ($("#indefinite").length) {
    if ($("#indefinite").is(':checked')) {
      $('#end_date_calendar').addClass("datepicker_outer");
      $('#end_date_calendar .datepicker').addClass("datepicker_inner");
    } else {
      $('#end_date_calendar').show();
    }  
  }
    

  function formSave(){
    if (active_form == "Brand") {
      form_brand_save();
    } else if (active_form == "Product") {
      form_product_save();
    } else if (active_form == "Reward") {
      form_reward_save();
    } else if (active_form == "Campaign") {
      form_campaign_save();
    } else if (active_form == "Advertisement") {
      form_advertisement_save();
    }
    
    if ($("#indefinite").is(':checked')) {
      $('#start_date_calendar').datepicker('setEndDate',false);
    }
  }

    
    
  $('.dropdown-toggle').dropdown();
  // shipping products tabs
  $('#shipping-tabs a:first').tab('show');

  // shipping products tabs
  $('#brands-tabs a:first').tab('show');

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var target = $(e.target).attr("href");
      if ((target == '#brand-products-tab')) {
          get_brand_products_list();
      } else if ((target == '#brand-stores-tab')){
          get_brand_stores_list();
      }
  });

  if ($('.carousel').length) {
    if ($('.carousel .carousel-inner figure').length) {
      $('.carousel').carousel({interval: 2000});
    }
  }

  if($("#user_contact").length){
    if($("#user_contact")[0].checked){
      $("#contact-mockup input").attr('disabled','disabled');
      $("#contact-mockup .help-inline").hide();
    } else {
      $("#contact-mockup input").removeAttr('disabled');
      $("#contact-mockup .help-inline").show();
    }
  }

  $("#user_contact").change(function(){
    if($(this)[0].checked){
      $("#contact-mockup input").attr('disabled','disabled');
      $("#contact-mockup .help-inline").hide();
    } else {
      $("#contact-mockup input").removeAttr('disabled');
      $("#contact-mockup .help-inline").show();
    }
  });

  $("#startdate_formated").click(function(){
    $(".enddate_modal").modal('hide');
    $(".startdate_modal").modal('show');
  });

  if ($("#add-domestic-shippings").length) {
    $("#add-domestic-shippings").click(function(){add_domestic_shippings();});
  }
  if ($("#add-international-shippings").length) {
    $("#add-international-shippings").click(function(){add_international_shippings();});
  }

});

$(document).on("focus", "[data-provider~='datepicker']", function(e){
  $(this).datepicker({"format": "yyyy-mm-dd", "weekStart": 1, "autoclose": true})
});

function show() {
  action = $('#action').val();
  window.location.href="?status="+action;
  reload_script();
}
function change_formate(date){
  return date.format('yyyy-mm-dd');
}

function setStartEndDates(){
  if(!$("#indefinite").is(':checked')){$('#start_date_calendar').datepicker('setEndDate', $('#end_date').val());}
  $('#end_date_calendar').datepicker('setStartDate', $('#start_date').val()); 
}

function setDates(){
  $('#start_date_calendar').datepicker('setDate', [$('#start_date').val()]); 
  $('#end_date_calendar').datepicker('setDate', [$('#end_date').val()]);
}

$(document).on("focus", "[data-behaviour~='datepicker']", function(e) {
  -$(this).datepicker;
  -({
    format: "dd-mm-yyyy"
  });
  -({
    weekStart: 1
  });
  return -{
    autoclose: true
  };
});

add_domestic_shippings = function() {
  $.get("/shippings/new",
    {id: product_id, type: "Product", sub_type: "domestic"},
    function(data) {
      // $("#domestic-shippings-container").empty();
      $("#domestic-shippings-container").append(data.html);
    }
  );
}

add_international_shippings = function() {
  $.get("/shippings/new",
    {id: product_id, type: "Product", sub_type: "international"},
    function(data) {
      // $("#international-shippings-container").empty();
      $("#international-shippings-container").append(data.html);
    }
  );
}

form_shipping_save = function(id) {
  if (id) {
    $.ajax({
      type: "PUT",
      url: "/shippings/" + id,
      data: $("#edit_shipping_" + id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};
$(window).resize(function(){
  resize_list_cotainer();
});

function resize_list_cotainer(){
  var win_height = ($(window).outerHeight()/1.19)-40;
  $(".customer-list").height(win_height);
}

function validateWholeNumbers(obj){
  $(obj).val($(obj).val().replace(/[^0-9\.]/g,''));
  if ((event.which != 46 || $(obj).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
  }
}

function validateNumbers(obj){
  $(obj).val($(obj).val().replace(/[^\d].+/, ""));
  if ((event.which < 48 || event.which > 57)) {
      event.preventDefault();
  }
}

function formDisabled(){
  $("a.destroy-img").hide();
  //$("a").hide();
  $("input,textarea,select,button").attr("disabled",true);
  $(".preview").attr("disabled",false);  
}

function remove_others_input(obj){
  obj.parents(".form-group").remove();
}

// hide_show_table_cell = function(table_container, total_cells, cell_no, action) {
//   tbl = document.getElementById(table_container);//$("#membership-container table");
//   for (var i = 0; i < tbl.rows.length; i++) {
//     if (tbl.rows[i].cells.length == total_cells) {
//       if (action == "hide") {
//         tbl.rows[i].cells[cell_no - 1].style.display = "none";
//       } else {
//         tbl.rows[i].cells[cell_no - 1].style.display = "";
//       }
//     } else {
//       if (action == "hide") {
//         tbl.rows[i].cells[cell_no - 3].style.display = "none";
//       } else {
//         tbl.rows[i].cells[cell_no - 3].style.display = "";
//       }
//     }
//   }
// }
