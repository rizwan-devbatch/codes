class Ability
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user 
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. 
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities

    if user.has_role? :Admin
        can :manage, :all
    else
        can :manage, :all
        # can :manage, Brand
        # can :manage, BrandGroup
        # can :manage, Campaign
        # can :manage, Category
        # can :manage, Customer
        # can :manage, CustomerGroup
        # can :manage, Image
        # can :manage, MembershipPoint
        # can :manage, Product
        # can :manage, ProductsBrand
        # can :manage, ProductsBrandsProduct
        # can :manage, Reward
        # can :manage, RewardMembership
        # can :manage, Shipping
        # can :manage, Store
        # can :manage, StoreGroup
        # can :manage, StoresBrand
        # can :manage, StoresBrandsStore
        # can :manage, Term

        # if user.has_role? :brandmanager
        #     can :new, Brand
        # elsif user.has_role? :marketer
        #     cannot [:brand_approve, :brand_return], Brand
        # elsif user.has_role? :approver
        #     cannot [:new, :create], Brand
        # end
      # can :manage, Product
      # can :read, :all
    end
  end
end
