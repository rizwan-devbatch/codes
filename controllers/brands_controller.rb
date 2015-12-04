class BrandsController < ApplicationController
    before_filter :authenticate_user!, :set_user
	# load_and_authorize_resource
	before_action :set_brand, only: [
		:edit,
		:update,
		:destroy,
		:show,
		:performance,
		:logo,
		:logo_destroy,
		:images,
		:images_destroy,
		:slider,
		:brands,
		:brands_update,
		:send_approval,
		:products_ajax,
		:stores_ajax,
		:approve,
		:return,
		:currency,
		:currency_save,
		:accounts,
		:accounts_update
	]
    #helper :application
	def index
	   if current_user.company.brands.count > 1	
    	 @title = "Your Suppliers"
       else	
       	 @title = "Your Supplier"
       end	 
    end

    def index_ajax
		if current_user.has_role? :admin	
       		if !params[:type].nil? && params[:type] == 'search'
	    		brands = Brand.where("LOWER(title) LIKE ?", "%#{params[:search].downcase}%").paginate(:page => params[:page], :per_page => 12)
	    	elsif !params[:type].nil? && params[:type] == 'unpublish'
	    		brands = Brand.where(status_caption: 'pending').paginate(:page => params[:page], :per_page => 12)
	    	else 
	    		brands = Brand.all.paginate(:page => params[:page], :per_page => 12)
	    	end		
	    else 		
	    	if !params[:type].nil? && params[:type] == 'search'
	    		brands = current_user.company.brands.where("LOWER(title) LIKE ?", "%#{params[:search].downcase}%").paginate(:page => params[:page], :per_page => 12)
	    	elsif !params[:type].nil? && params[:type] == 'own'
	    		brands = current_user.company.own_brands.all.paginate(:page => params[:page], :per_page => 12)
	    	elsif !params[:type].nil? && params[:type] == 'partner'
	    		brands = current_user.company.partner_brands.all.paginate(:page => params[:page], :per_page => 12)
	    	elsif !params[:type].nil? && params[:type] == 'unpublish'
	    		brands = current_user.company.unpublish_brands.all.paginate(:page => params[:page], :per_page => 12)
			else
	  			brands = current_user.company.brands.where(status_caption: ['pending', 'approved', 'sent']).paginate(:page => params[:page], :per_page => 12)
	  		end
	  	end	
		render :json => {
			:html => render_to_string({
				:partial => "index_ajax",
				:locals => {:brands => brands}
			})
		}
	end

	def create
		set_error_hash
	    if params[:brand][:title].blank?
	    	@errors[:title] = 'Title is required'
	    end

	    if @errors[:title].nil?
			@brand = current_user.company.brands.new(brand_params)
			@brand.user_id = current_user.id
			@brand.save
	    end
	end

	def edit
		@title = " Add a New Supplier"
		@terms = current_user.company.terms.all
		@suppliers_accounts = @brand.sub_companies
	end

	def update
        respond_to do |format|
	    	if @brand.update(brand_params)
		        format.html { redirect_to @brand }
		        format.js { head :no_content }
	    	else
		        format.html { render action: 'edit' }
		        format.json { render json: @brand.errors, status: :unprocessable_entity }
	    	end
	    end
	end

	def destroy 
	    @brand.destroy
	    respond_to do |format|
	      format.html { redirect_to brands_url }
	      format.json { head :no_content }
	    end
	end

	def show
		if current_user.has_role? :brandmanager or current_user.approver == true
	        if @brand.brand_type == 'single'
				@title = "Supplier for Approval"
			else  
				@title = "Supplier Group for Approval"
				@brand_groups = @brand.brands
			end 
		else	 		 
			if @brand.brand_type == "single"
		        @title = "Supplier Preview"
		    else	
		        @title = "Supplier Group Preview"
				@brand_groups = @brand.brands	
		    end 
		end         		
    end

	def logo
	    respond_to do |format|
			@logo = @brand.logo.new(image_params)
	      	@logo.save
			format.html { redirect_to new_logo_path }
			format.js
	    end
	end

	def logo_destroy
		respond_to do |format|
			@brand.logo.find(params[:image_id]).destroy()
			format.html { redirect_to edit_brand_path(@brand) }
			format.js
	  end
	end

	def images
	    respond_to do |format|
			@image = @brand.images.new(image_params)
	      	@image.save
	      	@images_count = @brand.images.count
			format.html { redirect_to new_image_path }
			format.js
	    end
	end

	def images_destroy
		respond_to do |format|
			@brand.images.find(params[:image_id]).destroy()
			format.html { redirect_to edit_brand_path(@brand) }
			format.js
	    end
	end

	def brands
		render :json => {
			:html => render_to_string({
				:partial => "brands",
				:locals => {:brands => current_user.company.brands, :brand_groups => @brand.brands}
			})
		}
	end

	def accounts
		render :json => {
			:html => render_to_string({
				:partial => "accounts",
				:locals => {:accounts => current_user.company.sub_companies, :supplier_accounts => @brand.suppliers_accounts}
			})
		}
	end

	def accounts_update
		SuppliersAccount.delete_all(:brand_id => @brand.id)

		params[:accounts].each do |b_id|
			suppliers_accounts = @brand.suppliers_accounts.new(sub_company_id: b_id)
			suppliers_accounts.save
		end
		@suppliers_accounts = @brand.sub_companies
		render partial: 'accounts_list'
	end

	def brands_update
		BrandGroup.delete_all(:brand_a_id => @brand.id)

		params[:brands].each do |b_id|
			brand_groups = @brand.brand_groups.new(brand_b_id: b_id)
			brand_groups.save
		end
		@brand_groups = @brand.brands
		render partial: 'brands_list'
	end

	def send_approval
	    @brand.update_attribute(:status_caption, 'sent')
	    @brand.update_attribute(:sender_name, current_user.company.name)
	    @approvers=User.where(:company_id => current_user.company_id, :approver => true)
	    @approvers.each do |approver|
	    	UserMailer.send_brand_approval(approver,@brand).deliver
	    end
	    flash[:notice] = "You have successfully sent this Supplier for approval!"
	    redirect_to :back
    end

	def products_ajax
		render :json => {
			:html => render_to_string({
				:partial => "products_ajax",
				:locals => {:products => @brand.products}
			})
		}
	end

	def stores_ajax
		render :json => {
			:html => render_to_string({
				:partial => "stores_ajax",
				:locals => {:stores => @brand.stores}
			})
		}
	end

	def approve
	    @brand.update_attribute(:status_caption, 'approved')
	    @users =User.where(:company_id => current_user.company_id)
	    @users.each do |user|
		    if user.has_role? :brandmanager
		    	@brand.notifications.create(:user_id => user.id,:message => "has been approved by "+user.full_name,:company_id => user.company_id)
		       UserMailer.send_brand_approve(user,@brand).deliver
		    end
		end
	    flash[:notice] = "You have successfully approved this Supplier!"
	    redirect_to :back
    end
    
	def return
	    @brand.update_attribute(:status_caption, 'returned')
	    UserMailer.brand_return(current_user, params[:message]).deliver
	    flash[:notice] = "You have successfully returned this Supplier!"
	    redirect_to :back	    
    end

	def subregion_options
		render partial: 'subregion_select'
	end

    def set_error_hash
      @errors = {title: nil}
    end

  private
	def image_params
		params.require(:image).permit(:image, :title)
	end

	def set_brand
		if current_user.has_role? :admin
			@brand = Brand.where(id: params[:id]).first
		else
			@brand = Brand.where(id: params[:id], company_id: current_user.company_id).first
		end
    end

	def brand_params    
		params.require(:brand).permit(:title, :brand_type, :description, :web, :street, :street1, :street2, :city, :state, :country, :zip, :phone, :fax, :ownership, :user_id, :currency_id)
    end
end