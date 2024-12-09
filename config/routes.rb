# config/routes.rb

Rails.application.routes.draw do
  # Devise routes with custom controllers
  devise_for :users,
    path: 'api',
    path_names: {
      sign_in: 'login',
      sign_out: 'logout',
      registration: 'signup'
    },
    controllers: {
      sessions: 'api/sessions',
      registrations: 'api/registrations'
    },
    defaults: { format: :json }

  namespace :api do
    get 'cloudinary/credentials', to: 'cloudinary#credentials'

    resources :reports do
      get :index, on: :collection
      get :search, on: :collection
      get :new
      get :edit
      get :show
    end
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest

  # Catch-all route to handle client-side routing by React
  get '*path', to: 'home#index', constraints: ->(req) { req.format.html? }

  # Render the React app
  root to: 'home#index'

  direct :rails_blob do |blob|
    route_for(:rails_blob, blob, only_path: true)
  end

  direct :rails_representation do |representation|
    route_for(:rails_representation, representation, only_path: true)
  end
end
