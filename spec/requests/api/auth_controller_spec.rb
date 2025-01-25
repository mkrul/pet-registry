require 'rails_helper'

RSpec.describe "Api::AuthController", type: :request do
  include Devise::Test::IntegrationHelpers
  include ActionController::RespondWith

  let(:user) { FactoryBot.create(:user, email: 'test@example.com', password: 'password123', password_confirmation: 'password123') }
  let(:headers) { { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' } }

  before do
    @request&.env&.merge!(headers)
  end

  context "when logging in with valid credentials" do
    it "returns success response with user data" do
      post '/api/login',
        params: { user: { email: user.email, password: 'password123' } }.to_json,
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['message']).to eq('Login successful')
      expect(JSON.parse(response.body)['user']['email']).to eq('test@example.com')
    end
  end

  context "when logging in with invalid credentials" do
    it "returns unauthorized error" do
      post '/api/login',
        params: { user: { email: 'wrong@example.com', password: 'wrong' } }.to_json,
        headers: headers

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with missing email" do
    it "returns unauthorized error" do
      post '/api/login',
        params: { user: { password: 'password123' } }.to_json,
        headers: headers

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with missing password" do
    it "returns unauthorized error" do
      post '/api/login', params: {
        user: {
          email: 'test@example.com'
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with empty email" do
    it "returns unauthorized error" do
      post '/api/login', params: {
        user: {
          email: '',
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with empty password" do
    it "returns unauthorized error" do
      post '/api/login', params: {
        user: {
          email: 'test@example.com',
          password: ''
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with malformed email" do
    it "returns unauthorized error" do
      post '/api/login', params: {
        user: {
          email: 'notanemail',
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with different case email" do
    let!(:user) { FactoryBot.create(:user, email: 'test@example.com', password: 'password123') }

    it "returns success response" do
      post '/api/login', params: {
        user: {
          email: 'TEST@example.com',
          password: 'password123'
        }
      }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['email']).to eq('test@example.com')
    end
  end

  context "when getting current user while authenticated" do
    it "returns current user data" do
      sign_in user
      get '/api/current_user', headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['id']).to eq(user.id)
    end
  end

  context "when getting current user while unauthenticated" do
    it "returns unauthorized error" do
      get '/api/current_user', headers: headers

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Not authenticated')
    end
  end

  context "when logging out" do
    it "returns success message" do
      sign_in user
      delete '/api/logout', headers: headers, xhr: true

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['message']).to eq('Logged out successfully')
    end
  end

  context "when logging out without being signed in" do
    it "returns success message" do
      delete '/api/logout', headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['message']).to eq('No user to log out')
    end
  end

  context "when session persists after login" do
    it "maintains authentication" do
      post '/api/login', params: {
        user: {
          email: user.email,
          password: 'password123'
        }
      }
      get '/api/current_user'

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['email']).to eq('test@example.com')
    end
  end

  context "when logging in with extra parameters" do
    it "ignores extra parameters and succeeds" do
      post '/api/login', params: {
        user: {
          email: user.email,
          password: 'password123',
          extra: 'data'
        }
      }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['email']).to eq('test@example.com')
    end
  end

  context "when logging in with nil parameters" do
    it "returns unauthorized error" do
      post '/api/login', params: {
        user: {
          email: nil,
          password: nil
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with very long credentials" do
    it "returns unauthorized error" do
      long_string = 'a' * 256
      post '/api/login', params: {
        user: {
          email: long_string,
          password: long_string
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)['error']).to eq('Invalid email or password')
    end
  end

  context "when logging in with special characters" do
    let(:special_user) { FactoryBot.create(:user, email: 'test!@example.com', password: 'p@ssw0rd!', password_confirmation: 'p@ssw0rd!') }

    it "handles special characters in credentials" do
      post '/api/login',
        params: { user: { email: special_user.email, password: 'p@ssw0rd!' } }.to_json,
        headers: headers

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['email']).to eq('test!@example.com')
    end
  end

  context "when logging in with leading/trailing spaces" do
    let!(:user) { FactoryBot.create(:user, email: 'test@example.com', password: 'password123') }

    it "trims whitespace and succeeds" do
      post '/api/login', params: {
        user: {
          email: '  test@example.com  ',
          password: '  password123  '
        }
      }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['user']['email']).to eq('test@example.com')
    end
  end
end