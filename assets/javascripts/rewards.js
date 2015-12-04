$( document ).ready(function() {
  if ($("#rewards-list").length) {
    $(window).load(function(){
      get_campaigns_list("compaigns");
    });
  }

  $("select#reward_country").change(function(event) {
    var country_code, select_reward_wrapper, url;
    select_reward_wrapper = $("#reward_state_code_wrapper");
    //$("select", select_reward_wrapper).attr("disabled", true);
    country_code = $(this).val();
    url = "/rewards/subregion_options?parent_region=" + country_code;
    return select_reward_wrapper.load(url);
  });

  $("#reward_title, #reward_description").blur(function() {
    form_reward_save();
  });
  $("#reward_credit_type_point, #reward_credit_type_stamp, #reward_credit_type_discount").change(function() {
    form_reward_save();
    $.ajax({
      type: "GET",
      url: "/membership_points/" + reward_id + "/refresh",
      success: function (data) {
        eval(data);
        $("#rewards-tabs li").removeClass("active");
        $("#rewards-tabs li:first").addClass("active");
      }
    });
  });
  
  multiple_images_form = $("#reward-images-form");
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
   


  // if ($("#rewards-listing-all").length) {
  //   $("#rewards-listing-all").click(function(){get_rewards_list("all");});
  // }
  if ($("#rewards-listing-compaigns").length) {
    $("#rewards-listing-compaigns").click(function(){
      reward_search_type = "approved_campaigns";
      get_campaigns_list("compaigns");
    });

  }
  if ($("#rewards-listing-advertisement").length) {
    $("#rewards-listing-advertisement").click(function(){
      get_advertisements_list("advertisements");
      reward_search_type = "approved_advertisements";
    });
  }
  if ($("#rewards-listing-loyalty").length) {
    $("#rewards-listing-loyalty").click(function(){
      get_rewards_list("loyalty");
      reward_search_type = "approved_loyality";
    });
  }


  if ($("#unpublish_campaign_listings").length) {
    $("#unpublish_campaign_listings").click(function(){
      get_campaigns_list("unpublish_campaigns");
      reward_search_type = "pending_campaigns";
    });
  }
  if ($("#unpublish_advertisement_listings").length) {
    $("#unpublish_advertisement_listings").click(function(){
      get_advertisements_list("unpublish_advertisements");
      reward_search_type = "pending_advertisements";
    });
  }
  if ($("#rewards-listing-unpublish").length) {
    $("#rewards-listing-unpublish").click(function(){
      get_rewards_list("unpublish");
      reward_search_type = "pending_rewards";
  });
  }
  $("#rewards-search-form > #search_field").keypress(function(e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        if (reward_search_type == "approved_campaigns") {
          get_campaigns_list("compaigns", "search", $(this).val());
        } else if (reward_search_type == "approved_advertisements") {
          get_advertisements_list("advertisements","search", $(this).val());
        } else if (reward_search_type == "approved_loyality") {
          get_rewards_list("loyalty","search", $(this).val());
        } else if (reward_search_type == "pending_advertisements") {
          get_advertisements_list("unpublish_advertisements","search", $(this).val());
        } else if (reward_search_type == "pending_rewards") {
          get_rewards_list("unpublish_loyalty","search", $(this).val());
        } else if (reward_search_type == "pending_campaigns") {
          get_campaigns_list("unpublish_campaigns","search", $(this).val());
        } 
      }
  });
  


  $("#rewards-tabs a").click(function (e) {
    e.preventDefault();
    if ($(this).attr("id") == "rewards-tabs-type" || $(this).attr("id") == "rewards-tabs-earning" || $(this).attr("id") == "rewards-tabs-burning") {
      if ($("#membership-container").not(":visible")) {
        $("#membership-container").show();
      }
      if ($("#terms").is(":visible")) {
        $("#terms").hide();
      }
      if ($(this).attr("id") == "rewards-tabs-type") {
        $("#rewards-membership-container-table .cell2").show();
        $("#rewards-membership-container-table .cell4").show();
        $("#rewards-membership-container-table .cell5").show();
        $("#rewards-membership-container-table .cell6").hide();
        $("#rewards-membership-container-table .cell7").hide();
      } else if ($(this).attr("id") == "rewards-tabs-earning") {
        $("#rewards-membership-container-table .cell2").hide();
        $("#rewards-membership-container-table .cell4").hide();
        $("#rewards-membership-container-table .cell5").hide();
        $("#rewards-membership-container-table .cell6").show();
        $("#rewards-membership-container-table .cell7").hide();
      } else if ($(this).attr("id") == "rewards-tabs-burning") {
        $("#rewards-membership-container-table .cell2").hide();
        $("#rewards-membership-container-table .cell4").hide();
        $("#rewards-membership-container-table .cell5").hide();
        $("#rewards-membership-container-table .cell6").hide();
        $("#rewards-membership-container-table .cell7").show();
      }
    } else {
      if ($("#membership-container").is(":visible")) {
        $("#membership-container").hide();
      }
      if ($("#terms").not(":visible")) {
        $("#terms").show();
      }
    }
  })
});

form_reward_new = function() {
  $("#form-new-rewards-modal").modal("show");
  $.ajax({
    type: "GET",
    url: "/rewards/new",
    success: function (data) {
      $("#form-new-rewards-modal-body").empty();
      $("#form-new-rewards-modal-body").append(data.html);
    }
  });
};

form_reward_save = function() {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: "/rewards/" + reward_id,
      data: $("#edit_reward_" + reward_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

form_reward_equals_save = function() {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: "/rewards/" + reward_id,
      data: $("#edit_reward_equals_" + reward_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

form_reward_spent_minimum_amount_save = function() {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: "/rewards/" + reward_id,
      data: $("#edit_reward_spent_minimum_amount_" + reward_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};

get_rewards_list = function(type, search, search_value) {
  $.get("/rewards/index_ajax",
    {type: type, search: search, search_value: search_value},
    function(data) {
      $("#rewards-list").empty();
      $("#rewards-list").append(data.html);
    }
  );
};



form_reward_membership_save = function(membership_id) {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: $("#edit_reward_membership_" + membership_id).attr("action"),
      data: $("#edit_reward_membership_" + membership_id).serialize(),
      dataType: "json",
      format: "js"
    });
  }
};
form_membership_point_save = function(point_id, type) {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: $("#edit_membership_point_" + type + "_" + point_id).attr("action"),
      data: $("#edit_membership_point_" + type + "_" + point_id).serialize(),
    });
  }
};
form_reward_membership_advertisement_save = function(membership_id, type) {
  if (reward_id) {
    $.ajax({
      type: "POST",
      url: $("#edit_reward_membership_" + type + "_" + membership_id).attr("action"),
      data: $("#edit_reward_membership_" + type + "_" + membership_id).serialize(),
    });
  }
};

 