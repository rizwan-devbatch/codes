class Api::V1::UsersController < ApplicationController

	def index
		render :json => 'Its user index page'
	end

	def signup
		user = WalletUser.new(user_params)

		unless user.save
			render :json => {
				'status' => 0,
				'message' => user.errors.full_messages
			}
		else
			add_bonus_stamps(user.id)
			render :json => {
				'status' => 1,
				'message' => 'User has successfully been saved.',
				'results' => user
			}
		end
	end

	def signin
		user = WalletUser.authenticate(params[:user][:email], params[:user][:password])
		if user.nil?
			render :json => {
				'status' => 0,
				'message' => 'Invalid user/password'
			}
		else
			if !user.images.nil?
				image = user.images.last
				if !image.nil?
					user[:profile_picture] = Dragonfly.app.remote_url_for(image.image_uid)
				end
			end
			create_or_update_customer(user)
			render :json => {
				'status' => 1,
				'message' => 'User found.',
				'results' => user
			}
		end
	end
	
	def forget_password
		user = WalletUser.find_by_email(params[:user][:email])
		if user.nil?
			render :json => {
				'status' => 0,
				'message' => 'Invalid user'
			}
		else
			user.password = Devise.friendly_token.first(8)
			UserMailer.wallet_user_new_password(user).deliver			
			user.save
			render :json => {
				'status' => 1,
				'message' => 'User found.',
				'results' => user
			}
		end
	end
	def change_password
		user = WalletUser.authenticate(params[:user][:email], params[:user][:password])
		if user.nil?
			render :json => {
				'status' => 0,
				'message' => 'Invalid user/password'
			}
		else
			user.password = params[:new_password]			
			user.save
			UserMailer.wallet_user_change_password(user,params[:new_password]).deliver			
			render :json => {
				'status' => 1,
				'message' => 'User found.',
				'results' => user
			}
		end
	end
	def update
		user = WalletUser.find(params[:user][:id])
		customer_updated = false
		if params[:user][:password]
			valid_user = WalletUser.authenticate(params[:user][:email], params[:user][:password])
			if !valid_user.nil?
				user.password = params[:user][:new_password]
				user.email = params[:user][:email]
				user.phone = params[:user][:phone]
				user.currency_id = params[:user][:currency_id]
				user.app_pin = params[:user][:app_pin]
				if params[:image]
					image = user.images.new(image_params)
		      		image.save
		      		if !user.images.nil?
						image = user.images.last
						if !image.nil?
							user[:profile_picture] = Dragonfly.app.remote_url_for(image.image_uid)
						end
					end
				end				
				if user.save
					create_or_update_customer(user)
					render :json => {
						'status' => 1,
						'message' => "User updated successfully",
						'results' => user
					}
				else
					render :json => {
						'status' => 0,
						'message' => 'User update failed.'
					}
				end
			else
				render :json => {
					'status' => 0,
					'message' => 'User email or password does not match.'
				}
			end
		else
				user.email = params[:user][:email]
				user.phone = params[:user][:phone]
				user.currency_id = params[:user][:currency_id]
				user.app_pin = params[:user][:app_pin]
				if params[:image]
					image = user.images.new(image_params)
		      		image.save
		      		if !user.images.nil?
						image = user.images.last
						if !image.nil?
							user[:profile_picture] = Dragonfly.app.remote_url_for(image.image_uid)
						end
					end
				end				
				if user.save
					create_or_update_customer(user)
					render :json => {
						'status' => 1,
						'message' => "User updated successfully",
						'results' => user
					}
				else
					render :json => {
						'status' => 0,
						'message' => 'User update failed.'
					}
				end
		end
		
	end

	def create_or_update_customer(user)
		customer_updated = false
		customer = user.street_customer
		if !customer.nil? && !customer.blank?
			customer.email = user.email
			customer.phone = user.phone
			if customer.save
				result = Braintree::Customer.update(
				  "#{customer.customer_id}", # id of customer to update
				  :email => "#{customer.email}",
				  :phone => "#{customer.phone}"
				)
				if result.success?
				  customer_updated = true
				else
				  customer_updated = false
				end
			end
		else
			name = user.name.split(' ')
			customer = StreetCustomer.create(first_name:name.first,last_name:name.last,email:user.email,phone:user.phone,wallet_user_id:user.id)
			if customer
				customer_updated = true
			end
		end	
		return customer_updated
	end

	def add_bonus_stamps(user_id)
		reward = Reward.find_by_id(55)
		if !reward.nil?
			order = Order.create(wallet_user_id:user_id)
			if !order.nil?				
				order_detail = OrderDetail.create(order_id:order.id,wallet_user_id:user_id,earn:9,burn:0, reward_id:reward.id, comments:"manual")
			end
		end	
	end

	def autopilot_options_save
		autopilot = AutopilotOption.new(autopilot_params)

		unless autopilot.save
			render :json => {
				'status' => 0,
				'message' => autopilot.errors.full_messages
			}
		else
			render :json => {
				'status' => 1,
				'message' => 'User Autopilot Options has successfully been saved.',
				'results' => autopilot
			}
		end
	end

	def token
		customer = StreetCustomer.find_by(wallet_user_id:params[:id])
		if customer.nil?
			render :json => {
				'status' => 0,
				'message' => 'Customer not found.'
			}
		else

			resp = Braintree::ClientToken.generate(
			    :customer_id => customer.customer_id
		  	)
		  	customer.update(token:resp)
			render :json => {
				'status' => 1,
				'message' => 'Valid customer.',
				'results' => customer
			}
		end		
	end
	
private
	def autopilot_params
		params.require(:autopilot_option).permit(:id, :wallet_user_id, :sub_company_id, :reward_id, :payment_id, :currency_id,:preffered_amount)
	end
	def image_params
		params.require(:image).permit(:image, :title)
	end
	def user_params
		params.require(:user).permit(:id,:name, :email, :phone, :password, :password_confirmation,:image,:new_password,:app_pin,:currency_id,:profile_picture)
	end
end