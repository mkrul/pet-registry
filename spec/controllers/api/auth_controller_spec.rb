require 'rails_helper'

RSpec.describe Api::SessionsController, type: :controller do
  describe 'POST #create' do
    it 'returns success with valid credentials' do
      user = User.create!(email: 'test@example.com', password: 'password123')

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      }

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to include(
        'message' => 'Logged in successfully.',
        'user' => {
          'id' => user.id,
          'email' => user.email
        }
      )
      expect(session['warden.user.user.key']).not_to be_nil
    end

    it 'returns unauthorized with invalid password' do
      User.create!(email: 'test@example.com', password: 'password123')

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'wrong_password'
          }
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)).to include('error' => 'Invalid email or password.')
      expect(session['warden.user.user.key']).to be_nil
    end

    it 'returns unauthorized with non-existent email' do
      post :create, params: {
        session: {
          user: {
            email: 'nonexistent@example.com',
            password: 'password123'
          }
        }
      }

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)).to include('error' => 'Invalid email or password.')
      expect(session['warden.user.user.key']).to be_nil
    end
  end

  describe 'GET #show' do
    it 'returns current user when authenticated' do
      user = User.create!(email: 'test@example.com', password: 'password123')
      sign_in user

      get :show

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to include(
        'user' => {
          'id' => user.id,
          'email' => user.email
        }
      )
    end

    it 'returns unauthorized when not authenticated' do
      get :show

      expect(response).to have_http_status(:unauthorized)
      expect(JSON.parse(response.body)).to include('error' => 'Not authenticated')
    end
  end

  describe 'DELETE #destroy' do
    it 'successfully logs out authenticated user' do
      user = User.create!(email: 'test@example.com', password: 'password123')
      sign_in user

      delete :destroy

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to include('message' => 'Logged out successfully.')
      expect(session['warden.user.user.key']).to be_nil
    end

    it 'succeeds even when no user is logged in' do
      delete :destroy

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)).to include('message' => 'Logged out successfully.')
    end
  end

  describe 'Cookie handling' do
    it 'sets remember_me cookie on login' do
      user = User.create!(email: 'test@example.com', password: 'password123')

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      }

      expect(response).to have_http_status(:success)
      expect(cookies.signed['remember_user_token']).not_to be_nil
    end

    it 'clears remember_me cookie on logout' do
      user = User.create!(email: 'test@example.com', password: 'password123')
      sign_in user
      user.remember_me!
      cookies.signed['remember_user_token'] = user.class.serialize_into_cookie(user)

      delete :destroy

      expect(response).to have_http_status(:success)
      expect(cookies['remember_user_token']).to be_nil
    end
  end

  describe 'Session handling' do
    it 'maintains session across requests when authenticated' do
      user = User.create!(email: 'test@example.com', password: 'password123')

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      }

      get :show

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body)['user']['email']).to eq(user.email)
    end

    it 'creates new session on login after logout' do
      user = User.create!(email: 'test@example.com', password: 'password123')

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      }

      delete :destroy

      post :create, params: {
        session: {
          user: {
            email: 'test@example.com',
            password: 'password123'
          }
        }
      }

      expect(response).to have_http_status(:success)
    end
  end
end