class UsersController < ApplicationController
    def index
    # return render :json => params
    @title = 'Users'
    if params[:status] == "approved"
      @companies = Company.approved.paginate(:page => params[:page], :per_page => 8)
    elsif params[:status] == 'rejected'
      @companies = Company.rejected.paginate(:page => params[:page], :per_page => 8)
    else
      @companies = Company.pending.paginate(:page => params[:page], :per_page => 8)
    end
  end

  def get_approved
    company = Company.find params[:id]
    company.update_attribute(:status, 'approved')
    generated_password = Devise.friendly_token.first(8)
    company.user.update_attribute(:password, generated_password)
    UserMailer.user_approved(company.user).deliver
    redirect_to users_index_path
  end

  def get_rejected
    company = Company.find params[:id]
    company.update_attribute(:status, 'rejected')
    redirect_to users_index_path
  end 

  def profile
    @title = 'Edit Profile'
  end
  def save_profile
     current_user.update(current_user_params)
     redirect_to users_tax_path
  end
  
  def tax
    @title = 'Tax'
  end 

  def tax_save
    current_user.company.update_attributes(tax: params[:company][:tax])
    redirect_to users_tax_path  
  end

  def subregion_options
    render partial: 'subregion_select'
  end

  def shipments
    @title = 'Edit Shipments'
    @shipments = current_user.company.shipments
  end 

  def account
    @title = 'Edit Account'
  end 

  def account_save
    current_user.company.update_attributes(name: params[:company][:name],name: params[:company][:name])
    redirect_to users_account_name_path  
  end

  def currencies
    @title = 'Currencies'
    @currencies = Currency.all
  end 

  def currencies_save
    current_user.company.update_attributes(currency_id: params[:company][:currency_id])
    session[:currency_unit] = current_user.company.currency.unit
    redirect_to users_currencies_path  
  end
 
  def settings
    if current_user.has_role? :brandmanager 
      @title = 'Brand Manager'
      @marketer = User.where(company_id:current_user.company_id, marketer:true).where('email !=?',current_user.email)
      @approver = User.where(company_id:current_user.company_id, approver:true).where('email !=?',current_user.email)
      @cashier = User.where(company_id:current_user.company_id, cashier:true).where('email !=?',current_user.email)
    else
      @title = 'View Profile'
    end    
  end 

  def settings_save
    if params[:user][:marketer] == "0"
      current_user.remove_role "marketer" if current_user.has_role? :marketer
      marketers_ = current_user.company.marketers      
      marketers_.each do |marketer|
        marketer.marketer = false        
        if marketer.save(validate:false)
          marketer.remove_role "marketer"
        end
      end
      params[:marketers_email].each do |m|        
        next if m.blank?          
          if User.where(email: m).first.nil?
            password = Devise.friendly_token.first(8)
            user = User.new(company_id:current_user.company_id, email: m, password: password, marketer:true)
            if user.save(validate:false)
              user.add_role "marketer"
              UserMailer.new_marketer(user,password,current_user).deliver
            end
          else
            user = User.where(email: m).first
            user.marketer = true
            if user.save(validate:false)
              user.add_role "marketer"
            end
            #flash[:notice] = "Email Already Exists" 
            # redirect_to :back 
          end
      end
    else
      current_user.add_role "marketer"
      marketers = current_user.company.marketers.where('email !=?', current_user.email)
      
      marketers.each do |u|
        #u.email += rand(5..30).to_s
        u.marketer = false
        if u.save(validate: false)
          u.remove_role "marketer"
        end 
      end
    end

    if params[:user][:approver]  == "0"
      current_user.remove_role "approver" if current_user.has_role? :approver
      approvers_ = current_user.company.approvers
      approvers_.each do |approver|
        approver.approver = false        
        if approver.save(validate:false)
          approver.remove_role "approver"
        end
      end
      params[:approvers_email].each do |m|
        next if m.blank?          
          if User.where(email: m).first.nil?
            password = Devise.friendly_token.first(8)
            user = User.new(company_id:current_user.company_id, email: m, password: password, approver:true)
            if user.save(validate:false)
              user.add_role "approver"
              UserMailer.new_approver(user,password,current_user).deliver
            end
          else
            user = User.where(email: m).first
            user.approver = true
            if user.save(validate:false)
              user.add_role "approver"
            end
            #flash[:notice] = "Email Already Exists"  
            # redirect_to :back
          end
      end
    else
      current_user.add_role "approver"
      approvers =current_user.company.approvers.where('email !=?', current_user.email)
      approvers.each do |u|
        #u.email += rand(5..30).to_s
        u.approver = false
        if u.save(validate: false)
          u.remove_role "approver"
        end
      end
    end
    if params[:user][:cashier] == "0"
      current_user.remove_role "cashier" if current_user.has_role? :cashier
      cashiers_ = current_user.company.cashiers
      cashiers_.each do |cashier|
        cashier.cashier = false        
        if cashier.save(validate:false)
          cashier.remove_role "cashier"
        end
      end
      params[:cashiers_email].each do |m|
        next if m.blank?          
          if User.where(email: m).first.nil?
            password = Devise.friendly_token.first(8)
            user = User.new(company_id:current_user.company_id, email: m, password: password, cashier:true)
            if user.save(validate:false)
              user.add_role "cashier"
              UserMailer.new_cashier(user,password,current_user).deliver
            end
          else
            user = User.where(email: m).first
            user.cashier = true
            if user.save(validate:false)
              user.add_role "cashier"
            end
            #flash[:notice] = "Email Already Exists" 
            # redirect_to :back 
          end
      end
    else
      current_user.add_role "cashier"
      cashiers = current_user.company.cashiers.where('email !=?',current_user.email)
      cashiers.each do |u|
        #u.email += rand(5..30).to_s
        u.cashier = false
        if u.save(validate: false)
          u.remove_role "cashier"
        end
      end
    end    
    current_user.update_attributes(marketer: params[:user][:marketer], approver:params[:user][:approver], cashier:params[:user][:cashier])
    flash[:notice] = "Settings are updated successfully"
    redirect_to users_settings_path
  end
  private

  def current_user_params    
    params.require(:user).permit(:full_name, :email, :country, :state, :city, :pobox, :phone_no, :address_1, :address_2, :contact, :contact_full_name, :contact_email, :contact_phone_no)
  end

end