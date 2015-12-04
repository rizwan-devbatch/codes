$( document ).ready(function() {
  $("#customer-group-customers").click(function(event) {
    $("#customer-group-customers-modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/customers/" + customer_id + "/customers",
      success: function (data) {
        $("#customer-group-customers-modal-body").empty();
        $("#customer-group-customers-modal-body").append(data.html);
      }
    });
  });
  $("#customer-group-customers-done").click(function(event) {
    customers_customers_done();
  });

  $("input[name='customer[state]']").change(function(){
    
    var id = $(this).attr("id");
    
    if(id == "customer_state_twitter"){
      $('.active').removeClass('active');
      $('a[href="#twitter"]').parents('li').addClass('active');
      $('.tab-content').find('#twitter').addClass('active');
    } else if(id == "customer_state_facebook"){
      $('.active').removeClass('active');
      $('a[href="#facebook"]').parents('li').addClass('active');
      $('.tab-content').find('#facebook').addClass('active');
    } else if(id == "customer_state_filter"){
      $('.active').removeClass('active');
      $('a[href="#filter"]').parents('li').addClass('active');
      $('.tab-content').find('#filter').addClass('active');
    } else if(id == "customer_state_manually"){
      $('.active').removeClass('active');
      $('a[href="#filter"]').parents('li').addClass('active');
      $('.tab-content').find('#filter').addClass('active');
      $('a[href="#create-manually"]').parents('li').addClass('active');
      $('.tab-content').find('#create-manually').addClass('active');
    } else if(id == "customer_state_csv"){
      $('.active').removeClass('active');
      $('a[href="#filter"]').parents('li').addClass('active');
      $('.tab-content').find('#filter').addClass('active');
      $('a[href="#create-from-csv"]').parents('li').addClass('active');
      $('.tab-content').find('#create-from-csv').addClass('active');
    }
  });

});



customers_customers_done = function() {
  $.ajax({
    type: "POST",
    url: "/customers/" + customer_id + "/customers_update",
    data: $("#form-customer-group-customers").serialize(),
    success: function (data) {
      $("#customer-customers-container").html(data);
      $("#customer-group-customers-modal").modal("hide");
    }
  });
}
