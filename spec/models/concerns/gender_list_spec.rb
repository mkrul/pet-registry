require 'rails_helper'

RSpec.describe GenderList do
  class TestModel
    include ActiveModel::Model
    include GenderList

    attr_accessor :gender
  end

  describe "gender validation" do
    context "with valid gender" do
      it "accepts known genders" do
        stub_const("GenderList::GENDERS", ['Male', 'Female', 'Unknown'].freeze)

        model = TestModel.new(gender: "Male")
        model.validate_gender

        expect(model.errors).to be_empty
      end
    end

    context "with invalid gender" do
      it "rejects unknown gender" do
        stub_const("GenderList::GENDERS", ['Male', 'Female', 'Unknown'].freeze)

        model = TestModel.new(gender: "Invalid")
        model.validate_gender

        expect(model.errors[:gender]).to include("must be one of: Male, Female, Unknown")
      end
    end

    context "with missing gender" do
      it "skips validation" do
        stub_const("GenderList::GENDERS", ['Male', 'Female', 'Unknown'].freeze)

        model = TestModel.new(gender: nil)
        model.validate_gender

        expect(model.errors).to be_empty
      end
    end

    context "with case variations" do
      it "accepts case-insensitive matching" do
        stub_const("GenderList::GENDERS", ['Male', 'Female', 'Unknown'].freeze)

        model = TestModel.new(gender: "male")
        model.validate_gender

        expect(model.errors).to be_empty
      end
    end
  end

  describe ".valid_genders" do
    it "returns all valid genders" do
      stub_const("GenderList::GENDERS", ['Male', 'Female', 'Unknown'].freeze)

      genders = TestModel.valid_genders
      expect(genders).to match_array(['Male', 'Female', 'Unknown'])
    end
  end
end