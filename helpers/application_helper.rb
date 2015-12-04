module ApplicationHelper
	def base_url
		if Rails.env.development?
			"http://localhost:3000"
		else
			"http://nutonia.herokuapp.com"
		end
	end

	# def terms_detail_apply(term, detailable_type, detailable_id)
	# 	terms_detail = TermsDetail.where(
	# 		company_id: term.company_id,
	# 		term_id: term.id,
	# 		detailable_type: detailable_type,
	# 		detailable_id: detailable_id
	# 	).first

	# 	return terms_detail.nil?
	# end
end