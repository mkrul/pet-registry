# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

require 'open-uri'
gem 'progress_bar'

if !Rails.env.production?
  print('Purging old seed data...')

  reports = Report.all
  reports.each do |report|
    bar = ProgressBar.new(reports.count)
    Reports::Destroy.run!(report: report)
    bar.increment!
  end

  print('Seeding database with sample data...')
  bar = ProgressBar.new(25)

  report01 = Reports::Create.run(
    title: 'Lost Dog',
    description: "My dog got out of the yard and I can't find him. He is a Pit Bull / Boxer mix, about 50 lbs, and is very friendly.  However, he is dog aggressive / reactive.  He is wearing a blue collar with a tag that has my name and phone number on it.",
    name: 'Phantom',
    status: 'active',
    species: 'Dog',
    gender: 'Male (neutered)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: 'Boxer',
    color_1: 'Grey',
    color_2: 'White',
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report01.jpg',
    ]
  )
  report01.result.update_columns(created_at: Time.now - 1.day, updated_at: Time.now - 1.day)
  bar.increment!

  report02 = Reports::Create.run(
    title: '🐶 Help me find my dog!!',
    description: "My beagle mix has gone missing.  He's pretty small, brown and white, and doesn't like men.  He's wearing a rainbow colored harness.",
    name: 'Buddy',
    status: 'active',
    species: 'Dog',
    gender: 'Male (neutered)',
    breed_1: 'Beagle',
    breed_2: 'Mixed Breed',
    color_1: 'Brown',
    color_2: 'White',
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report02.jpg',
    ]
  )
  report02.result.update_columns(created_at: Time.now - 3.days, updated_at: Time.now - 1.day)
  bar.increment!

  report03 = Reports::Create.run(
    title: 'Found a dog on the street',
    description: "I found a dog wandering around the neighborhood.  He's a tiny little guy.  Appears to be some sort of chihuahua mix.  Medium white fur.  He is kind of timid but very sweet.",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Male',
    breed_1: 'Chihuahua',
    breed_2: nil,
    color_1: 'White',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report03.jpg',
    ]
  )
  report03.result.update_columns(created_at: Time.now - 5.days, updated_at: Time.now - 5.days)
  bar.increment!

  report04 = Reports::Create.run(
    title: 'Golden Retriever found',
    description: "I found a golden retriever wandering around the park.  He's a big guy, very friendly.  Did not have a collar on when we found him and we're not sure if he's microchipped.",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Male (neutered)',
    breed_1: 'Golden Retriever',
    breed_2: nil,
    color_1: 'Yellow',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report04.jpg',
    ]
  )
  report04.result.update_columns(created_at: Time.now - 6.days, updated_at: Time.now - 5.days)
  bar.increment!

  report05 = Reports::Create.run(
    title: 'Lost my Siberian Husky 😢',
    description: "My dog Zara jumped the fence in our back yard while we were making dinner last night. She is a spayed Siberian Husky.",
    name: 'Zeus',
    status: 'active',
    species: 'Dog',
    gender: 'Female',
    breed_1: 'Siberian Husky',
    breed_2: nil,
    color_1: 'Grey',
    color_2: 'White',
    color_3: 'Black',
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report05.jpg',
    ]
  )
  report05.result.update_columns(created_at: Time.now - 9.days, updated_at: Time.now - 7.days)
  bar.increment!

  report06 = Reports::Create.run(
    title: 'Find my dog please!!',
    description: "Missing dog. He is a large bully / dalmatian mix. He is very friendly and loves people. He is wearing a red collar with a tag that has my contact information on it, and he is microchipped.",
    name: 'Freckles',
    status: 'active',
    species: 'Dog',
    gender: 'Male (intact)',
    breed_1: 'American Bulldog',
    breed_2: 'Dalmatian',
    color_1: 'White',
    color_2: 'Black',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    created_at: Time.now - 10.days,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report06.jpg',
    ]
  )
  report06.result.update_columns(created_at: Time.now - 10.days, updated_at: Time.now - 10.days)
  bar.increment!

  report07 = Reports::Create.run(
    title: 'I found this black cat',
    description: "I found a black cat wandering around the neighborhood.  She is very friendly and seems to be well taken care of.  She has no collar on.",
    name: 'Unknown',
    status: 'active',
    species: 'Cat',
    gender: 'Female',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'Black',
    color_2: 'White',
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report07.jpg',
    ]
  )
  report07.result.update_columns(created_at: Time.now - 10.days, updated_at: Time.now - 10.days)
  bar.increment!

  report08 = Reports::Create.run(
    title: 'Lost my cat',
    description: "My cat got out of the house and I can't find her. She is a small orange tabby cat named Melanie.  DO NOT CHASE!!!  She is very skittish and will run away from people.",
    name: 'Melanie',
    status: 'active',
    species: 'Cat',
    gender: 'Female (spayed)',
    breed_1: 'Tabby',
    breed_2: nil,
    color_1: 'Orange',
    color_2: 'White',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report08.jpg',
    ]
  )
  report08.result.update_columns(created_at: Time.now - 4.days, updated_at: Time.now - 1.day)
  bar.increment!

  report09 = Reports::Create.run(
    title: 'Stray kitty',
    description: "Stray cat found by my garage last weekend. Very sweet, not sure if boy or girl.  White brown and grey, short hair length.",
    name: 'Unknown',
    status: 'active',
    species: 'Cat',
    gender: 'Unknown',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'White',
    color_2: 'Brown',
    color_3: 'Grey',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report09.jpg',
    ]
  )
  report09.result.update_columns(created_at: Time.now - 4.days, updated_at: Time.now - 4.days)
  bar.increment!

  report10 = Reports::Create.run(
    title: 'HELP!!! I lost my cat!!',
    description: "She is an outdoor cat and has been missing for a few days. She is a small black and white cat named Oreo.  She is very friendly and loves people.",
    name: 'Oreo',
    status: 'active',
    species: 'Cat',
    gender: 'Female (spayed)',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'Black',
    color_2: 'White',
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report10.jpg',
    ]
  )
  report10.result.update_columns(created_at: Time.now - 6.days, updated_at: Time.now - 6.days)
  bar.increment!

  report11 = Reports::Create.run(
    title: 'Found a very friendly beagle mix off of Turner Road',
    description: "We were driving north toward Jones road and saw a beagle wandering near the woodline.  We baited her closer to our car with some treats and took her back to our house.  She's currently chilling in the garage with our cat right now.  Please come get her!",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Female',
    breed_1: 'Beagle',
    breed_2: nil,
    color_1: 'Brown',
    color_2: 'White',
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report11.jpg',
    ]
  )
  report11.result.update_columns(created_at: Time.now - 20.days, updated_at: Time.now - 20.days)
  bar.increment!

  report12 = Reports::Create.run(
    title: 'Help me find Max the shepherd mix',
    description: "Max got out again and I can't find him! He is a mixed breed, but we think he might be a German Shepherd / Australian Shepherd mix, with maybe some pit bull.  He's about 80 lbs.  Last we saw him he wasn't wearing his collar :( but he is microchipped!",
    name: 'Max',
    status: 'active',
    species: 'Dog',
    gender: 'Male (intact)',
    breed_1: 'German Shepherd Dog',
    breed_2: 'Australian Shepherd',
    color_1: 'Tan',
    color_2: 'Black',
    color_3: "Brown",
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report12.jpg',
    ]
  )
  report12.result.update_columns(created_at: Time.now - 22.days, updated_at: Time.now - 12.days)
  bar.increment!

  report13 = Reports::Create.run(
    title: 'My German Shepherd Mix ran away from home - please help us find him!',
    description: "Our dog got out of the yard and we can't find him. He is a German Shepherd / Labrador Retriever mix",
    name: 'Simba',
    status: 'active',
    species: 'Dog',
    gender: 'Male (neutered)',
    breed_1: 'German Shepherd Dog',
    breed_2: 'Labrador Retriever',
    color_1: 'Yellow',
    color_2: 'White',
    color_3: 'Tan',
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report13.jpg',
    ]
  )
  report13.result.update_columns(created_at: Time.now - 29.days, updated_at: Time.now - 29.days)
  bar.increment!

  report14 = Reports::Create.run(
    title: 'Lost my scruffy little scottie girl :(',
    description: "My furbaby Molly was last seen running down Grandview Avenue.  She is a Scottish Terrier / Schnauzer mix, about 20 lbs.  Super friendly and sweet girl, please help us find her.",
    name: 'Molly',
    status: 'active',
    species: 'Dog',
    gender: 'Female (spayed)',
    breed_1: 'Scottish Terrier',
    breed_2: 'Schnauzer',
    color_1: 'Black',
    color_2: 'Grey',
    color_3: 'White',
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report14.jpg',
    ]
  )
  report14.result.update_columns(created_at: Time.now - 36.days, updated_at: Time.now - 36.days)
  bar.increment!

  report15 = Reports::Create.run(
    title: 'Missing Greyhound mix',
    description: "My girlfriend's greyhound mix took off after a rabbit and we can't find him.  He is a greyhound / lab mix, about 70 lbs.  He will chase cats but is otherwise very friendly.",
    name: 'Tiger',
    status: 'active',
    species: 'Dog',
    gender: 'Male (neutered)',
    breed_1: 'Greyhound',
    breed_2: nil,
    color_1: 'Brindle',
    color_2: 'Black',
    color_3: 'Tan',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report15.jpg',
    ]
  )
  report15.result.update_columns(created_at: Time.now - 37.days, updated_at: Time.now - 3.days)
  bar.increment!

  report16 = Reports::Create.run(
    title: 'My Chihuahua / Pomeranian mix ran away',
    description: "My little dog ran away last week and we have searched all over town and can't find him.  He is a Chihuahua / Pomeranian mix and weighs about 10 lbs. Please contact me if you see him.",
    name: 'Francis',
    status: 'active',
    species: 'Dog',
    gender: 'Male',
    breed_1: 'Chihuahua',
    breed_2: 'Pomeranian',
    color_1: 'Brown',
    color_2: 'White',
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report16.jpg',
    ]
  )
  report16.result.update_columns(created_at: Time.now - 40.days, updated_at: Time.now - 21.days)
  bar.increment!

  report17 = Reports::Create.run(
    title: 'Lost my sweet pibble mix 😭😭',
    description: "My angel furbaby busted out of the house to chase after a cat and we haven't seen her since.  If you happen to find her please let us know!! She used to be a bait dog but don't don't let that scare you. She is very sweet and wouldn't hurt a fly!",
    name: 'Mauly',
    status: 'active',
    species: 'Dog',
    gender: 'Female (intact)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: nil,
    color_1: 'Grey',
    color_2: 'White',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report17.jpg',
    ]
  )
  report17.result.update_columns(created_at: Time.now - 41.days, updated_at: Time.now - 41.days)
  bar.increment!

  report18 = Reports::Create.run(
    title: 'Scruffy yellow dog',
    description: "Come get your dog! She's been hanging out in my shed for a few days now.  She's a scruffy little lady, yellow and brownish with some white on her face.",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Female',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'Yellow',
    color_2: 'White',
    color_3: 'Brown',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report18.jpg',
    ]
  )
  report18.result.update_columns(created_at: Time.now - 45.days, updated_at: Time.now - 45.days)
  bar.increment!

  report19 = Reports::Create.run(
    title: 'Pitty pup',
    description: "Our pit bull jumped out of my dad's truck and he ran off.  It was near the park on 5th street.  He is a big friendly goofball with all white fur and is wearing a green collar.",
    name: 'Orion',
    status: 'active',
    species: 'Dog',
    gender: 'Male (intact)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: 'American Bully',
    color_1: 'White',
    color_2: nil,
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report19.jpg',
    ]
  )
  report19.result.update_columns(created_at: Time.now - 47.days, updated_at: Time.now - 47.days)
  bar.increment!

  report20 = Reports::Create.run(
    title: 'this is a Siamese cat i found',
    description: "I found a Siamese cat trying to get into the trash can by my house. She doesn't have a collar.",
    name: 'Unknown',
    status: 'active',
    species: 'Cat',
    gender: 'Unknown',
    breed_1: 'Siamese',
    breed_2: nil,
    color_1: 'White',
    color_2: 'Brown',
    color_3: 'Black',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report20.jpg',
    ]
  )
  report20.result.update_columns(created_at: Time.now - 53.days, updated_at: Time.now - 5.days)
  bar.increment!

  report21 = Reports::Create.run(
    title: 'Lost my cat, please help me find him',
    description: "My cat got out of the house and I can't find him. He is a long haired cat wearing a green collar with a little bell on it.",
    name: 'Bob',
    status: 'active',
    species: 'Cat',
    gender: 'Male',
    breed_1: 'Persian',
    breed_2: nil,
    color_1: 'Grey',
    color_2: 'White',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report21.jpg',
    ]
  )
  report21.result.update_columns(created_at: Time.now - 60.days, updated_at: Time.now - 60.days)
  bar.increment!

  report22 = Reports::Create.run(
    title: 'Discovered this very sweet black kitty in my backyard',
    description: "I have never seen this kitty before but she is very friendly and seems to be well taken care of.  She has no collar on.",
    name: 'Unknown',
    status: 'active',
    species: 'Cat',
    gender: 'Unknown',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'Black',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report22.jpg',
    ]
  )
  report22.result.update_columns(created_at: Time.now - 64.days, updated_at: Time.now - 64.days)
  bar.increment!

  report23 = Reports::Create.run(
    title: 'Sweet puppy found',
    description: "I have no idea who owns this previous baby but I hope I can find his owner soon! I found him outside of a restaraunt on Main Street. I have no idea what breed he is, maybe a husky german shepherd mix?",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Male',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'Brown',
    color_2: 'White',
    color_3: 'Grey',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report23.jpg',
    ]
  )
  report23.result.update_columns(created_at: Time.now - 71.days, updated_at: Time.now - 71.days)
  bar.increment!

  report24 = Reports::Create.run(
    title: 'My goldie girl has gone missing',
    description: "Pleease helpe me find my baby, she ran away last friday and I miss her so much.!!",
    name: 'Petunia',
    status: 'active',
    species: 'Dog',
    gender: 'Female',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'Yellow',
    color_2: nil,
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    created_at: Time.now - 75.days,
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report24.jpg',
    ]
  )
  report24.result.update_columns(created_at: Time.now - 75.days, updated_at: Time.now - 75.days)
  bar.increment!

  report25 = Reports::Create.run(
    title: 'Bo is missing!',
    description: "My dog Bo got out of the yard and I can't find him. He is a doodle wearing a blue bandana.",
    name: 'Bo',
    status: 'active',
    species: 'Dog',
    gender: 'Male',
    breed_1: 'Labradoodle',
    breed_2: nil,
    color_1: 'White',
    color_2: 'Brown',
    color_3: nil,
    microchipped: true,
    microchip_id: SecureRandom.hex(15),
    archived_at: nil,
    image_urls: [
      '/app/lib/assets/reports/report25.jpg',
    ]
  )
  report25.result.update_columns(created_at: Time.now - 76.days, updated_at: Time.now - 1.day)
  bar.increment!
end