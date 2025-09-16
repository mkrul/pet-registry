class DashboardPolicy < ApplicationPolicy
  def access?
    user.present?
  end
end
