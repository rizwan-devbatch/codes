$( document ).ready(function() {
  multiple_logo_form = $("#import-csv-form");
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
      types = /(\.|\/)(csv|doc|docx|xls|xlsx|pdf)$/i;
      file = data.files[0];
      if (types.test(file.type) || types.test(file.name)) {
        data.submit();
      } else {
        alert(file.name + " must be DOC, XLS or PDF file");
      }
    }
  });
});