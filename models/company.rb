class Company < ActiveRecord::Base
	belongs_to :currency
	belongs_to :user
	has_and_belongs_to_many :users
	has_many :sub_companies, dependent: :destroy
	has_many :personalization_buttons, dependent: :destroy
	has_many :fee_conditions, dependent: :destroy
	has_many :shipments, dependent: :destroy

	has_many :marketers, -> { where(marketer: true)}, class_name: 'User'
	has_many :approvers, -> { where(approver: true)}, class_name: 'User'
	has_many :cashiers, -> { where(cashier: true)}, class_name: 'User'
	
	has_many :product_property_types, dependent: :destroy
	has_many :product_properties, through: :product_property_types

	has_many :customers, dependent: :destroy
	has_many :products, dependent: :destroy 
	#has_many :product_groups, dependent: :destroy
	has_many :rewards, dependent: :destroy
	has_many :stores, dependent: :destroy
	#has_many :store_groups, dependent: :destroy
	has_many :advertisements, dependent: :destroy
    has_many :terms,  dependent: :destroy
	#has_many :term_details,  dependent: :destroy
	has_many :campaigns, dependent: :destroy

	#has_many :default_stores, -> { where(default_store: true)}, class_name: 'Store'

	has_many :brands,  dependent: :destroy
	has_many :approved_brands, -> { where(status_caption: 'approved')}, class_name: 'Brand'
	has_many :unpublished_brands, -> { where(status_caption: ['pending','sent'])}, class_name: 'Brand'
    has_many :own_brands, -> { where(status_caption: 'approved', ownership: true)}, :class_name => 'Brand'
	has_many :partner_brands, -> { where(status_caption: 'approved', ownership: false)}, class_name: 'Brand'
	has_many :single_brands, -> { where(status_caption: 'approved', brand_type: 'single')}, :class_name => 'Brand'
	has_many :group_brands, -> { where(status_caption: 'approved', brand_type: 'group')}, class_name: 'Brand'

	
	has_many :approved_campaigns, -> { where(status_caption: 'approved')}, class_name: 'Campaign'
	has_many :unpublished_campaigns, -> { where(status_caption: ['pending','sent'])}, class_name: 'Campaign'
	

	has_many :single_customers, -> { where(status_caption: 'approved', customer_type: 'single')}, :class_name => 'Customer'
	has_many :group_customers, -> { where(status_caption: 'approved', customer_type: 'group')}, class_name: 'Customer'
	has_many :nuWallet_customers, -> { where(status_caption: 'approved', wallet: 1)}, class_name: 'Customer'
	has_many :nonWallet_customers, -> { where(status_caption: 'approved', wallet: 0)}, :class_name => 'Customer'
	has_many :unpublish_customers, -> { where(status_caption: 'pending')}, class_name: 'Customer'
    has_many :facebook_customers, -> { where(status_caption: 'approved', customer_sub_name: 'facebook')}, class_name: 'Customer'
    has_many :twitter_customers, -> { where(status_caption: 'approved', customer_sub_name: 'twitter')}, class_name: 'Customer'
    
    has_many :approved_stores, -> { where(status_caption: 'approved')}, :class_name => 'Store'
	has_many :single_stores, -> { where(store_type_bit: 'single')}, :class_name => 'Store'
	has_many :group_stores, -> { where(store_type_bit: 'group')}, class_name: 'Store'
	has_many :web_stores, -> { where(status_caption: 'approved', store_type: true)}, class_name: 'Store'
	has_many :brick_stores, -> { where(status_caption: 'approved', store_type: false)}, :class_name => 'Store'
	has_many :unpublish_stores, -> { where(status_caption: ['pending','sent'])}, class_name: 'Store'

    has_many :approved_products, -> { where(status_caption: 'approved')}, :class_name => 'Product'
	has_many :single_products, -> { where(product_type: 'single')}, :class_name => 'Product'
	has_many :group_products, -> { where(product_type: 'group')}, class_name: 'Product'
	has_many :own_products,  -> { where(status_caption: 'approved')}, class_name: 'Product'
	has_many :partner_products,  -> { where(status_caption: 'approved')}, :class_name => 'Product'
	has_many :unpublish_products,  -> { where(status_caption: ['pending','sent'])}, class_name: 'Product'

	has_many :own_product_groups, -> { where(status_caption: 'approved')}, class_name: 'Product'
	has_many :partner_product_groups, -> { where(status_caption: 'approved')}, :class_name => 'Product'
	has_many :unpublish_product_groups, -> { where(status_caption: ['pending','sent'])}, class_name: 'Product'

	validates :status, inclusion: { in: ['pending', 'approved','rejected'] }


	#TODO  change this across the project
	has_many :compaigns_rewards, -> { where(status_caption: 'approved')}, class_name: 'Campaign'
	has_many :advertisement_rewards, -> { where(status_caption: 'approved')}, :class_name => 'Advertisement'
	has_many :loyalty_rewards, -> { where(status_caption: 'approved')}, class_name: 'Reward'

    #TODO  change this across the project
    has_many :unpublish_loyalty_rewards, -> { where(status_caption: 'pending')}, class_name: 'Reward'
    has_many :unpublish_campaign_rewards, -> { where(status_caption: nil)}, class_name: 'Campaign'
    has_many :unpublish_advertisement_rewards, -> { where(status_caption: 'pending')}, :class_name => 'Advertisement'

    

    has_many :logo, -> { where(imageable_sub_type: 'logo')}, :as => :imageable, class_name: 'Image', dependent: :destroy
  	has_many :images, -> { where(imageable_sub_type: 'images')}, :as => :imageable, class_name: 'Image', dependent: :destroy


    validates :status, inclusion: { in: ['pending', 'approved', 'rejected'] }
    def self.approved
      where("id !=1 AND status='approved'")
    end

    def self.rejected
      where("id !=1 AND status='rejected'")
    end

    def self.pending
      where("id !=1 AND status='pending'")
    end
end