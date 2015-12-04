$(document).ready(function() {
    $( "#slider-vertical" ).slider({
      orientation: "vertical",
      range: "min",
      min: 1,
      max: 4,
      value: 4,
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
    });
    //$( "#amount" ).val( $( "#slider-vertical" ).slider( "value" ) );
    $('.slider_values div').click(function(){
    	value = $(this).attr('data-value');
    	if (value == 0) {
    		$('.ui-slider-range').css('height','0%');
    		$('.ui-slider-handle').css('bottom','0%');
    	} else if(value == 1) {
    		$('.ui-slider-range').css('height','33.3333333333333%');
    		$('.ui-slider-handle').css('bottom','33.3333333333333%');
    	} else if(value == 2) {
    		$('.ui-slider-range').css('height','66.6666666666667%');
    		$('.ui-slider-handle').css('bottom','66.6666666666667%');
    	} else{
    		$('.ui-slider-range').css('height','100%');
    		$('.ui-slider-handle').css('bottom','100%');
    		$('#custome-date-range-modal').modal('show');
    	}
    });

    if ($('#perf_start').length) {
	    $('#perf_start').datepicker({
	      format: 'yyyy-mm-dd',
	      daysOfWeekDisabled: [0]
	    });  
  	}
	  
  	if ($('#perf_end').length) {
	    $('#perf_end').datepicker({
	      format: 'yyyy-mm-dd',
	      daysOfWeekDisabled: [0]
	    });  
  	}

    $('#perf_start').datepicker().on('changeDate', function (e) {
	    from = change_formate(e);
	    $('#start_date').val(from);
	    $('#perf_end').datepicker('setStartDate', from); 
	    $('#perf_end').datepicker('update', $('#end_date').val());
  	});

  	$('#perf_end').datepicker().on('changeDate', function (e) {
	    till = change_formate(e);
	    $('#end_date').val(till);
	    $('#perf_start').datepicker('setEndDate', till);
	    $('#perf_start').datepicker('update', $('#start_date').val());
  	});

  });