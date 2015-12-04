class Users::RegistrationsController < Devise::RegistrationsController
  layout "public"
  def create
    # return render :json => params
    build_resource(sign_up_params)
    if resource.save
      resource.add_role "brandmanager"
      # resource.add_role "marketer"
      # resource.add_role "approver"

      currency = Currency.find_by(unit: 'USD')
      company = Company.create(
        user_id: resource.id,
        name: resource.full_name,
        currency_id: currency.id,
        country: resource.country,
        state: resource.state,
        city: resource.city,
        address_1: resource.address_1,
        address_2: resource.address_2,
        phone_no: resource.phone_no
      )

      resource.company_id = company.id
      resource.brand_manager = true
      resource.marketer = true
      resource.approver = true
      resource.cashier = true
      resource.save

      resource.companies << company

      UserMailer.registration_confirmation(resource).deliver
      if resource.contact == 'no'
        UserMailer.registration_confirmation_contact(resource).deliver
      end
        UserMailer.notify_admin(resource).deliver
      flash[:notice] = 'Registration has been successfully done.'

      # TODO should be a thank you page
      redirect_to root_path
    else
      render 'new'
    end
  end

  def update
    super
  end

end