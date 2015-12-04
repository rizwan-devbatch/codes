class UserMailer < ActionMailer::Base
  default from: "Street@nutonia.com"
  helper :application

  def notify_admin(resource)
    @resource = resource
    mail(:to => 'Street@nutonia.com', :subject => " Registration Notification")

  end

  def registration_confirmation(resource)
    @resource = resource
    mail(:to => resource.email, :subject => "Registered")
  end

  def registration_confirmation_contact(resource)
    @resource = resource
    mail(:to => resource.contact_email, :subject => "contact_Registered")
  end

  def user_approved(user)
    @user = user
    mail(:to => user.email, :subject =>  'Account Approval')
  end
  def send_brand_approval(approver,brand)
  
    @user = approver
    @brand = brand
    mail(:to => @user.email, :subject =>  'Brand Approval')
  end
  def brand_return(current_user, message)
    @user = current_user
    @message = message
    mail(:to => @user.email, :subject =>  'Brand Returned')
  end
  def send_brand_approve(user, brand)
    @user = user
    @brand = brand
    mail(:to => @user.email, :subject =>  'Brand Approved')
  end
  def send_product_approval(current_user,product)
    @user = current_user
    @product = product
    mail(:to => @user.email, :subject =>  'Product Approval')
  end
  def send_product_return(current_user, message)
    @user = current_user
    @message = message
    mail(:to => @user.email, :subject =>  'Product Return')
  end
  def send_product_approve(current_user,product)
    @user = current_user
    @product = product
    mail(:to => @user.email, :subject =>  'Product Approved')
  end
  def send_product_group_approval(current_user)
    @user = current_user
    mail(:to => @user.email, :subject =>  'Product Group Approval')
  end
  def send_product_group_return(current_user, message)
    @user = current_user
    @message = message
    mail(:to => @user.email, :subject =>  'Product Group Return')
  end
  def send_product_group_approve(current_user)
    @user = current_user
    mail(:to => @user.email, :subject =>  'Product Group Approved')
  end
  def send_store_approval(current_user,store)
    @user = current_user
    @store = store
    mail(:to => @user.email, :subject =>  'Store Approval')
  end
  def send_store_return(current_user, message)
    @user = current_user
    @message = message
    mail(:to => @user.email, :subject =>  'Store Returned')
  end
  def send_store_approve(current_user, store)
    @user = current_user
    @store = store
    mail(:to => @user.email, :subject =>  'Store Approved')
  end
  def send_reward_approval(current_user,reward)
    @user = current_user
    @reward = reward
    mail(:to => @user.email, :subject =>  'Reward Approval')
  end
  def reward_approve(current_user,reward)
    @user = current_user
    @reward = reward
    mail(:to => @user.email, :subject =>  'Reward Approved')
  end
  def reward_return(current_user)
    @user = current_user
    mail(:to => @user.email, :subject =>  'Reward Return')
  end
  def send_advertisement_approval(approver,advertisement)
  
    @user = approver
    @advertisement = advertisement
    mail(:to => @user.email, :subject =>  'Advertisement Approval')
  end
  def advertisement_return(current_user, message)
    @user = current_user
    @message = message
    mail(:to => @user.email, :subject =>  'Advertisement Returned')
  end
  def send_advertisement_approve(user, advertisement)
    @user = user
    @advertisement = advertisement
    mail(:to => @user.email, :subject =>  'Advertisement Approved')
  end  
  def new_marketer(user,password,current_user)
    @user = user
    @password = password
    @current_user = current_user
    mail(:to => @user.email, :subject =>  current_user.full_name+ ' has appointed you as a Marketer')
  end
  def new_approver(user,password,current_user)
    @user = user
    @password = password
    @current_user = current_user
    mail(:to => @user.email, :subject =>  current_user.full_name+ ' has appointed you as an Approver')
  end
  def new_cashier(user,password,current_user)
    @user = user
    @password = password
    @current_user = current_user
    mail(:to => @user.email, :subject =>  current_user.full_name+ ' has appointed you as a Cashier')
  end
  def send_campaign_approval(current_user,campaign)
    @user = current_user
    @campaign = campaign
    mail(:to => @user.email, :subject =>  'Campaign Approval')
  end
  def campaign_approve(current_user,campaign)
    @user = current_user
    @campaign = campaign
    mail(:to => @user.email, :subject =>  'Campaign Approved')
  end
  def campaign_return(current_user)
    @user = current_user
    mail(:to => @user.email, :subject =>  'Campaign Return')
  end
  def wallet_user_new_password(user)
    @user = user
    mail(:to => @user.email, :subject =>  'Street Forget Password')
  end
  def wallet_user_change_password(user,new_password)
    @user = user
    @new_password = new_password
    mail(:to => @user.email, :subject =>  'Street Change Password')
  end
  def street_user_order_sent(message,order)
    @message = message
    @order = order
    mail(:to => "Street@nutonia.com", :subject =>  "New Order(#{order[:id]}) Status: Pending")
    
  end
  def street_user_payment_transaction(user, message,order)
    @user = user
    @message = message
    @order = order
    mail(:to => @user.email, :subject =>  "Order(#{order[:id]}) Status: Accepted",:cc => "Street@nutonia.com")
  end
  def street_user_payment_transaction_failure(user, message,order)
    @user = user
    @message = message
    @order = order
    mail(:to => @user.email, :subject =>  "Order(#{order.id}) Status: Payment Denied",:cc => "Street@nutonia.com")
    
  end
  def street_user_order_reject(user, message,order)
    @user = user
    @message = message
    @comments = order.comments
    mail(:to => @user.email, :subject =>  "Order(#{order.id}) Status: Rejected",:cc => "Street@nutonia.com")
  end
  def street_user_order_deliver(user, message,order)
    @user = user
    @message = message
    mail(:to => @user.email, :subject =>  "Order(#{order.id}) Status: Out for Delivery",:cc => "Street@nutonia.com")
    
  end
end
