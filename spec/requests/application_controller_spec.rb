require 'rails_helper'

RSpec.describe "Application", type: :request do
  describe "Error Handling" do
    context "with record not found" do
      it "returns 404 status" do
        get "/api/reports/0", as: :json
        expect(response).to have_http_status(:not_found)
      end
    end

    context "with invalid parameters" do
      it "returns 422 status" do
        post "/api/reports",
          params: { report: { invalid: true } },
          as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["errors"]).to be_present
      end
    end
  end

  describe "CORS Headers" do
    it "includes CORS headers" do
      get "/api/reports",
        headers: { "Origin": "http://localhost:3000" },
        as: :json

      expect(response.headers["Access-Control-Allow-Origin"]).to eq("http://localhost:3000")
      expect(response.headers["Access-Control-Allow-Methods"]).to include("GET")
    end
  end
end