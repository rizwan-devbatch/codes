$( document ).ready(function() {
  $("#brand-group-brands").click(function(event) {
    $("#brand-group-brands-modal").modal("show");
    $.ajax({
      type: "GET",
      url: "/brands/" + brand_id + "/brands",
      success: function (data) {
        $("#brand-group-brands-modal-body").empty();
        $("#brand-group-brands-modal-body").append(data.html);
      }
    });
  });
  $("#brand-group-brands-done").click(function(event) {
    brands_brands_done();
  });
});

brands_brands_done = function() {
  $.ajax({
    type: "POST",
    url: "/brands/" + brand_id + "/brands_update",
    data: $("#form-brand-group-brands").serialize(),
    success: function (data) {
      $("#brand-brands-container").html(data);
      $("#brand-group-brands-modal").modal("hide");
    }
  });
}