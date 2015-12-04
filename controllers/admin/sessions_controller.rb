class Admin::SessionsController < Devise::SessionsController

  def create
    super
    after_sign_in_path_for(resource)
  end

  def after_sign_in_path_for(resource)
    admin_dashboard_index_path
  end
end