Rails.application.config.action_dispatch.default_headers = {
  'X-Frame-Options' => 'SAMEORIGIN',
  'X-XSS-Protection' => '1; mode=block',
  'X-Content-Type-Options' => 'nosniff',
  'Referrer-Policy' => 'strict-origin-when-cross-origin',
  'Permissions-Policy' => 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}

# 'Content-Security-Policy' => "default-src 'self'; connect-src 'self' wss://delayed.polygon.io; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;"
