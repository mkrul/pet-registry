require 'rails_helper'

RSpec.describe SpeciesList do
  class TestModel
    include ActiveModel::Model
    include SpeciesList

    attr_accessor :species
    validates :species, presence: true
  end

  describe "species validation" do
    context "with valid species" do
      it "accepts known species" do
        stub_const("SpeciesList::SPECIES", ['Dog', 'Cat'].freeze)

        model = TestModel.new(species: "Dog")
        model.validate_species

        expect(model.errors).to be_empty
      end
    end

    context "with invalid species" do
      it "rejects unknown species" do
        stub_const("SpeciesList::SPECIES", ['Dog', 'Cat'].freeze)

        model = TestModel.new(species: "Bird")
        model.validate_species

        expect(model.errors[:species]).to include("must be one of: Dog, Cat")
      end
    end

    context "with missing species" do
      it "allows nil species" do
        stub_const("SpeciesList::SPECIES", ['Dog', 'Cat'].freeze)

        model = TestModel.new(species: nil)
        model.validate_species

        expect(model.errors).to be_empty
      end
    end

    context "with case variations" do
      it "handles case-sensitive matching" do
        stub_const("SpeciesList::SPECIES", ['Dog', 'Cat'].freeze)

        model = TestModel.new(species: "dog")
        model.validate_species

        expect(model.errors[:species]).to include("must be one of: Dog, Cat")
      end
    end
  end

  describe ".valid_species" do
    it "returns all valid species" do
      stub_const("SpeciesList::SPECIES", ['Dog', 'Cat'].freeze)

      species = TestModel.valid_species
      expect(species).to match_array(['Dog', 'Cat'])
    end
  end
end