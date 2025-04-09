Rails.application.config.session_store :cookie_store, 
  key: '_your_app_session',
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax,
  expire_after: 4.hours