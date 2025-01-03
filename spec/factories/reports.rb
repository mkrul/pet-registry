FactoryBot.define do
  factory :report do
    title { "Test Report" }
    description { "Test Description" }
    status { "active" }
    country { "USA" }
    state { "California" }
    area { "Los Angeles" }
    species { "dog" }
    breed_1 { "Labrador Retriever" }
    color_1 { "Black" }
    latitude { 34.0522 }
    longitude { -118.2437 }
  end
end