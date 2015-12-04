$( document ).ready(function() {
  $("#product-group-brands").click(function(event) {
    $("#product-group-brands-modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/products/" + product_id + "/brands",
      success: function (data) {
        $("#product-group-brands-modal-body").empty();
        $("#product-group-brands-modal-body").append(data.html);
      }
    });
  });
  $("#product-group-brands-done").click(function(event) {
    products_brands_done();
  });
  $("#product-group-brands-products-done").click(function(event) {
    products_brands_products_done();
  });
  $("#product-group-product-list-done").click(function(event) {
    products_product_list_done();
  });
});

products_brands_done = function() {
  $.ajax({
    type: "POST",
    url: "/products/" + product_id + "/brands_update",
    data: $("#form-product-group-brands").serialize(),
    success: function (data) {
      $("#product-group-brands-container").html(data);
      $("#product-group-brands-modal").modal("hide");
    }
  });
}

products_brands_products_done = function() {
  $.ajax({
    type: "POST",
    url: "/products/" + product_id + "/" + products_brand_id + "/products_update",
    data: $("#form-product-group-products").serialize(),
    success: function (data) {
      $("#product-group-brands-products-modal").modal("hide");

      if ($('input[name="products_brand[options]"]:checked').val() == "list") {

        call_product_product_list(products_brand_id);
      } else {
        $("#product-group-brands-container").html(data);
      }
    }
  });
}

call_product_product_list = function(product_groups_brand_id) {
  $("#product-group-product-list-modal").modal("show");
  $.ajax({
    type: "GET",
    url: "/products/" + product_id + "/" + products_brand_id + "/product_list",
    success: function (data) {
      $("#product-group-product-list-container").empty();
      $("#product-group-product-list-container").append(data.html);
    }
  });
}

products_product_list_done = function() {
  $.ajax({
    type: "POST",
    url: "/products/" + product_id + "/" + products_brand_id + "/product_list_update",
    data: $("#form-product-group-product-list").serialize(),
    success: function (data) {
      $("#product-group-brands-container").html(data);
      $("#product-group-product-list-modal").modal("hide");
    }
  });
}