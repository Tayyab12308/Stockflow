Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'static_pages#root'
  namespace :api, { default: :json } do
    get 'users/current', to: 'users#current'
    resources :users, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :transactions, only: [:create]
    resources :watchlists, param: :ticker_symbol, only: [:create, :destroy]
    resources :assets, only: [:index]

    namespace :keys do
      get :token
      post :exchange
    end
    
    get 'health/redis', to: 'health#redis'
  end

  # Catch-all route to handle client-side routing by React
  get '*path', to: 'static_pages#root', constraints: ->(req) { !req.xhr? && req.format.html? }
end
