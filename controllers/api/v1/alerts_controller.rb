class Api::V1::AlertsController < ApplicationController

	def create
		alert = Alert.new(alert_params)

		unless alert.save
			render :json => {
				'Status' => 0,
				'Message' => alert.errors.full_messages
			}
		else
			render :json => {
				'Status' => 1,
				'Message' => 'Alert has successfully been saved.'
			}
		end
	end

private
	def alert_params
		params.require(:alert).permit(:wallet_user_id, :product_id, :alert_type, :price)
	end
end