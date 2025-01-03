require 'rails_helper'

RSpec.describe ColorList do
  class TestModel
    include ActiveModel::Model
    include ColorList

    attr_accessor :color_1, :color_2, :color_3
  end

  describe "color validation" do
    context "with valid colors" do
      it "accepts known colors" do
        stub_const("ColorList::COLORS", ['Black', 'White', 'Brown'].freeze)

        model = TestModel.new(
          color_1: "Black",
          color_2: "White",
          color_3: "Brown"
        )

        model.validate_colors

        expect(model.errors).to be_empty
      end
    end

    context "with invalid colors" do
      it "rejects unknown colors" do
        stub_const("ColorList::COLORS", ['Black', 'White', 'Brown'].freeze)

        model = TestModel.new(
          color_1: "Invalid",
          color_2: "Unknown",
          color_3: "Wrong"
        )

        model.validate_colors

        expect(model.errors[:base]).to include("Invalid is not a valid color")
        expect(model.errors[:base]).to include("Unknown is not a valid color")
        expect(model.errors[:base]).to include("Wrong is not a valid color")
      end
    end

    context "with partial colors" do
      it "validates only present colors" do
        stub_const("ColorList::COLORS", ['Black', 'White', 'Brown'].freeze)

        model = TestModel.new(
          color_1: "Black",
          color_2: nil,
          color_3: "White"
        )

        model.validate_colors

        expect(model.errors).to be_empty
      end
    end

    context "with no colors" do
      it "skips validation" do
        stub_const("ColorList::COLORS", ['Black', 'White', 'Brown'].freeze)

        model = TestModel.new(
          color_1: nil,
          color_2: nil,
          color_3: nil
        )

        model.validate_colors

        expect(model.errors).to be_empty
      end
    end
  end

  describe ".valid_colors" do
    it "returns all valid colors" do
      stub_const("ColorList::COLORS", ['Black', 'White', 'Brown'].freeze)

      colors = TestModel.valid_colors
      expect(colors).to match_array(['Black', 'White', 'Brown'])
    end
  end
end