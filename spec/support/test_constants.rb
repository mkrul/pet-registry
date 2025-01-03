# Create a module for test data
module TestData
  SPECIES = ['Dog', 'Cat'].freeze
  COLORS = ['Black', 'White'].freeze
  GENDERS = ['Male', 'Female'].freeze
end

# Prepend modules to override constant lookup
module SpeciesListTest
  def self.prepended(base)
    base.const_set(:SPECIES, TestData::SPECIES)
  end
end

module ColorListTest
  def self.prepended(base)
    base.const_set(:COLORS, TestData::COLORS)
  end
end

module GenderListTest
  def self.prepended(base)
    base.const_set(:GENDERS, TestData::GENDERS)
  end
end

# Prepend test modules in test environment only
if Rails.env.test?
  SpeciesList.prepend(SpeciesListTest)
  ColorList.prepend(ColorListTest)
  GenderList.prepend(GenderListTest)
end