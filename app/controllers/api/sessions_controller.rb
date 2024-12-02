module Api
  class SessionsController < Devise::SessionsController
    # Custom API session logic
    respond_to :json

    private

    def respond_with(resource, _opts = {})
      render json: { message: 'Logged in successfully.', user: resource }, status: :ok
    end

    def respond_to_on_destroy
      render json: { message: 'Logged out successfully.' }, status: :ok
    end
  end
end
