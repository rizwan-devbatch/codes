class ProductPriceReference < ActiveRecord::Base
	belongs_to :product_property_type
	belongs_to :product
end