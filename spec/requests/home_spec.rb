require 'rails_helper'

RSpec.describe 'Home' do
  describe 'GET /' do
    it 'returns successful response' do
      get '/'
      expect(response).to have_http_status(:ok)
    end

    it 'returns success even when not authenticated' do
      get '/'
      expect(response).to have_http_status(:ok)
    end

    it 'returns success when authenticated' do
      user = create(:user)
      sign_in user
      get '/'
      expect(response).to have_http_status(:ok)
    end

    it 'sets the correct content type' do
      get '/'
      expect(response.content_type).to include('text/html')
    end
  end
end