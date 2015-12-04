class Api::V1::BrandsController < ApplicationController

	def suggested_save
		brand = SuggestedBrand.new(suggested_brands_params)
		user = WalletUser.find(params[:suggested_brand][:wallet_user_id])
		if user.suggested_brands.count > 10
			render :json => {
				'status' => 0,
				'message' => 'You can suggest only 10 brands'
			}
		else
			unless brand.save
				render :json => {
					'status' => 0,
					'message' => brand.errors.full_messages
				}
			else
				render :json => {
					'status' => 1,
					'message' => 'Suggested brand has successfully been saved.'
				}
			end
		end
	end

	def voting
		voting = Voting.new(wallet_user_id:params[:user_id],suggested_brand_id:params[:brand_id])
		user_voted = Voting.where(wallet_user_id:params[:user_id],suggested_brand_id:params[:brand_id])
		if !user_voted.blank? && !user_voted.nil?
			if user_voted.count >= 1
				render :json => {
					'status' => 0,
					'message' => 'You can vote one brand only once'
				}
			else
				unless voting.save
					render :json => {
						'status' => 0,
						'message' => voting.errors.full_messages
					}
				else
					render :json => {
						'status' => 1,
						'message' => 'You have successfully voted the brand.'
					}
				end
			end	
		else
			unless voting.save
				render :json => {
					'status' => 0,
					'message' => voting.errors.full_messages
				}
			else
				render :json => {
					'status' => 1,
					'message' => 'You have successfully voted the brand.'
				}
			end
		end			
	end

	def index
		brands_ = Brand
		.select('
			id,
			title,
			description
		')
		.includes(:campaigns, :logo, :images, products: :images)
		.where("status_caption = 'approved'")
		.paginate(page: params[:page], per_page: 2)

		brands = Hash.new
		brands_.each do |b|
			brands[b.id] ||= {}
			brands[b.id][:id] = b.id
			brands[b.id][:title] = b.title
			brands[b.id][:description] = b.description
			brands[b.id][:campaigns_count] = b.campaigns.size

			if !b.logo.nil?
				b.logo.each do |i|
					brands[b.id][:logo] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end
			if !b.images.nil?
				b.images.each do |i|
					brands[b.id][:images] ||= {}
					brands[b.id][:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end

			if !b.products.nil?
				b.products.each do |p|
					brands[b.id][:products] ||= {}
					brands[b.id][:products][p.id] ||= {}
					brands[b.id][:products][p.id][:id] = p.id
					brands[b.id][:products][p.id][:sku] = p.sku
					brands[b.id][:products][p.id][:title] = p.title
					brands[b.id][:products][p.id][:description] = p.description
					brands[b.id][:products][p.id][:product_deliver] = p.product_deliver

					if !p.images.nil?
						p.images.each do |i|
							brands[b.id][:products][p.id][:images] ||= {}
							brands[b.id][:products][p.id][:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
						end
					end
				end
			end
		end

		render :json => {
			'Status' => 1,
			'Message' => '',
			'Results' => {
				'Results' => brands,
				'Total' => brands_.total_entries
			}
		}
	end

	def show
		b = Brand
		.select('
			id,
			title,
			description
		')
		.includes(:campaigns, :logo, :images)
		.where("id = #{params[:id]} AND status_caption = 'approved'").first

		if b.nil?
			render :json => {
				'Status' => 0,
				'Message' => 'No brand found.'
			}
		else
			brand ||= {}
			brand[:id] = b.id
			brand[:title] = b.title
			brand[:description] = b.description
			brand[:campaigns_count] = b.campaigns.size

			if !b.logo.nil?
				b.logo.each do |i|
					brand[:logo] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end
			if !b.images.nil?
				b.images.each do |i|
					brand[:images] ||= {}
					brand[:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end

			stores = b.stores.includes(:campaigns, :images).near([31.5725, 74.3021], 10, :order => "distance")
			if !stores.nil?
				counter = 0
				stores.each do |s|
					brand[:stores] ||= {}
					brand[:stores][counter] ||= {}
					brand[:stores][counter][:id] = s.id
					brand[:stores][counter][:title] = s.title
					brand[:stores][counter][:distance] = s.distance.round(2)
					brand[:stores][counter][:campaigns_count] = s.campaigns.size

					if !s.images.nil?
						s.images.each do |i|
							brand[:stores][counter][:images] ||= {}
							brand[:stores][counter][:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
						end
					end
					counter += 1
				end
			end

			render :json => {
				'Status' => 1,
				'Message' => '',
				'Results' => {
					'Results' => brand
				}
			}
		end
	end

	def categories
		b = Brand
		.select('
			id,
			title,
			description
		')
		.includes(:logo, :images)
		.where("id = #{params[:id]} AND status_caption = 'approved'").first

		if b.nil?
			render :json => {
				'Status' => 0,
				'Message' => 'No brand found.'
			}
		else
			brand ||= {}
			brand[:id] = b.id
			brand[:title] = b.title
			brand[:description] = b.description

			if !b.logo.nil?
				b.logo.each do |i|
					brand[:logo] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end
			if !b.images.nil?
				b.images.each do |i|
					brand[:images] ||= {}
					brand[:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end

			categories = Category
			.select('
				categories.id, categories.title, COUNT(campaigns.id) as campaigns_count
			')
			.joins(product: :campaigns)
			.where("products.brand_id = #{params[:id]} AND products.status_caption = 'approved'")
			.group("categories.id, categories.title")

			if !categories.nil?
				counter = 0
				categories.each do |c|
					brand[:categories] ||= {}
					brand[:categories][counter] ||= {}
					brand[:categories][counter][:id] = c.id
					brand[:categories][counter][:title] = c.title
					brand[:categories][counter][:campaigns_count] = c.campaigns_count

					counter += 1
				end
			end

			render :json => {
				'Status' => 1,
				'Message' => '',
				'Results' => {
					'Results' => brand
				}
			}
		end
	end

	def category_products
		b = Brand
		.select('
			id,
			title,
			description,
			currency_id
		')
		.includes(:logo, :images)
		.where("id = #{params[:id]} AND status_caption = 'approved'").first

		if b.nil?
			render :json => {
				'Status' => 0,
				'Message' => 'No brand found.'
			}
		else
			brand ||= {}
			brand[:id] = b.id
			brand[:title] = b.title
			brand[:description] = b.description
			if !b.currency.nil?
				brand[:curency] = b.currency.unit
			end

			if !b.logo.nil?
				b.logo.each do |i|
					# brand[:logo] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end
			if !b.images.nil?
				b.images.each do |i|
					brand[:images] ||= {}
					# brand[:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
				end
			end

			products = Product
			.select('
				products.id,
				products.brand_id,
				products.sku,
				products.title,
				products.description,
				products.product_deliver,
				products.quantity,
				products.quantity_unit,
				products.cost,
				products.price,
				products.discount
			')
			.joins(:category)
			.includes(:images, :campaigns)
			.where("products.brand_id = #{params[:id]} AND products.category_id = #{params[:category_id]} AND products.status_caption = 'approved'")

			if !products.nil?
				products.each do |p|
					brand[:products] ||= {}
					brand[:products][p.id] ||= {}
					brand[:products][p.id][:id] = p.id
					brand[:products][p.id][:sku] = p.sku
					brand[:products][p.id][:title] = p.title
					brand[:products][p.id][:description] = p.description
					brand[:products][p.id][:product_deliver] = p.product_deliver

					brand[:products][p.id][:quantity] = p.quantity
					brand[:products][p.id][:quantity_unit] = p.quantity_unit
					brand[:products][p.id][:cost] = p.cost
					brand[:products][p.id][:price] = p.price
					brand[:products][p.id][:discount] = p.discount

					brand[:products][p.id][:campaigns_count] = p.campaigns.size

					if !p.images.nil?
						p.images.each do |i|
							brand[:products][p.id][:images] ||= {}
							brand[:products][p.id][:images][i.id] = Cloudinary::Api.resource(i.image.public_id)['url']
						end
					end
				end
			end

			render :json => {
				'Status' => 1,
				'Message' => '',
				'Results' => {
					'Results' => brand
				}
			}
		end
	end
private
	def suggested_brands_params
		params.require(:suggested_brand).permit(:wallet_user_id, :name,:city)
	end
end