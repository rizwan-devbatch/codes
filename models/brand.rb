class Brand < ActiveRecord::Base
  belongs_to :company
  belongs_to :user

  has_many :suppliers_accounts, dependent: :delete_all
  has_many :sub_companies, through: :suppliers_accounts

  has_many :stores, dependent: :destroy
  has_many :approved_stores, -> { where(status_caption: 'approved')}, :class_name => 'Store'

  has_many :customers, dependent: :destroy

  has_many :products, dependent: :destroy
  has_many :approved_products, -> { where(status_caption: 'approved')}, :class_name => 'Product'

  has_many :rewards, dependent: :destroy
  has_many :notifications, as: :notifiable
  
  has_many :logo, -> { where(imageable_sub_type: 'logo')}, :as => :imageable, class_name: 'Image', dependent: :destroy
  has_many :images, -> { where(imageable_sub_type: 'images')}, :as => :imageable, class_name: 'Image', dependent: :destroy

  has_many :termsdetails, :as => :detailable, class_name: 'TermsDetail', dependent: :destroy

  has_many :brand_groups, :foreign_key => :brand_a_id
  has_many :brands, :through => :brand_groups, :source => :brand_b

  has_many :own_products,  -> { where(status_caption: 'approved')}, class_name: 'Product'
  has_many :partner_products,  -> { where(status_caption: 'approved')}, :class_name => 'Product'
  has_many :unpublish_products,  -> { where(status_caption: ['pending','sent'])}, class_name: 'Product'

  has_many :own_product_groups, -> { where(status_caption: 'approved')}, class_name: 'Product'
  has_many :partner_product_groups, -> { where(status_caption: 'approved')}, :class_name => 'Product'
  has_many :unpublish_product_groups, -> { where(status_caption: ['pending','sent'])}, class_name: 'Product'

  has_many :campaigns, -> { where(status_caption: 'approved')}

  #has_many :unpublish_brands, -> { where(status_caption: ['pending','returned'])}, class_name: 'Brand'
  validates :status_caption, inclusion: { in: ['pending', 'approved','returned', 'sent'] }

  # attr_accessible :title
 
  def self.approved
    where(status: 'approved')
  end

  def self.returned
    where(status: 'returned')
  end


end