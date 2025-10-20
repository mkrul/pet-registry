require 'rails_helper'

RSpec.describe Report, type: :model do
  context 'when creating a valid report' do
    it 'saves with required attributes' do
      report = FactoryBot.build(:report)
      expect(report.save).to be true
    end
  end

  context 'when title is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, title: nil)
      expect(report.valid?).to be false
      expect(report.errors[:title]).to include("cannot be blank")
    end
  end

  context 'when title exceeds 50 characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, title: 'a' * 51)
      expect(report.valid?).to be false
      expect(report.errors[:title]).to include("must be 50 characters or less")
    end
  end

  context 'when description is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, description: nil)
      expect(report.valid?).to be false
      expect(report.errors[:description]).to include("cannot be blank")
    end
  end

  context 'when description exceeds 500 characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, description: 'a' * 501)
      expect(report.valid?).to be false
      expect(report.errors[:description]).to include("must be 500 characters or less")
    end
  end

  context 'when species is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, species: nil)
      expect(report.valid?).to be false
      expect(report.errors[:species]).to include("cannot be blank")
    end
  end

  context 'when species is not dog or cat' do
    it 'is invalid' do
      report = FactoryBot.build(:report, species: 'bird')
      expect(report.valid?).to be false
      expect(report.errors[:species]).to include("must be either dog or cat")
    end
  end

  context 'when breed_1 is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, breed_1: nil)
      expect(report.valid?).to be false
      expect(report.errors[:breed_1]).to include("cannot be blank")
    end
  end

  context 'when color_1 is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, color_1: nil)
      expect(report.valid?).to be false
      expect(report.errors[:color_1]).to include("cannot be blank")
    end
  end

  context 'when status is missing' do
    it 'is invalid' do
      report = FactoryBot.build(:report, status: nil)
      expect(report.valid?).to be false
      expect(report.errors[:status]).to include("can't be blank")
    end
  end

  context 'when status is not active or archived' do
    it 'is invalid' do
      report = FactoryBot.build(:report, status: 'pending')
      expect(report.valid?).to be false
      expect(report.errors[:status]).to include("must be either active or archived")
    end
  end

  context 'when microchip_id is not unique' do
    it 'is invalid' do
      existing_report = FactoryBot.create(:report, microchip_id: '123')
      new_report = FactoryBot.build(:report, microchip_id: '123')
      expect(new_report.valid?).to be false
      expect(new_report.errors[:microchip_id]).to include("ID is already registered")
    end
  end

  context 'when microchip_id exceeds 35 characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, microchip_id: 'a' * 36)
      expect(report.valid?).to be false
      expect(report.errors[:microchip_id]).to include("ID must be 35 characters or less")
    end
  end

  context 'when microchip_id contains invalid characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, microchip_id: 'abc@123')
      expect(report.valid?).to be false
      expect(report.errors[:microchip_id]).to include("ID can only contain letters, numbers, and hyphens")
    end
  end

  context 'when name exceeds 30 characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, name: 'a' * 31)
      expect(report.valid?).to be false
      expect(report.errors[:name]).to include("must be 30 characters or less")
    end
  end

  context 'when name contains invalid characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, name: 'John@Doe')
      expect(report.valid?).to be false
      expect(report.errors[:name]).to include("can only contain letters, numbers, spaces, hyphens, and periods")
    end
  end

  context 'when name contains periods and hyphens' do
    it 'is valid' do
      report = FactoryBot.build(:report, name: 'Mr. Fluffy-Paws')
      expect(report.valid?).to be true
    end
  end

  context 'when breed_1 is invalid for species' do
    it 'is invalid' do
      report = FactoryBot.build(:report, species: 'dog', breed_1: 'InvalidBreed')
      expect(report.valid?).to be false
      expect(report.errors[:breed_1]).to include("is not a valid breed for dog")
    end
  end

  context 'when breed_2 is invalid for species' do
    it 'is invalid' do
      report = FactoryBot.build(:report, species: 'cat', breed_2: 'InvalidBreed')
      expect(report.valid?).to be false
      expect(report.errors[:breed_2]).to include("is not a valid breed for cat")
    end
  end

  context 'when gender is invalid' do
    it 'is invalid' do
      report = FactoryBot.build(:report, gender: 'invalid')
      expect(report.valid?).to be false
      expect(report.errors[:gender]).to include("must be one of: male, female, unknown")
    end
  end

  context 'when image exceeds size limit' do
    it 'is invalid' do
      report = FactoryBot.build(:report)
      report.image.attach(io: StringIO.new('a' * 6.megabytes), filename: 'test.jpg', content_type: 'image/jpeg')
      expect(report.valid?).to be false
      expect(report.errors[:image]).to include("must be less than 5MB")
    end
  end

  context 'when image has invalid format' do
    it 'is invalid' do
      report = FactoryBot.build(:report)
      report.image.attach(io: StringIO.new('test'), filename: 'test.pdf', content_type: 'application/pdf')
      expect(report.valid?).to be false
      expect(report.errors[:image]).to include("must be a JPEG, PNG, or GIF")
    end
  end

  context 'when colors are not unique' do
    it 'is invalid' do
      report = FactoryBot.build(:report, color_1: 'black', color_2: 'black')
      expect(report.valid?).to be false
      expect(report.errors[:base]).to include("Each color must be unique. Duplicate colors found: black")
    end
  end

  context 'when location data is incomplete' do
    it 'is invalid' do
      report = FactoryBot.build(:report, latitude: 47.6062, longitude: nil)
      expect(report.valid?).to be false
      expect(report.errors[:longitude]).to include("cannot be blank")
    end
  end

  context 'when normalizing attributes' do
    it 'downcases string values' do
      report = FactoryBot.build(:report, species: 'DOG', color_1: 'BLACK')
      report.valid?
      expect(report.species).to eq('dog')
      expect(report.color_1).to eq('black')
    end
  end

  context 'when reindexing after commit' do
    it 'triggers reindex' do
      report = FactoryBot.create(:report)
      expect(report).to receive(:reindex)
      report.save
    end
  end

  context 'when building search data' do
    it 'includes all searchable fields' do
      report = FactoryBot.build(:report)
      search_data = report.search_data
      expect(search_data.keys).to include(:title, :description, :species, :breed_1, :breed_2, :color_1, :color_2, :color_3, :name, :gender, :status, :country, :state, :area, :updated_at, :created_at)
    end
  end

  context 'when breed list file is missing' do
    it 'uses default empty breed list' do
      allow(File).to receive(:exist?).and_return(false)
      report = FactoryBot.build(:report)
      expect(Report.valid_breeds_for('dog')).to eq([])
    end
  end

  context 'when breed list file is corrupted' do
    it 'uses default empty breed list' do
      allow(File).to receive(:read).and_raise(JSON::ParserError)
      report = FactoryBot.build(:report)
      expect(Report.valid_breeds_for('cat')).to eq([])
    end
  end

  context 'when country is not United States' do
    it 'requires state' do
      report = FactoryBot.build(:report, country: 'Canada', state: nil)
      expect(report.valid?).to be false
      expect(report.errors[:state]).to include("cannot be blank")
    end
  end

  context 'when color is invalid' do
    it 'adds base error' do
      report = FactoryBot.build(:report, color_1: 'invalid_color')
      expect(report.valid?).to be false
      expect(report.errors[:base]).to include("invalid_color is not a valid color")
    end
  end

  context 'when normalizing blank values' do
    it 'returns nil' do
      report = FactoryBot.build(:report, color_2: ' ')
      report.valid?
      expect(report.color_2).to be_nil
    end
  end

  context 'when intersection exceeds 100 characters' do
    it 'is invalid' do
      report = FactoryBot.build(:report, intersection: 'a' * 101)
      expect(report.valid?).to be false
      expect(report.errors[:intersection]).to include("must be 100 characters or less")
    end
  end

  context 'when searchkick settings are configured' do
    it 'has correct search settings' do
      expect(Report.searchkick_options[:word_middle]).to eq([:breed_1, :breed_2, :description, :title])
      expect(Report.searchkick_options[:filterable]).to include(:species, :gender, :color_1, :color_2, :color_3, :status, :country, :state, :area, :breed_1, :breed_2)
    end
  end

  context 'when image is not attached' do
    it 'is valid' do
      report = FactoryBot.build(:report)
      report.image = nil
      expect(report.valid?).to be true
    end
  end

  context 'when normalizing nil values' do
    it 'returns nil' do
      report = FactoryBot.build(:report, color_3: nil)
      report.valid?
      expect(report.color_3).to be_nil
    end
  end
end
