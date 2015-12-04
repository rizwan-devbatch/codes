$('td#<%= params[:type_id]%>').html('<%= escape_javascript(render :partial => "new_product_property") %>');
