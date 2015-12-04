class Image < ActiveRecord::Base
	#has_attachment :image
	# dragonfly_accessor :image
	extend Dragonfly::Model
  	dragonfly_accessor :image
	# validates :image, presence: true
	# belongs_to :imageable, polymorphic: true
	# validates_size_of :image, maximum: 500.kilobytes,
	# 	message: "should be no more than 500 KB", if: :image_changed?
	 
	# validates_property :format, of: :image, in: [:jpeg, :jpg, :png, :bmp], case_sensitive: false,
	# 	message: "should be either .jpeg, .jpg, .png, .bmp", if: :image_changed?
end
