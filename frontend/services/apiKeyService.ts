interface ApiKeyResponse {
  polygon_api_key: string;
  fin_model_prep_api_key_one: string;
  fin_model_prep_api_key_two: string;
  fin_model_prep_api_key_three: string;
  fin_model_prep_api_key_four: string;
  fin_model_prep_api_key_five: string;
  fin_model_prep_api_key_six: string;
  fin_model_prep_api_key_seven: string;
  fin_model_prep_api_key_eight: string;
  fin_model_prep_api_key_nine: string;
  alphavantage_api_key_one: string;
  alphavantage_api_key_two: string;
  alphavantage_api_key_three: string;
  alphavantage_api_key_four: string;
  alphavantage_api_key_five: string;
  alphavantage_api_key_six: string;
  alphavantage_api_key_seven: string;
  alphavantage_api_key_eight: string;
  alphavantage_api_key_nine: string;
  alphavantage_api_key_ten: string;
}

interface TokenResponse {
  token: string;
  expires_at: number;
}

// Cache for the API keys, stored in memory only
let apiKeyCache: ApiKeyResponse | null = null;
let tokenExpiryTime: number = 0;

export async function getApiKeys(): Promise<ApiKeyResponse> {
  const currentTime = Math.floor(Date.now() / 1000);
  
  // Return cached keys if they exist and aren't about to expire
  if (apiKeyCache && tokenExpiryTime > currentTime + 30) {
    return apiKeyCache;
  }
  
  // Clear any existing cache
  apiKeyCache = null;
  
  try {
    // Step 1: Get a temporary token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    
    const tokenResponse = await fetch('/api/keys/token', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      credentials: 'same-origin', // Include cookies for authentication
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Failed to obtain API key token: ${tokenResponse.status} ${error}`);
    }
    
    const { token, expires_at }: TokenResponse = await tokenResponse.json();
    
    // Step 2: Exchange the token for actual API keys
    const keysResponse = await fetch('/api/keys/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-Token': csrfToken,
        'X-API-Token': token,
      },
      credentials: 'same-origin',
    });
    
    if (!keysResponse.ok) {
      const error = await keysResponse.text();
      throw new Error(`Failed to exchange token for API keys: ${keysResponse.status} ${error}`);
    }
    
    // Store the keys in memory (not localStorage/sessionStorage for security)
    apiKeyCache = await keysResponse.json();
    tokenExpiryTime = expires_at;

    if (apiKeyCache === null) {
      throw new Error('Failed to retrieve API keys');
    }
    
    return apiKeyCache;
  } catch (error) {
    console.error('Error fetching API keys:', error);
    throw error;
  }
}

// Optional: Add a method to clear the cache if needed
export function clearApiKeyCache(): void {
  apiKeyCache = null;
  tokenExpiryTime = 0;
}