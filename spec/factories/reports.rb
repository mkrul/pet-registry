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
    gender { "male" }
    latitude { 34.0522 }
    longitude { -118.2437 }

    trait :cat do
      species { "cat" }
      breed_1 { "Siamese" }
    end
  end
end