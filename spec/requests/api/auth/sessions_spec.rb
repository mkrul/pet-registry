require 'rails_helper'

RSpec.describe 'API Authentication Sessions' do
  describe 'POST /api/auth/login' do
    it 'successfully logs in a user with valid credentials' do
      user = create(:user)
      post '/api/auth/login', params: {
        user: {
          email: user.email,
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:ok)
      expect(json_response['message']).to eq('Logged in successfully.')
      expect(json_response['user']['email']).to eq(user.email)
      expect(response.cookies['remember_user_token']).to be_present
    end

    it 'returns unauthorized for invalid password' do
      user = create(:user)
      post '/api/auth/login', params: {
        user: {
          email: user.email,
          password: 'wrongpassword'
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(json_response['message']).to eq('Invalid email or password.')
    end

    it 'returns unauthorized for non-existent user' do
      post '/api/auth/login', params: {
        user: {
          email: 'nonexistent@example.com',
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(json_response['message']).to eq('Invalid email or password.')
    end

    it 'handles server errors gracefully' do
      user = create(:user)
      allow(User).to receive(:find_by).and_raise(StandardError.new('Database error'))

      post '/api/auth/login', params: {
        user: {
          email: user.email,
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:internal_server_error)
      expect(json_response['message']).to eq('Login failed')
    end
  end

  describe 'GET /api/auth/current_user' do
    it 'returns current user when authenticated via session' do
      user = create(:user)
      sign_in user
      get '/api/auth/current_user'

      expect(response).to have_http_status(:ok)
      expect(json_response['user']['email']).to eq(user.email)
    end

    it 'returns current user when authenticated via remember token' do
      user = create(:user)
      user.remember_me!
      sign_in user
      cookies['remember_user_token'] = user.class.serialize_into_cookie(user)
      get '/api/auth/current_user'

      expect(response).to have_http_status(:ok)
      expect(json_response['user']['email']).to eq(user.email)
    end

    it 'returns unauthorized when not authenticated' do
      get '/api/auth/current_user'

      expect(response).to have_http_status(:unauthorized)
      expect(json_response['message']).to eq('Not authenticated')
    end

    it 'handles server errors gracefully' do
      user = create(:user)
      sign_in user
      allow_any_instance_of(User).to receive(:as_json)
        .and_raise(StandardError.new('Database error'))

      get '/api/auth/current_user'

      expect(response).to have_http_status(:internal_server_error)
      expect(json_response['message']).to eq('Authentication check failed')
    end
  end

  describe 'DELETE /api/auth/logout' do
    it 'successfully logs out a user' do
      user = create(:user)
      sign_in user
      user.remember_me!
      cookies['remember_user_token'] = user.class.serialize_into_cookie(user)

      delete '/api/auth/logout'

      expect(response).to have_http_status(:ok)
      expect(json_response['message']).to eq('Logged out successfully.')
      expect(session['warden.user..key']).to be_nil
      expect(response.cookies['remember_user_token']).to be_nil
    end

    it 'succeeds even if user is not logged in' do
      delete '/api/auth/logout'

      expect(response).to have_http_status(:ok)
      expect(json_response['message']).to eq('Logged out successfully.')
    end

    it 'handles server errors gracefully' do
      user = create(:user)
      sign_in user
      allow_any_instance_of(User).to receive(:forget_me!)
        .and_raise(StandardError.new('Database error'))

      delete '/api/auth/logout'

      expect(response).to have_http_status(:internal_server_error)
      expect(json_response['message']).to eq('Logout failed')
    end
  end
end