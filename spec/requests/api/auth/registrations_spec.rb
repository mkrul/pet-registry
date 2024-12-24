require 'rails_helper'

RSpec.describe 'API Authentication Registrations' do
  describe 'POST /api/auth/registration' do
    it 'successfully registers a new user with valid credentials' do
      post '/api/auth/registration', params: {
        user: {
          email: 'newuser@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }

      expect(response).to have_http_status(:ok)
      expect(json_response['message']).to eq('Signed up successfully.')
      expect(json_response['user']['email']).to eq('newuser@example.com')
      expect(response.cookies['remember_user_token']).to be_present
    end

    it 'returns error for mismatched passwords' do
      post '/api/auth/registration', params: {
        user: {
          email: 'newuser@example.com',
          password: 'password123',
          password_confirmation: 'different123'
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['errors']).to include("Password confirmation doesn't match Password")
    end

    it 'returns error for duplicate email' do
      existing_user = create(:user, email: 'existing@example.com')

      post '/api/auth/registration', params: {
        user: {
          email: existing_user.email,
          password: 'password123',
          password_confirmation: 'password123'
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['errors']).to include('Email has already been taken')
    end

    it 'returns error for invalid email format' do
      post '/api/auth/registration', params: {
        user: {
          email: 'invalid-email',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['errors']).to include('Email is invalid')
    end

    it 'returns error for short password' do
      post '/api/auth/registration', params: {
        user: {
          email: 'newuser@example.com',
          password: 'short',
          password_confirmation: 'short'
        }
      }

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response['errors']).to include('Password is too short (minimum is 6 characters)')
    end

    it 'handles server errors gracefully' do
      allow(User).to receive(:new).and_raise(StandardError.new('Database error'))

      post '/api/auth/registration', params: {
        user: {
          email: 'newuser@example.com',
          password: 'password123',
          password_confirmation: 'password123'
        }
      }

      expect(response).to have_http_status(:internal_server_error)
      expect(json_response['error']).to eq('Registration failed')
    end
  end
end