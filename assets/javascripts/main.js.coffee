# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/




$ ->
  $('select#user_country').change (event) ->
    select_wrapper = $('#user_state_code_wrapper')

    $('select', select_wrapper).attr('disabled', true)

    country_code = $(this).val()

    url = "/subregion_options?parent_region=#{country_code}"
    select_wrapper.load(url)
$ ->
  template = "<textarea name='domestic_shippings[destination][INDEX]'></textarea>"
  index = $('textarea').length
  $('#js-add-question-row').click ->
    compiled_textarea = $(template.replace("INDEX", index))
    $('#domestic_shippings').append(compiled_textarea)
    index = index + 1
