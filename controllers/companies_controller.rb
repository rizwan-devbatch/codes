class CompaniesController < ApplicationController
    before_filter :authenticate_user!, :set_user
	# load_and_authorize_resource
	before_action :set_company, only: [
		:edit,
		:update,
		:destroy,
		:logo,
		:logo_destroy,
		:images,
		:images_destroy,
		:slider,
		:product_properties_settings,
		:new_property_type,
		:product_property_type_save,
		:product_property_type_destroy,
		:new_product_property,
		:product_property_save,
		:product_property_destroy,
		:personalization_forms,
		:fee_audition_forms
	]
    #helper :application
	def index
	   @title = "Edit Your Account"
    end

	def edit
		@title = "Edit Your Account"
		@sub_companies = @company.sub_companies
	end

	def update
        respond_to do |format|
	    	if @company.update(company_params)
		        format.html { redirect_to @company }
		        format.js { head :no_content }
	    	else
		        format.html { render action: 'edit' }
		        format.json { render json: @company.errors, status: :unprocessable_entity }
	    	end
	    end
	end

	def destroy 
	    @company.destroy
	    respond_to do |format|
	      format.html { redirect_to companies_url }
	      format.json { head :no_content }
	    end
	end

	def logo
	    respond_to do |format|
			@logo = @company.logo.new(image_params)
	      	@logo.save
			format.html { redirect_to new_logo_path }
			format.js
	    end
	end

	def logo_destroy
		respond_to do |format|
			@company.logo.find(params[:image_id]).destroy()
			format.html { redirect_to edit_company_path(@company) }
			format.js
	    end
	end

	def images
	    respond_to do |format|
			@image = @company.images.new(image_params)
	      	@image.save
	      	@images_count = @company.images.count
			format.html { redirect_to new_image_path }
			format.js
	    end
	end

	def images_destroy
		respond_to do |format|
			@company.images.find(params[:image_id]).destroy()
			format.html { redirect_to edit_company_path(@company) }
			format.js
	    end
	end

	def subregion_options
		render partial: 'subregion_select'
	end
	def new_property_type
		@property_type = @company.product_property_types.new()
		@property_type.save
		@property_types = @company.product_property_types
		@product_properties = @company.product_properties
	end
	def product_properties_settings
		@title = 'Product Properties'
		@property_types = @company.product_property_types
		@product_properties = @company.product_properties
	    if current_user.has_role? :brandmanager 
	      
	    else
	      flash[:notice] = "You have no access to set product properties!"
		  redirect_to :back
	    end    
  	end
  	def property_types
		render :json => {
			:html => render_to_string({
				:partial => "property_types",
				:locals => {}
			})
		}
	end

	def product_property_type_save
	    if !params[:product_property_type][:name].blank?
	      @property_type = @company.product_property_types.find_by(:id => params[:type_id])
	      @property_type = @property_type.update(property_type_params)
	    end
 	end

 	def product_property_type_destroy
 		respond_to do |format|
			@company.product_property_types.find(params[:id]).destroy()
			@property_types = @company.product_property_types
			@product_properties = @company.product_properties
			format.html { redirect_to companies_product_properties_path }
			format.js
	    end
 	end

 	def new_product_property
 		product_property_type = @company.product_property_types.find(params[:type_id])
		product_property = product_property_type.product_properties.new()
		product_property.save
		@product_properties = product_property_type.product_properties
		@property_types = @company.product_property_types
		# render :json => {
		# 	:html => render_to_string({
		# 		:partial => "new_product_property",
		# 		:locals => {property_type_id:product_property.id}
		# 	})
		# }
	end

	def product_property_save
	    if !params[:product_property][:name].blank?
	      @product_property = @company.product_properties.find_by(:id => params[:property_id])
	      @product_property = @product_property.update(property_params)
	    end
 	end

 	def product_property_destroy
 		respond_to do |format|
			@company.product_properties.find(params[:id]).destroy()
			@product_properties = @company.product_properties
			format.html { redirect_to companies_product_properties_path }
			format.js
	    end
 	end

 	def personalization_forms
 		@title = 'Product Personalization Forms'
		@personalization_buttons = @company.personalization_buttons
 	end

 	def fee_audition_forms
 		@title = 'Fee Addition Forms'
		@fee_conditions = @company.fee_conditions
 	end

  private
	def image_params
		params.require(:image).permit(:image, :title)
	end

	def property_type_params
		params.require(:product_property_type).permit(:name)
	end

	def property_params
		params.require(:product_property).permit(:name)
	end

	def set_company
		@company = current_user.company
    end

	def company_params    
		params.require(:company).permit(:name, :address_1, :address_2, :address_3, :city, :state, :country, :zip, :phone_no, :fax)
    end
end