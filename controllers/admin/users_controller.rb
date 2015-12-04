class Admin::UsersController < ApplicationController

  def index
    # return render :json => params
    if params[:status] == "approved"
      @users = User.approved.paginate(:page => params[:page], :per_page => 8)
    elsif params[:status] == 'rejected'
      @users = User.rejected.paginate(:page => params[:page], :per_page => 8)
    else
      @users = User.pending.paginate(:page => params[:page], :per_page => 8)
    end
  end

  def get_approved
    user = User.find params[:id]
    user.update_attribute(:status, 'approved')

    generated_password = Devise.friendly_token.first(8)
    user.update_attribute(:password, generated_password)
    UserMailer.user_approved(user).deliver
    redirect_to admin_users_index_path
  end

  def get_rejected
    user = User.find params[:id]
    user.update_attribute(:status, 'rejected')
    redirect_to admin_users_index_path
  end

end
