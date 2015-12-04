$( document ).ready(function() {
  $("#store-group-brands").click(function(event) {
    $("#store-group-brands-modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/stores/" + store_id + "/brands",
      success: function (data) {
        $("#store-group-brands-modal-body").empty();
        $("#store-group-brands-modal-body").append(data.html);
      }
    });
  });
  $("#store-group-brands-done").click(function(event) {
    stores_brands_done();
  });
  $("#store-group-brands-stores-done").click(function(event) {
    stores_brands_stores_done();
  });
  $("#store-group-store-list-done").click(function(event) {
    stores_stores_list_done();
  });
});

stores_brands_done = function() {
  $.ajax({
    type: "POST",
    url: "/stores/" + store_id + "/brands_update",
    data: $("#form-store-group-brands").serialize(),
    success: function (data) {
      $("#store-group-brands-container").html(data);
      $("#store-group-brands-modal").modal("hide");
    }
  });
}

stores_brands_stores_done = function(stores_brand_id) {
  $.ajax({
    type: "POST",
    url: "/stores/" + store_id + "/" + stores_brand_id + "/stores_update",
    data: $("#form-store-group-stores").serialize(),
    success: function (data) {
      $("#store-group-brands-stores-modal").modal("hide");

      if ($('input[name="stores_brand[options]"]:checked').val() == "list") {

        call_store_stores_list(stores_brand_id);
      } else {
        $("#store-group-brands-container").html(data);
      }
    }
  });
}

call_store_stores_list = function(store_groups_brand_id) {
  $("#store-group-store-list-modal").modal("show");
  $.ajax({
    type: "GET",
    url: "/stores/" + store_id + "/" + stores_brand_id + "/stores_list",
    success: function (data) {
      $("#store-group-store-list-container").empty();
      $("#store-group-store-list-container").append(data.html);
    }
  });
}

stores_stores_list_done = function() {
  $.ajax({
    type: "POST",
    url: "/stores/" + store_id + "/" + stores_brand_id + "/stores_list_update",
    data: $("#form-store-group-store-list").serialize(),
    success: function (data) {
      $("#store-group-brands-container").html(data);
      $("#store-group-store-list-modal").modal("hide");
    }
  });
}