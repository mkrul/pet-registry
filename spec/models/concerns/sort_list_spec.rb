require 'rails_helper'

RSpec.describe SortList do
  class TestModel
    include ActiveModel::Model
    include SortList
  end

  describe ".valid_sort_options" do
    context "with configured options" do
      it "returns defined sort options" do
        stub_const("SortList::SORT_OPTIONS", [
          'created_at_desc',
          'created_at_asc',
          'updated_at_desc',
          'updated_at_asc'
        ].freeze)

        options = TestModel.valid_sort_options

        expect(options).to match_array([
          'created_at_desc',
          'created_at_asc',
          'updated_at_desc',
          'updated_at_asc'
        ])
      end
    end

    context "with empty options" do
      it "returns empty array" do
        stub_const("SortList::SORT_OPTIONS", [].freeze)

        options = TestModel.valid_sort_options

        expect(options).to be_empty
      end
    end

    context "with custom options" do
      it "returns custom sort fields" do
        stub_const("SortList::SORT_OPTIONS", [
          'name_asc',
          'name_desc',
          'status_asc',
          'status_desc'
        ].freeze)

        options = TestModel.valid_sort_options

        expect(options).to match_array([
          'name_asc',
          'name_desc',
          'status_asc',
          'status_desc'
        ])
      end
    end
  end
end