class AssignProductProperty < ActiveRecord::Base
	belongs_to :product_property_type
	belongs_to :product_property
	belongs_to :product
end