class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # Remove password confirmation requirement if not needed
  # or ensure it's properly handled in the test
end
