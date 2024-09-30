# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

require 'open-uri'
gem 'progress_bar'

if !Rails.env.production?
  total_reports = 25
  bar = ProgressBar.new(total_reports)

  print('Seeding database with sample data...')

  Report.destroy_all

  report01 = Report.create(
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
    archived_at: nil
  )
  report01_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533840/petregistry/seeds/reports/report_0_0_nxtzrs.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533839/petregistry/seeds/reports/report_0_1_orxbv9.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533832/petregistry/seeds/reports/report_0_2_dymxsy.png
  )
  report01_images.each do |url|
    report01.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report02 = Report.create(
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
    archived_at: nil
  )
  report02_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533784/petregistry/seeds/reports/report_10_0_abwrlg.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533783/petregistry/seeds/reports/report_10_1_kwzsvv.png
  )
  report02_images.each do |url|
    report02.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report03 = Report.create(
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
    archived_at: nil
  )
  report03_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533776/petregistry/seeds/reports/report_11_0_u9hsf7.png
  )
  report03_images.each do |url|
    report03.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report04 = Report.create(
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
    archived_at: nil
  )
  report04_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533783/petregistry/seeds/reports/report_12_0_qoes36.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533781/petregistry/seeds/reports/report_12_1_qrwpqk.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533775/petregistry/seeds/reports/report_12_2_b06rfd.png
  )
  report04_images.each do |url|
    report04.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report05 = Report.create(
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
    archived_at: nil
  )
  report05_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533776/petregistry/seeds/reports/report_13_0_jfsod6.png
  )
  report05_images.each do |url|
    report05.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report06 = Report.create(
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
    archived_at: nil
  )
  report06_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533769/petregistry/seeds/reports/report_14_0_ydpiyu.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533766/petregistry/seeds/reports/report_15_1_j9t3us.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533755/petregistry/seeds/reports/report_15_2_zeh8kb.png
  )
  report06_images.each do |url|
    report06.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report07 = Report.create(
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
    archived_at: nil
  )
  report07_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533749/petregistry/seeds/reports/report_16_0_u5pf5a.png
  )
  report07_images.each do |url|
    report07.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report08 = Report.create(
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
    archived_at: nil
  )
  report08_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533746/petregistry/seeds/reports/report_17_0_baf3dt.png
  )
  report08_images.each do |url|
    report08.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report09 = Report.create(
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
    archived_at: nil
  )
  report09_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533744/petregistry/seeds/reports/report_18_0_z4jnlr.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533716/petregistry/seeds/reports/report_18_1_qkmtik.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533716/petregistry/seeds/reports/report_18_2_w4nslf.png
  )
  report09_images.each do |url|
    report09.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report10 = Report.create(
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
    archived_at: nil
  )
  report10_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533713/petregistry/seeds/reports/report_19_0_dx0ibe.png
  )
  report10_images.each do |url|
    report10.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report11 = Report.create(
    title: 'Found a very friendly beagle mix off of Turner Road',
    description: "We were driving north toward Jones road and saw a beagle wandering near the woodline.  We baited her closer to our car with some treats and took her back to our house.  She's currently chilling in the garage with our cat right now.  Please come get him!",
    name: 'Unknown',
    status: 'active',
    species: 'Dog',
    gender: 'Female',
    breed_1: 'Beagle',
    breed_2: nil,
    color_1: 'Brown',
    color_2: 'White',
    color_3: nil,
    archived_at: nil
  )
  report11_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533828/petregistry/seeds/reports/report_1_0_ifgcp7.png
  )
  report11_images.each do |url|
    report11.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report12 = Report.create(
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
    archived_at: nil
  )
  report12_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533719/petregistry/seeds/reports/report_20_0_se5e74.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533704/petregistry/seeds/reports/report_20_1_myqxyp.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533702/petregistry/seeds/reports/report_20_2_kkjtl1.png
  )
  report12_images.each do |url|
    report12.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report13 = Report.create(
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
    archived_at: nil
  )
  report13_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533706/petregistry/seeds/reports/report_21_0_gc8cwb.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533690/petregistry/seeds/reports/report_21_1_wnjmsq.png
  )
  report13_images.each do |url|
    report13.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report14 = Report.create(
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
    archived_at: nil
  )
  report14_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533708/petregistry/seeds/reports/report_22_0_y9wu0b.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533692/petregistry/seeds/reports/report_22_1_awyshe.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533714/petregistry/seeds/reports/report_22_2_ewvn1u.png
  )
  report14_images.each do |url|
    report14.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report15 = Report.create(
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
    archived_at: nil
  )
  report15_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533680/petregistry/seeds/reports/report_23_0_ts4fat.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533692/petregistry/seeds/reports/report_23_1_f6cukk.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533864/petregistry/seeds/reports/report_23_2_mh5h1v.png
  )
  report15_images.each do |url|
    report15.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report16 = Report.create(
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
    archived_at: nil
  )
  report16_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533864/petregistry/seeds/reports/report_24_0_t9tsgz.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533859/petregistry/seeds/reports/report_24_1_g6ndfn.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533862/petregistry/seeds/reports/report_24_2_w3uvxw.png
  )
  report16_images.each do |url|
    report16.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report17 = Report.create(
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
    archived_at: nil
  )
  report17_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533863/petregistry/seeds/reports/report_25_0_oapk1y.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533850/petregistry/seeds/reports/report_25_1_vsbie6.png
  )
  report17_images.each do |url|
    report17.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report18 = Report.create(
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
    archived_at: nil
  )
  report18_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533829/petregistry/seeds/reports/report_2_0_lblakq.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533822/petregistry/seeds/reports/report_2_1_atrnd1.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533819/petregistry/seeds/reports/report_2_2_jbdghp.png
  )
  report18_images.each do |url|
    report18.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report19 = Report.create(
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
    archived_at: nil
  )
  report19_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533815/petregistry/seeds/reports/report_3_0_sjcrdv.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533811/petregistry/seeds/reports/report_3_1_hxhqcx.png
  )
  report19_images.each do |url|
    report19.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report20 = Report.create(
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
    archived_at: nil
  )
  report20_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533808/petregistry/seeds/reports/report_4_0_h6an5m.png
  )
  report20_images.each do |url|
    report20.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report21 = Report.create(
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
    archived_at: nil
  )
  report21_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533806/petregistry/seeds/reports/report_5_0_nukfix.png
  )
  report21_images.each do |url|
    report21.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report22 = Report.create(
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
    archived_at: nil
  )
  report22_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533801/petregistry/seeds/reports/report_6_0_mxvmzq.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533796/petregistry/seeds/reports/report_6_1_o7k2yr.png
  )
  report22_images.each do |url|
    report22.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report23 = Report.create(
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
    archived_at: nil
  )
  report23_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533793/petregistry/seeds/reports/report_7_0_qqnbts.png
  )
  report23_images.each do |url|
    report23.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report24 = Report.create(
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
    archived_at: nil
  )
  report24_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533794/petregistry/seeds/reports/report_8_0_dy9cei.png
  )
  report24_images.each do |url|
    report24.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!

  report25 = Report.create(
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
    archived_at: nil
  )
  report25_images = %w(
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533792/petregistry/seeds/reports/report_9_0_d3bcen.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533787/petregistry/seeds/reports/report_9_1_owpl39.png
    https://res.cloudinary.com/dtyadd1w5/image/upload/v1727533784/petregistry/seeds/reports/report_9_2_a01rea.png
  )
  report25_images.each do |url|
    report25.images.attach(io: OpenURI.open_uri(url), filename: File.basename(URI.parse(url).path))
  end
  bar.increment!
end