require 'rails_helper'

RSpec.describe "Filters API", type: :request do
  describe "GET /api/filters/states" do
    context "with existing reports" do
      it "returns states for country" do
        FactoryBot.create(:report, state: "Texas")
        FactoryBot.create(:report, state: "California")

        get "/api/filters/states", params: { country: "USA" }

        expect(response).to have_http_status(:success)
        expect(json_response["states"]).to match_array(["California", "Texas"])
      end
    end

    context "without matching reports" do
      it "returns empty array" do
        get "/api/filters/states", params: { country: "Unknown" }

        expect(response).to have_http_status(:success)
        expect(json_response["states"]).to eq([])
      end
    end
  end

  describe "GET /api/filters/cities" do
    context "with existing reports" do
      it "returns cities for state" do
        FactoryBot.create(:report, area: "San Francisco")
        FactoryBot.create(:report, area: "Los Angeles")

        get "/api/filters/cities", params: {
          country: "USA",
          state: "California"
        }

        expect(response).to have_http_status(:success)
        expect(json_response["cities"]).to match_array(["Los Angeles", "San Francisco"])
      end
    end

    context "without matching reports" do
      it "returns empty array" do
        get "/api/filters/cities", params: {
          country: "USA",
          state: "Unknown"
        }

        expect(response).to have_http_status(:success)
        expect(json_response["cities"]).to eq([])
      end
    end
  end

  describe "GET /api/filters/breeds" do
    context "with valid species" do
      it "returns dog breeds" do
        get "/api/filters/breeds", params: { species: "dog" }

        expect(response).to have_http_status(:success)
        expect(json_response["breeds"]).not_to be_empty
      end

      it "returns cat breeds" do
        get "/api/filters/breeds", params: { species: "cat" }

        expect(response).to have_http_status(:success)
        expect(json_response["breeds"]).not_to be_empty
      end
    end

    context "with invalid species" do
      it "returns empty array" do
        get "/api/filters/breeds", params: { species: "invalid" }

        expect(response).to have_http_status(:success)
        expect(json_response["breeds"]).to eq([])
      end
    end

    context "without species param" do
      it "returns empty array" do
        get "/api/filters/breeds"

        expect(response).to have_http_status(:success)
        expect(json_response["breeds"]).to eq([])
      end
    end
  end
end