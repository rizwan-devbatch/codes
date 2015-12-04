class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  skip_before_filter :verify_authenticity_token, :if => Proc.new { |c| c.request.format == 'application/json' }
  before_filter :update_sanitized_params, if: :devise_controller?
  layout :layout_by_resource
  require 'csv'

  before_filter do
    resource = controller_name.singularize.to_sym
    method = "#{resource}_params"
    params[resource] &&= send(method) if respond_to?(method, true)
  end

  def after_sign_in_path_for(resource)

    if !current_user.company.currency.nil?
      session[:currency_unit] = current_user.company.currency.unit 
    else
      currency = Currency.find_by(unit: 'USD')
      if !currency.nil?
        session[:currency_unit] = currency.unit 
      else
        session[:currency_unit] = 'GBP' 
      end
      
    end
    dashboard_index_path
  end

  def set_user
    @user = current_user
  end  
  
  def update_sanitized_params
    devise_parameter_sanitizer.for(:sign_up) {|u| u.permit(:full_name, :email, :phone_no, :country, :state, :city, :address_1, :address_2, :pobox, :contact, :contact_full_name, :contact_email, :contact_phone_no)}
  end

  rescue_from CanCan::AccessDenied do |exception|  
    flash[:error] = "Access denied!"  
    redirect_to root_url  
  end

protected

  def layout_by_resource
    if devise_controller? 
      "public"
    end
  end

  def base_url
    if Rails.env.development?
      "http://localhost:3000"
    else
      "http://nutonia.herokuapp.com"
    end
  end

  def mailer_set_url_options
    ActionMailer::Base.default_url_options[:host] = request.base_url
  end
 
end