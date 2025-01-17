release: bin/rails db:migrate && bin/rails searchkick:reindex:all --trace && bin/rake db:seed
css: yarn build:css --watch
types: yarn ts-check
web: bin/rails s
