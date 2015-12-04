class Alert < ActiveRecord::Base
  belongs_to :wallet_user
  belongs_to :product

  validates_presence_of :wallet_user_id
  validates_presence_of :product_id
  validates_presence_of :alert_type
  validates_numericality_of :price, if: Proc.new { |a| a.alert_type == 'price' }
end