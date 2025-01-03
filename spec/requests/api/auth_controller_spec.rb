require 'rails_helper'

RSpec.describe "Auth API", type: :request do
  describe "POST /api/auth/login" do
    context "with valid credentials" do
      it "returns success with user data" do
        user = FactoryBot.create(:user)

        post "/api/auth/login", params: {
          user: { email: user.email, password: "password123" }
        }

        expect(response).to have_http_status(:success)
        expect(json_response["user"]["email"]).to eq(user.email)
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized for wrong password" do
        user = FactoryBot.create(:user)

        post "/api/auth/login", params: {
          user: { email: user.email, password: "wrong" }
        }

        expect(response).to have_http_status(:unauthorized)
      end

      it "returns unauthorized for invalid email" do
        post "/api/auth/login", params: {
          user: { email: "wrong@email.com", password: "any" }
        }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/auth/current_user" do
    context "with authenticated user" do
      it "returns user data" do
        user = FactoryBot.create(:user)
        sign_in user

        get "/api/auth/current_user", headers: {
          'Accept' => 'application/json',
          'Content-Type' => 'application/json'
        }

        expect(response).to have_http_status(:success)
        expect(json_response["user"]["email"]).to eq(user.email)
      end
    end

    context "without authentication" do
      it "returns unauthorized" do
        get "/api/auth/current_user"
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "DELETE /api/auth/logout" do
    context "with authenticated user" do
      it "logs out successfully" do
        user = FactoryBot.create(:user)
        sign_in user

        delete "/api/auth/logout", headers: {
          'Accept' => 'application/json',
          'Content-Type' => 'application/json'
        }

        expect(response).to have_http_status(:success)
        expect(json_response["message"]).to eq("Logged out successfully.")
      end
    end

    context "without authentication" do
      it "returns success" do
        delete "/api/auth/logout"
        expect(response).to have_http_status(:success)
      end
    end
  end
end