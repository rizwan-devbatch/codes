module SessionHelper
  def sign_in(user)
	  cookies.signed[:remember_token] = [user.id, user.salt]
	  self.current_user = user
  end
end