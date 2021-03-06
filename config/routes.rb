Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'static_pages#root'
  namespace :api, { default: :json } do
    resources :users, only: [:create]
    resource :session, only: [:create, :destroy]
    resources :transactions, only: [:create]
    resources :watchlists, param: :ticker_symbol, only: [:create, :destroy]
  end
end
