# Be sure to restart your server when you modify this file.

# Define an application-wide content security policy
# For further information see the following documentation
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

Rails.application.config.content_security_policy do |policy|
  policy.script_src :self, "'sha256-5sLKd6O7EXq162ezzsBPtj/aRHIyPWLnMryzHcMqqKk='", "'sha256-7f/cP7dfmJM9m217XdIoTNXMykp7haCwp48TQPDGlhw='", "'sha256-n/iTnq/MF3CkSWzjUcTu/YiwQKQHje6osaEAwkIGpKI='"
  # policy.font_src   :self, :unsafe_inline, 'https://fonts.gstatic.com'
end

# If you are using UJS then enable automatic nonce generation
# Rails.application.config.content_security_policy_nonce_generator = -> request { SecureRandom.base64(16) }

# Report CSP violations to a specified URI
# For further information see the following documentation:
# https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only
# Rails.application.config.content_security_policy_report_only = true
