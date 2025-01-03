require 'rails_helper'

RSpec.describe BreedList do
  class TestModel
    include ActiveModel::Model
    include BreedList

    attr_accessor :species, :breed_1, :breed_2
  end

  describe "breed validation" do
    context "with valid dog breeds" do
      it "accepts known breeds" do
        stub_const("BreedList::BREEDS", {
          'dog' => ['Labrador Retriever', 'German Shepherd'],
          'cat' => ['Persian', 'Siamese']
        }.freeze)

        model = TestModel.new(
          species: "dog",
          breed_1: "labrador retriever",
          breed_2: "german shepherd"
        )

        model.validate_breeds

        expect(model.errors).to be_empty
      end
    end

    context "with invalid dog breeds" do
      it "rejects unknown breeds" do
        stub_const("BreedList::BREEDS", {
          'dog' => ['Labrador Retriever', 'German Shepherd'],
          'cat' => ['Persian', 'Siamese']
        }.freeze)

        model = TestModel.new(
          species: "dog",
          breed_1: "Invalid Breed",
          breed_2: "Unknown Dog"
        )

        model.validate_breeds

        expect(model.errors[:breed_1]).to include("is not a valid breed for dog")
        expect(model.errors[:breed_2]).to include("is not a valid breed for dog")
      end
    end

    context "with valid cat breeds" do
      it "accepts known breeds" do
        stub_const("BreedList::BREEDS", {
          'dog' => ['Labrador Retriever', 'German Shepherd'],
          'cat' => ['Persian', 'Siamese']
        }.freeze)

        model = TestModel.new(
          species: "cat",
          breed_1: "persian",
          breed_2: "siamese"
        )

        model.validate_breeds

        expect(model.errors).to be_empty
      end
    end

    context "with mixed case breeds" do
      it "handles case-insensitive matching" do
        stub_const("BreedList::BREEDS", {
          'dog' => ['Labrador Retriever', 'German Shepherd'],
          'cat' => ['Persian', 'Siamese']
        }.freeze)

        model = TestModel.new(
          species: "dog",
          breed_1: "LABRADOR RETRIEVER",
          breed_2: "german shepherd"
        )

        model.validate_breeds

        expect(model.errors).to be_empty
      end
    end

    context "with missing species" do
      it "skips validation" do
        stub_const("BreedList::BREEDS", {
          'dog' => ['Labrador Retriever', 'German Shepherd'],
          'cat' => ['Persian', 'Siamese']
        }.freeze)

        model = TestModel.new(
          breed_1: "Unknown",
          breed_2: "Invalid"
        )

        model.validate_breeds

        expect(model.errors).to be_empty
      end
    end
  end

  describe ".valid_breeds_for" do
    it "returns breeds for valid species" do
      stub_const("BreedList::BREEDS", {
        'dog' => ['Labrador Retriever', 'German Shepherd'],
        'cat' => ['Persian', 'Siamese']
      }.freeze)

      breeds = TestModel.valid_breeds_for("dog")
      expect(breeds).to eq(['Labrador Retriever', 'German Shepherd'])
    end

    it "returns empty array for invalid species" do
      stub_const("BreedList::BREEDS", {
        'dog' => ['Labrador Retriever', 'German Shepherd'],
        'cat' => ['Persian', 'Siamese']
      }.freeze)

      breeds = TestModel.valid_breeds_for("invalid")
      expect(breeds).to be_empty
    end
  end

  describe ".all_breeds" do
    it "returns all breeds" do
      stub_const("BreedList::BREEDS", {
        'dog' => ['Labrador Retriever', 'German Shepherd'],
        'cat' => ['Persian', 'Siamese']
      }.freeze)

      breeds = TestModel.all_breeds
      expect(breeds).to match_array([
        'Labrador Retriever',
        'German Shepherd',
        'Persian',
        'Siamese'
      ])
    end
  end
end