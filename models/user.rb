class User < ActiveRecord::Base
  rolify
  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  belongs_to :company
  has_and_belongs_to_many :companies
  belongs_to :currency
  has_many :notifications
  
  validates_confirmation_of :password
  validates_format_of :full_name, :with => /[a-z]/, :message => "name should be alphabetical"
  validates_format_of :city, :with => /[a-z]/, :message => "city should be alphabetical"
  
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def password_required?
    false
  end

  # validates :password, presence: true

  validates :full_name, presence: true
  validates :email, uniqueness: true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }
  validates :phone_no, presence: true
  validates :country, presence: true
  validates :state, presence: true
  validates :city, presence: true
  validates :address_1, presence: true
  validates :pobox, presence: true
 
  validates :contact, inclusion: { in: ['yes', 'no'] }
  validates :contact_full_name, presence: true, if: :contact?
  validates :contact_email, presence: true, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }, if: :contact?
  validates :contact_phone_no, presence: true, if: :contact?

  #attr_accessible :contact
  before_save     :override_field

  private
  def override_field
    if self.contact_email.nil?
      self.contact_email = self.email
    end
    if self.contact_full_name.nil?
      self.contact_full_name = self.full_name
    end
    if self.contact_phone_no.nil?
      self.contact_phone_no = self.phone_no
    end
  end

  def contact?
    contact == "no"
  end

  def self.approved
    where("id !=1 AND status='approved'")
  end

  def self.rejected
    where("id !=1 AND status='rejected'")
  end

  def self.pending
    where("id !=1 AND status='pending'")
  end
  
  #has_many :brands,  dependent: :destroy
  #has_many :campaigns, dependent: :destroy
  #has_many :customers, dependent: :destroy
  #has_many :products, dependent: :destroy 
  #has_many :product_groups, dependent: :destroy
  #has_many :rewards, dependent: :destroy
  #has_many :stores, dependent: :destroy
  #has_many :store_groups, dependent: :destroy
  #has_many :advertisements, dependent: :destroy

  #has_many :single_brands, -> { where(status_caption: 'approved', brand_type: 'single')}, :class_name => 'Brand'
  #has_many :group_brands, -> { where(status_caption: 'approved', brand_type: 'group')}, class_name: 'Brand'

  #has_many :single_customers, -> { where(status_caption: 'approved', customer_type: 'single')}, :class_name => 'Customer'
  #has_many :group_customers, -> { where(status_caption: 'approved', customer_type: 'group')}, class_name: 'Customer'

  #has_many :single_stores, -> { where(store_type_bit: 'single')}, :class_name => 'Store'
  #has_many :group_stores, -> { where(status_caption: 'approved',store_type_bit: 'group')}, class_name: 'Store'

  #has_many :single_products, -> { where(product_type: 'single')}, :class_name => 'Product'
  #has_many :group_products, -> { where(status_caption: 'approved', product_type: 'group')}, class_name: 'Product'
  
  #has_many :own_brands, -> { where(status_caption: 'approved', ownership: true)}, :class_name => 'Brand'
  #has_many :partner_brands, -> { where(status_caption: 'approved', ownership: false)}, class_name: 'Brand'
  #has_many :unpublish_brands, -> { where(status_caption: ['pending','returned'])}, class_name: 'Brand'
  
  #has_many :web_stores, -> { where(status_caption: 'approved', store_type: true)}, class_name: 'Store'
  #has_many :brick_stores, -> { where(status_caption: 'approved', store_type: false)}, :class_name => 'Store'
  #has_many :unpublish_stores, -> { where(status_caption: ['pending','returned'])}, class_name: 'Store'

  
  #has_many :own_products,  -> { where(status_caption: 'approved')}, class_name: 'Product'
  #has_many :partner_products,  -> { where(status_caption: 'approved')}, :class_name => 'Product'
  #has_many :unpublish_products,  -> { where(status_caption: ['pending','returned'])}, class_name: 'Product'
  
  #has_many :own_product_groups, -> { where(status_caption: 'approved')}, class_name: 'Product'
  #has_many :partner_product_groups, -> { where(status_caption: 'approved')}, :class_name => 'Product'
  #has_many :unpublish_product_groups, -> { where(status_caption: ['pending','returned'])}, class_name: 'Product'

  #has_many :nuWallet_customers, -> { where(status_caption: 'approved', wallet: 1)}, class_name: 'Customer'
  #has_many :facebook_customers, -> { where(status_caption: 'approved', customer_sub_name: 'facebook')}, class_name: 'Customer'
  #has_many :twitter_customers, -> { where(status_caption: 'approved', customer_sub_name: 'twitter')}, class_name: 'Customer'
  #has_many :nonWallet_customers, -> { where(status_caption: 'approved', wallet: 0)}, :class_name => 'Customer'
  #has_many :unpublish_customers, -> { where(status_caption: 'pending')}, class_name: 'Customer'
  
  #has_many :compaigns_rewards, -> { where(status_caption: 'approved')}, class_name: 'Reward'
  #has_many :advertisement_rewards, -> { where(status_caption: 'approved')}, :class_name => 'Reward'
  #has_many :loyalty_rewards, -> { where(status_caption: 'approved')}, class_name: 'Reward'
  #has_many :unpublish_rewards, -> { where(status_caption: 'pending')}, class_name: 'Reward'
end
