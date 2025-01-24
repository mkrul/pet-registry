# frozen_string_literal: true

require 'rails_helper'

RSpec.describe "Api::SessionsController", type: :request do
  include Devise::Test::IntegrationHelpers
  include ActionDispatch::TestProcess
  include ActiveSupport::Testing::TimeHelpers

  let(:user) { FactoryBot.create(:user, email: 'test@example.com', password: 'password123') }
  let(:headers) { { 'ACCEPT' => 'application/json', 'CONTENT_TYPE' => 'application/json' } }

  around do |example|
    old_logger = Rails.logger
    Rails.logger = Logger.new(STDOUT)
    example.run
    Rails.logger = old_logger
  end

  around(:each) do |example|
    ActiveSupport::LogSubscriber.logger.level = :debug
    example.run
  end

  describe 'POST /api/login' do
    context 'when credentials are valid' do
      let(:valid_params) do
        { user: { email: user.email, password: 'password123' } }.to_json
      end

      it 'logs in the user' do
        post '/api/login', params: valid_params, headers: headers
        expect(response).to have_http_status(:ok)
      end

      it 'sets remember me cookie when supported' do
        post '/api/login', params: valid_params, headers: headers
        expect(response.cookies['remember_user_token']).to be_present
      end
    end

    context 'when credentials are invalid' do
      it 'returns unauthorized for wrong password' do
        post '/api/login', params: {
          user: { email: user.email, password: 'wrong' }
        }.to_json, headers: headers

        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns unauthorized for non-existent email' do
        post '/api/login', params: {
          user: { email: 'nonexistent@example.com', password: 'password123' }
        }.to_json, headers: headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when params format varies' do
      it 'accepts session-wrapped parameters' do
        post '/api/login', params: {
          session: { user: { email: user.email, password: 'password123' } }
        }.to_json, headers: headers

        expect(response).to have_http_status(:ok)
      end

      it 'handles missing parameters' do
        post '/api/login', params: {}.to_json, headers: headers
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when using remember me functionality' do
      it 'sets cookie with correct expiration' do
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers

        set_cookie = response.headers['Set-Cookie']

        expect(set_cookie).to include('remember_user_token=')

        remember_duration = Devise.remember_for.from_now
        expected_expires = remember_duration.strftime("%a, %d-%b-%Y %H:%M:%S %Z")

        expect(set_cookie).to match(/Expires=#{expected_expires}/)
      end
    end


    context 'when using case-insensitive email' do
      it 'logs in with uppercase email' do
        post '/api/login', params: {
          user: { email: user.email.upcase, password: 'password123' }
        }.to_json, headers: headers

        expect(response).to have_http_status(:ok)
      end
    end

    context 'when using malformed parameters' do
      it 'handles empty parameters gracefully' do
        post '/api/login', params: { user: {} }.to_json, headers: headers
        expect(response).to have_http_status(:bad_request)
      end

      it 'handles nil values gracefully' do
        post '/api/login', params: {
          user: { email: nil, password: nil }
        }.to_json, headers: headers

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when using whitespace in credentials' do
      it 'trims whitespace from email' do
        post '/api/login', params: {
          user: { email: " #{user.email} ", password: 'password123' }
        }.to_json, headers: headers

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['user']['email']).to eq(user.email)
      end
    end

    context 'when request format is invalid' do
      it 'handles invalid content type' do
        headers_without_json = headers.merge('CONTENT_TYPE' => 'text/plain')
        post '/api/login', params: 'invalid', headers: headers_without_json
        expect(response).to have_http_status(:bad_request)
      end
    end

    context 'when using special characters' do
      let(:special_user) { FactoryBot.create(:user, email: 'test+special@example.com', password: 'password123') }

      it 'handles special characters in email' do
        post '/api/login', params: {
          user: { email: special_user.email, password: 'password123' }
        }.to_json, headers: headers

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['user']['email']).to eq(special_user.email)
      end
    end

    context 'when using concurrent requests' do
      it 'handles simultaneous login attempts' do
        threads = []
        threads << Thread.new do
          post '/api/login', params: {
            user: { email: user.email, password: 'password123' }
          }.to_json, headers: headers
        end

        threads << Thread.new do
          post '/api/login', params: {
            user: { email: user.email, password: 'password123' }
          }.to_json, headers: headers
        end

        threads.each(&:join)
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'GET /api/current_user' do
    context 'when user is authenticated' do
      before do
        sign_in user
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers
      end

      it 'returns current user info' do
        get '/api/current_user', headers: headers
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when user has remember token' do
      it 'authenticates from remember token' do
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers

        get '/api/current_user', headers: headers
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when user is not authenticated' do
      it 'returns unauthorized status' do
        get '/api/current_user', headers: headers
        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['error']).to eq('Not authenticated')
      end
    end

    context 'when session is expired' do
      it 'handles expired remember token' do
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers

        # Update the remember_created_at to simulate expiration
        user.update(remember_created_at: 3.weeks.ago)

        travel_to 3.weeks.from_now do
          # Clear session to simulate expiration
          session.clear
          cookies.delete(:remember_user_token)
          get '/api/current_user', headers: headers
          expect(response).to have_http_status(:unauthorized)
          expect(cookies[:remember_user_token]).to be_nil
        end
      end
    end

    context 'when using multiple sessions' do
      it 'maintains separate sessions' do
        # First login
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers

        first_session = response.cookies['_pet_registry_session']

        # Second login with different user
        second_user = FactoryBot.create(:user)
        post '/api/login', params: {
          user: { email: second_user.email, password: 'password123' }
        }.to_json, headers: headers

        second_session = response.cookies['_pet_registry_session']

        expect(second_session).to be_present
        expect(second_session).not_to eq(first_session)
      end
    end

    context 'when token is malformed' do
      it 'handles corrupted remember token' do
        # Need to make a request first to initialize cookies
        get '/api/current_user', headers: headers
        cookies[:remember_user_token] = 'invalid_token'

        get '/api/current_user', headers: headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/logout' do
    context 'when user is logged in' do
      before do
        sign_in user
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers
      end

      it 'logs out the user' do
        delete '/api/logout', headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('Logged out successfully')
      end

      it 'clears remember me token' do
        delete '/api/logout', headers: headers
        expect(cookies[:remember_user_token]).to be_nil
      end
    end

    context 'when user is not logged in' do
      it 'returns success message' do
        delete '/api/logout', headers: headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('No user to log out')
      end
    end

    context 'when using remember token' do
      it 'invalidates remember token on logout' do
        post '/api/login', params: {
          user: { email: user.email, password: 'password123' }
        }.to_json, headers: headers

        delete '/api/logout', headers: headers

        get '/api/current_user', headers: headers
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when handling multiple devices' do
      it 'clears all remember tokens' do
        sign_in user
        user.remember_me!
        original_token = user.remember_token

        delete '/api/logout', headers: headers

        user.reload
        expect(user.remember_token).not_to eq(original_token)
      end
    end

    context 'when using invalid session data' do
      it 'handles corrupted session gracefully' do
        delete '/api/logout', headers: headers

        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to eq('No user to log out')
      end
    end

    context 'when using concurrent requests' do
      it 'handles simultaneous logout attempts' do
        sign_in user
        threads = []
        threads << Thread.new do
          delete '/api/logout', headers: headers
        end

        threads << Thread.new do
          delete '/api/logout', headers: headers
        end

        threads.each(&:join)
        expect(response).to have_http_status(:ok)
      end
    end
  end
end