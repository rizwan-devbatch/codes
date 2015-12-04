$( document ).ready(function() {
  multiple_term_form = $("#term-form-container");
 // console.log('sss');
 // console.log(multiple_term_form);
// alert(multiple_term_form)

  term_wrapper = multiple_term_form.find(".progress-wrapper");
  progress_bar = term_wrapper.find(".progress-bar");
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
      types = /(\.|\/)(pdf|docx|doc|PDF|DOCX|DOC)$/i;
      file = data.files[0];
      if (types.test(file.type) || types.test(file.name)) {
        data.submit();
      } else {
        alert(file.name + " must be PDF, DOCX, DOC file");
      }
    }
  });
});