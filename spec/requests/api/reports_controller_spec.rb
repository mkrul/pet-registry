require 'rails_helper'

RSpec.describe "Reports API", type: :request do
  describe "GET /api/reports" do
    context "with search parameters" do
      it "filters by multiple criteria" do
        FactoryBot.create(:report, species: "dog", color_1: "black")
        FactoryBot.create(:report, :cat, color_1: "white")
        Report.reindex # Full reindex
        Report.searchkick_index.refresh

        get "/api/reports", params: {
          species: "dog",
          color: "black"
        }

        expect(response).to have_http_status(:success)
        expect(json_response["data"].length).to eq(1)
        expect(json_response["data"][0]["species"]).to eq("Dog")
      end

      it "handles location-based filtering" do
        report = FactoryBot.create(:report,
          country: "United States",
          state: "Washington",
          area: "Seattle"
        )
        Report.reindex
        Report.searchkick_index.refresh

        get "/api/reports", params: {
          country: report.country,
          state: report.state,
          area: report.area
        }

        expect(response).to have_http_status(:success)
        expect(json_response["data"].length).to eq(1)
        expect(json_response["data"][0]["area"]).to eq(report.area)
      end
    end
  end

  describe "GET /api/reports/new" do
    it "returns empty report template" do
      get "/api/reports/new"

      expect(response).to have_http_status(:success)
      expect(json_response).to include("id" => nil)
    end
  end

  describe "GET /api/reports/:id" do
    context "with existing report" do
      it "returns full report details" do
        report = FactoryBot.create(:report)

        get "/api/reports/#{report.id}"

        expect(response).to have_http_status(:success)
        expect(json_response).to include(
          "id" => report.id,
          "title" => report.title,
          "description" => report.description
        )
      end
    end

    context "with non-existent report" do
      it "returns not found" do
        get "/api/reports/0"

        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /api/reports" do
    context "with valid attributes" do
      it "creates report with all attributes" do
        valid_params = {
          title: "Lost Dog",
          description: "Golden retriever lost in park",
          species: "dog",
          breed_1: "Golden Retriever",
          color_1: "Golden",
          gender: "male",
          name: "Max",
          microchip_id: "123456789",
          area: "Central Park",
          state: "New York",
          country: "USA",
          latitude: 40.7829,
          longitude: -73.9654
        }

        post "/api/reports", params: valid_params

        expect(response).to have_http_status(:created)
        expect(json_response).to include(
          "title" => "Lost Dog",
          "species" => "Dog",
          "message" => "Report created successfully"
        )
      end
    end

    context "with invalid attributes" do
      it "validates required fields" do
        post "/api/reports", params: {}

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["errors"]).to include(
          "Description is required",
          "Species is required"
        )
      end

      it "validates breed format" do
        post "/api/reports", params: {
          title: "Test Report",
          description: "Test Description",
          species: "dog",
          breed_1: "Invalid Breed",
          color_1: "Black",
          gender: "male",
          country: "United States",
          state: "Washington",
          area: "Seattle"
        }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["errors"]).to include(/Breed 1 is not a valid breed/)
      end
    end
  end

  describe "PATCH /api/reports/:id" do
    context "with valid updates" do
      it "updates basic attributes" do
        report = FactoryBot.create(:report)

        patch "/api/reports/#{report.id}", params: {
          title: "Updated Title",
          description: report.description,
          species: report.species,
          breed_1: report.breed_1,
          color_1: report.color_1,
          gender: report.gender,
          country: "United States",
          state: "Washington",
          area: "Seattle",
          latitude: report.latitude,
          longitude: report.longitude
        }

        expect(response).to have_http_status(:success)
        expect(json_response["title"]).to eq("Updated Title")
      end
    end

    context "with invalid updates" do
      it "validates field formats" do
        report = FactoryBot.create(:report)

        patch "/api/reports/#{report.id}", params: {
          title: report.title,
          description: report.description,
          species: report.species,
          breed_1: report.breed_1,
          color_1: report.color_1,
          gender: report.gender,
          country: "United States",
          state: "Washington",
          area: "Seattle",
          microchip_id: "invalid!"
        }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response["errors"]).to include(/Microchip/)
      end
    end
  end

  describe "DELETE /api/reports/:id" do
    it "removes the report" do
      report = FactoryBot.create(:report)

      delete "/api/reports/#{report.id}"

      expect(response).to have_http_status(:no_content)
      expect(Report.exists?(report.id)).to be false
    end

    it "handles non-existent report" do
      delete "/api/reports/0"

      expect(response).to have_http_status(:not_found)
    end
  end
end