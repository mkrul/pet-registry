# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

require 'open-uri'
require 'progress_bar'
require_relative 'create_report'

unless Rails.env.production?
  print('Purging old seed data...')

  reports = Report.all
  bar = ProgressBar.new(reports.count)

  reports.each do |report|
    Reports::Destroy.run!(report: report)
    bar.increment! # Increment progress for each report destroyed
  end

  print('Seeding database with sample data...')
  bar = ProgressBar.new(25)

  report01 = CreateReport.new.call(
    title: 'Lost Dog',
    description: "My dog got out of the yard and I can't find him. He is a Pit Bull / Boxer mix, about 50 lbs, and is very friendly.  However, he is dog aggressive / reactive.  He is wearing a blue collar with a tag that has my name and phone number on it.",
    name: 'Phantom',
    status: 'active',
    species: 'dog',
    gender: 'Male (neutered)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: 'Boxer',
    color_1: 'grey',
    color_2: 'white',
    color_3: nil,
    microchipped: true,
    microchip_id: '7e66face07e025183b8a418cc96665',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report01.jpg'
  )
  bar.increment!

  report02 = CreateReport.new.call(
    title: '🐶 Help me find my dog!!',
    description: "My beagle mix has gone missing.  He's pretty small, brown and white, and doesn't like men.  He's wearing a rainbow colored harness.",
    name: 'Buddy',
    status: 'active',
    species: 'dog',
    gender: 'Male (neutered)',
    breed_1: 'Beagle',
    breed_2: 'Mixed Breed',
    color_1: 'brown',
    color_2: 'white',
    color_3: nil,
    microchipped: true,
    microchip_id: 'd1ad849b0c5bfe5fa0e4e669a7ce27',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report02.jpg'
  )
  bar.increment!

  report03 = CreateReport.new.call(
    title: 'Found dog in the street',
    description: "I found a dog wandering around the neighborhood.  He's a tiny little guy.  Appears to be some sort of chihuahua mix.  Medium white fur.  He is kind of timid but very sweet.",
    name: 'Unknown',
    status: 'active',
    species: 'dog',
    gender: 'Male',
    breed_1: 'Chihuahua',
    breed_2: nil,
    color_1: 'white',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report03.jpg'
  )
  bar.increment!

  report04 = CreateReport.new.call(
    title: 'Golden Retriever found',
    description: "I found a golden retriever wandering around the park.  He's a big guy, very friendly.  Did not have a collar on when we found him and we're not sure if he's microchipped.",
    name: 'Unknown',
    status: 'active',
    species: 'dog',
    gender: 'Male (neutered)',
    breed_1: 'Golden Retriever',
    breed_2: nil,
    color_1: 'yellow',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report04.jpg'
  )
  bar.increment!

  report05 = CreateReport.new.call(
    title: 'Lost my Siberian Husky 😢',
    description: "My dog Zara jumped the fence in our back yard while we were making dinner last night. She is a spayed Siberian Husky.",
    name: 'Zeus',
    status: 'active',
    species: 'dog',
    gender: 'Female',
    breed_1: 'Siberian Husky',
    breed_2: nil,
    color_1: 'grey',
    color_2: 'white',
    color_3: 'black',
    microchipped: true,
    microchip_id: 'a55da8e924ac8005553bebf8b9f1de',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report05.jpg'
  )
  bar.increment!

  report06 = CreateReport.new.call(
    title: 'Find my dog please!!',
    description: "Missing dog. He is a large bully / dalmatian mix. He is very friendly and loves people. He is wearing a red collar with a tag that has my contact information on it, and he is microchipped.",
    name: 'Freckles',
    status: 'active',
    species: 'dog',
    gender: 'Male (intact)',
    breed_1: 'American Bulldog',
    breed_2: 'Dalmatian',
    color_1: 'white',
    color_2: 'black',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    created_at: Time.now - 10.days,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report06.jpg'
  )
  bar.increment!

  report07 = CreateReport.new.call(
    title: 'I found this black cat',
    description: "I found a black cat wandering around the neighborhood.  She is very friendly and seems to be well taken care of.  She has no collar on.",
    name: 'Unknown',
    status: 'active',
    species: 'cat',
    gender: 'Female',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'black',
    color_2: 'white',
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report07.jpg'
  )
  bar.increment!

  report08 = CreateReport.new.call(
    title: 'Lost my cat',
    description: "My cat got out of the house and I can't find her. She is a small orange tabby cat named Melanie.  DO NOT CHASE!!!  She is very skittish and will run away from people.",
    name: 'Melanie',
    status: 'active',
    species: 'cat',
    gender: 'Female (spayed)',
    breed_1: 'Tabby',
    breed_2: nil,
    color_1: 'orange',
    color_2: 'white',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report08.jpg'
  )
  bar.increment!

  report09 = CreateReport.new.call(
    title: 'Stray kitty',
    description: "Stray cat found by my garage last weekend. Very sweet, not sure if boy or girl.  white brown and grey, short hair length.",
    name: 'Unknown',
    status: 'active',
    species: 'cat',
    gender: 'Unknown',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'white',
    color_2: 'brown',
    color_3: 'grey',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report09.jpg'
  )
  bar.increment!

  report10 = CreateReport.new.call(
    title: 'HELP!!! I lost my cat!!',
    description: "She is an outdoor cat and has been missing for a few days. She is a small black and white cat named Oreo.  She is very friendly and loves people.",
    name: 'Oreo',
    status: 'active',
    species: 'cat',
    gender: 'Female (spayed)',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'black',
    color_2: 'white',
    color_3: nil,
    microchipped: true,
    microchip_id: '8c96b0ac554ec1a5d16e095e169cbc',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report10.jpg'
  )
  bar.increment!

  report11 = CreateReport.new.call(
    title: 'Found beagle mix on Turner Rd',
    description: "We were driving north toward Jones road and saw a beagle wandering near the woodline.  We baited her closer to our car with some treats and took her back to our house.  She's currently chilling in the garage with our cat right now.  Please come get her!",
    name: 'Unknown',
    status: 'active',
    species: 'dog',
    gender: 'Female',
    breed_1: 'Beagle',
    breed_2: nil,
    color_1: 'brown',
    color_2: 'white',
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report11.jpg'
  )
  bar.increment!

  report12 = CreateReport.new.call(
    title: 'Help me find Max the shepherd',
    description: "Max got out again and I can't find him! He is a mixed breed, but we think he might be a German Shepherd / Australian Shepherd mix, with maybe some pit bull.  He's about 80 lbs.  Last we saw him he wasn't wearing his collar :( but he is microchipped!",
    name: 'Max',
    status: 'active',
    species: 'dog',
    gender: 'Male (intact)',
    breed_1: 'German Shepherd Dog',
    breed_2: 'Australian Shepherd',
    color_1: 'tan',
    color_2: 'black',
    color_3: "brown",
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report12.jpg'
  )
  bar.increment!

  report13 = CreateReport.new.call(
    title: 'German Shepherd Mix',
    description: "Our dog got out of the yard and we can't find him. He is a German Shepherd / Labrador Retriever mix",
    name: 'Simba',
    status: 'active',
    species: 'dog',
    gender: 'Male (neutered)',
    breed_1: 'German Shepherd Dog',
    breed_2: 'Labrador Retriever',
    color_1: 'yellow',
    color_2: 'white',
    color_3: 'tan',
    microchipped: true,
    microchip_id: 'e45b898f0eb61bc51b2fa74d510b8f',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report13.jpg'
  )
  bar.increment!

  report14 = CreateReport.new.call(
    title: 'lost little scottie girl :(',
    description: "My furbaby Molly was last seen running down Grandview Avenue.  She is a Scottish Terrier / Schnauzer mix, about 20 lbs.  Super friendly and sweet girl, please help us find her.",
    name: 'Molly',
    status: 'active',
    species: 'dog',
    gender: 'Female (spayed)',
    breed_1: 'Scottish Terrier',
    breed_2: 'Schnauzer',
    color_1: 'black',
    color_2: 'grey',
    color_3: 'white',
    microchipped: true,
    microchip_id: 'a4c53afe5b34f498e7e33c48d164e1',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report14.jpg'
  )
  bar.increment!

  report15 = CreateReport.new.call(
    title: 'Missing greyhound mix',
    description: "My girlfriend's greyhound mix took off after a rabbit and we can't find him.  He is a greyhound / lab mix, about 70 lbs.  He will chase cats but is otherwise very friendly.",
    name: 'Tiger',
    status: 'active',
    species: 'dog',
    gender: 'Male (neutered)',
    breed_1: 'greyhound',
    breed_2: nil,
    color_1: 'brindle',
    color_2: 'black',
    color_3: 'tan',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report15.jpg'
  )
  bar.increment!

  report16 = CreateReport.new.call(
    title: 'My Pomchi ran away',
    description: "My little dog ran away last week and we have searched all over town and can't find him.  He is a Chihuahua / Pomeranian mix and weighs about 10 lbs. Please contact me if you see him.",
    name: 'Francis',
    status: 'active',
    species: 'dog',
    gender: 'Male',
    breed_1: 'Chihuahua',
    breed_2: 'Pomeranian',
    color_1: 'brown',
    color_2: 'white',
    color_3: nil,
    microchipped: true,
    microchip_id: '642f63972f20ad419c8e2dea1f9bf3',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report16.jpg'
  )
  bar.increment!

  report17 = CreateReport.new.call(
    title: 'Lost my pibble mix 😭😭',
    description: "My angel furbaby busted out of the house to chase after a cat and we haven't seen her since.  If you happen to find her please let us know!! She used to be a bait dog but don't let that scare you. She is very sweet and wouldn't hurt a fly!",
    name: 'Mauly',
    status: 'active',
    species: 'dog',
    gender: 'Female (intact)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: nil,
    color_1: 'grey',
    color_2: 'white',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report17.jpg'
  )
  bar.increment!

  report18 = CreateReport.new.call(
    title: 'Scruffy yellow dog',
    description: "Come get your dog! She's been hanging out in my shed for a few days now.  She's a scruffy little lady, yellow and brownish with some white on her face.",
    name: 'Unknown',
    status: 'active',
    species: 'dog',
    gender: 'Female',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'yellow',
    color_2: 'white',
    color_3: 'brown',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report18.jpg'
  )
  bar.increment!

  report19 = CreateReport.new.call(
    title: 'Pitty pup',
    description: "Our pit bull jumped out of my dad's truck and he ran off.  It was near the park on 5th street.  He is a big friendly goofball with all white fur and is wearing a green collar.",
    name: 'Orion',
    status: 'active',
    species: 'dog',
    gender: 'Male (intact)',
    breed_1: 'American Pit Bull Terrier',
    breed_2: 'American Bully',
    color_1: 'white',
    color_2: nil,
    color_3: nil,
    microchipped: true,
    microchip_id: 'c38fb7d9a0b5a987efbc685d3d0fd3',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report19.jpg'
  )
  bar.increment!

  report20 = CreateReport.new.call(
    title: 'a Siamese cat i found',
    description: "I found a Siamese cat trying to get into the trash can by my house. She doesn't have a collar.",
    name: 'Unknown',
    status: 'active',
    species: 'cat',
    gender: 'Unknown',
    breed_1: 'Siamese',
    breed_2: nil,
    color_1: 'white',
    color_2: 'brown',
    color_3: 'black',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report20.jpg'
  )
  bar.increment!

  report21 = CreateReport.new.call(
    title: 'Lost cat pls help me find him',
    description: "My cat got out of the house and I can't find him. He is a long haired cat wearing a green collar with a little bell on it.",
    name: 'Bob',
    status: 'active',
    species: 'cat',
    gender: 'Male',
    breed_1: 'Persian',
    breed_2: nil,
    color_1: 'grey',
    color_2: 'white',
    color_3: nil,
    microchipped: false,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report21.jpg'
  )
  bar.increment!

  report22 = CreateReport.new.call(
    title: 'sweet black kitty',
    description: "I have never seen this kitty before but she is very friendly and seems to be well taken care of.  She has no collar on.",
    name: 'Unknown',
    status: 'active',
    species: 'cat',
    gender: 'Unknown',
    breed_1: 'Domestic Short Hair',
    breed_2: nil,
    color_1: 'black',
    color_2: nil,
    color_3: nil,
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report22.jpg'
  )
  bar.increment!

  report23 = CreateReport.new.call(
    title: 'Puppy found',
    description: "I have no idea who owns this previous baby but I hope I can find his owner soon! I found him outside of a restaraunt on Main Street. I have no idea what breed he is, maybe a husky german shepherd mix?",
    name: 'Unknown',
    status: 'active',
    species: 'dog',
    gender: 'Male',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'brown',
    color_2: 'white',
    color_3: 'grey',
    microchipped: nil,
    microchip_id: nil,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report23.jpg'
  )
  bar.increment!

  report24 = CreateReport.new.call(
    title: 'My goldie girl',
    description: "Pleease helpe me find my baby, she ran away last friday and I miss her so much.!!",
    name: 'Petunia',
    status: 'active',
    species: 'dog',
    gender: 'Female',
    breed_1: 'Mixed Breed',
    breed_2: nil,
    color_1: 'yellow',
    color_2: nil,
    color_3: nil,
    microchipped: true,
    microchip_id: '93f477556d705a1f5e0ffd69ecd925',
    created_at: Time.now - 75.days,
    archived_at: nil,
    image_url: '/app/assets/images/reports/report24.jpg'
  )
  bar.increment!

  report25 = CreateReport.new.call(
    title: 'Bo ran away!',
    description: "My dog Bo got out of the yard and I can't find him. He is a doodle wearing a blue bandana.",
    name: 'Bo',
    status: 'active',
    species: 'dog',
    gender: 'Male',
    breed_1: 'Labradoodle',
    breed_2: nil,
    color_1: 'white',
    color_2: 'brown',
    color_3: nil,
    microchipped: true,
    microchip_id: 'e9cb1d752a8fd4ce3d644c1efd287e',
    archived_at: nil,
    image_url: '/app/assets/images/reports/report25.jpg'
  )
  bar.increment!
end

puts('Seed data loaded successfully!')
