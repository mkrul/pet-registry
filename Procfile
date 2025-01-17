release: bin/rails db:migrate && bin/rake db:seed && bin/rails searchkick:reindex:all --trace
css: yarn build:css --watch
types: yarn ts-check
web: bin/rails s
