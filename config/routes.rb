# config/routes.rb

Rails.application.routes.draw do

  get 'up', to: 'home#up'

  # Custom Devise routes for /login, /signup, etc.
  devise_for :users, skip: [:sessions, :registrations, :passwords, :confirmations]

  devise_scope :user do
    # Sessions (login/logout)
    get    'login',  to: 'users/sessions#new',     as: :new_user_session
    post   'login',  to: 'users/sessions#create',  as: :user_session
    delete 'logout', to: 'users/sessions#destroy', as: :destroy_user_session

    # Registrations (signup)
    get  'signup', to: 'users/registrations#new',    as: :new_user_registration
    post 'signup', to: 'users/registrations#create', as: :user_registration

    # Password recovery
    get   'forgot-password',     to: 'users/passwords#new',    as: :new_user_password
    post  'forgot-password',     to: 'users/passwords#create', as: :user_password
    get   'reset-password/edit', to: 'users/passwords#edit',   as: :edit_user_password
    patch 'reset-password',      to: 'users/passwords#update'
    put   'reset-password',      to: 'users/passwords#update'

    # Email confirmation
    get  'confirm-email',        to: 'users/confirmations#show',   as: :user_confirmation
    post 'confirm-email/resend', to: 'users/confirmations#create', as: :new_user_confirmation
  end

  # Static pages
  get '/terms',   to: 'pages#terms',   as: :terms
  get '/privacy', to: 'pages#privacy', as: :privacy
  get '/about',   to: 'pages#about',   as: :about

  # Phase 2: Public pages (Hotwire)
  resources :reports, only: [:index, :show] do
    member do
      post :submit_tip
      get :tip_form
    end
  end

  # Contact page
  get  '/contact', to: 'contact_messages#new', as: :contact
  post '/contact', to: 'contact_messages#create'

  namespace :api do
    # Custom auth routes
    post '/sign_up', to: 'registrations#create'
    patch '/profile', to: 'registrations#update'
    patch '/change_password', to: 'registrations#change_password'
    patch '/settings', to: 'registrations#update_settings'
    post '/login', to: 'sessions#create'
    get '/current_user', to: 'sessions#show'
    delete '/logout', to: 'sessions#destroy'
    delete '/account', to: 'registrations#destroy'

    resources :conversations, only: [:index, :create, :show]
    resources :messages, only: [] do
      collection do
        get :unread_count
      end
    end
    post '/conversations/:conversation_id/messages', to: 'messages#create'

    get 'cloudinary/credentials', to: 'cloudinary#credentials'
    get 'filters/states', to: 'filters#states'
    get 'filters/cities', to: 'filters#cities'
    get 'filters/breeds', to: 'filters#breeds'

    resources :reports do
      collection do
        get :search
      end
      member do
        patch :archive
        post :start_conversation, to: 'conversations#create_from_report'
        post :start_conversation_with_message, to: 'conversations#create_from_report_with_message'
      end
      resources :events, only: [:index, :create], controller: 'events' do
        collection do
          post :create_tip
          get :index_tips
          get :all_tips
          get :last_location
        end
      end
    end

    resources :pets do
      member do
        patch :archive
      end
    end

    get 'users/reports', to: 'reports#user_reports'
    get 'users/pets', to: 'pets#user_pets'
    get 'users/events', to: 'events#user_events'

    resource :session, only: [:create, :show, :destroy]
    get 'user_info', to: 'sessions#user_info'

    post 'contact_messages', to: 'contact_messages#create'
  end

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  get 'up' => 'rails/health#show', as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get 'service-worker' => 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest' => 'rails/pwa#manifest', as: :pwa_manifest


  # Vite development server proxy
  if Rails.env.development?
    get '/vite-dev/*path', to: proc { |env|
      require 'net/http'
      require 'uri'

      path = env['PATH_INFO']
      vite_url = "http://vite:3036#{path}"

      begin
        uri = URI(vite_url)
        response = Net::HTTP.get_response(uri)

        headers = response.to_hash.transform_values { |v| v.is_a?(Array) ? v.first : v }
        [response.code.to_i, headers, [response.body]]
      rescue => e
        [404, {}, ['Vite server not available']]
      end
    }

    require 'sidekiq/web'
    mount Sidekiq::Web => '/sidekiq'
    mount LetterOpenerWeb::Engine, at: '/letter_opener'
  end

  # Catch-all route to handle client-side routing by React (for unmigrated pages)
  get '*path', to: 'home#index', constraints: ->(req) { req.format.html? }

  # Root route - Phase 2: Now serves reports index (Hotwire)
  root to: 'reports#index'

  direct :rails_blob do |blob|
    route_for(:rails_blob, blob, only_path: true)
  end

  direct :rails_representation do |representation|
    route_for(:rails_representation, representation, only_path: true)
  end
end
