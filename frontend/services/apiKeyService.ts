// app/frontend/services/apiKeyService.ts
import axios from 'axios';

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

class ApiKeyService {
  private apiKeyCache: ApiKeyResponse | null = null;
  private tokenExpiryTime: number = 0;
  private isLoading: boolean = false;
  private loadPromise: Promise<ApiKeyResponse> | null = null;

  constructor() {
    console.log('[ApiKeyService] Initializing');
  }

  private getCsrfToken(): string {
    console.log('[ApiKeyService] Getting CSRF token');
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    console.log('[ApiKeyService] CSRF token found:', token ? 'Yes' : 'No');
    return token;
  }

  public async getApiKeys(): Promise<ApiKeyResponse> {
    console.log('[ApiKeyService] getApiKeys called');

    const currentTime = Math.floor(Date.now() / 1000);
    console.log('[ApiKeyService] Current time:', currentTime);
    console.log('[ApiKeyService] Token expiry time:', this.tokenExpiryTime);
    console.log('[ApiKeyService] Time until expiry:', this.tokenExpiryTime - currentTime, 'seconds');

    // Return cached keys if they exist and aren't about to expire
    if (this.apiKeyCache && this.tokenExpiryTime > currentTime + 30) {
      console.log('[ApiKeyService] Using cached API keys, valid for', this.tokenExpiryTime - currentTime, 'seconds');
      return this.apiKeyCache;
    }

    // If there's already a request in progress, return that promise
    if (this.isLoading && this.loadPromise) {
      console.log('[ApiKeyService] Request already in progress, returning existing promise');
      return this.loadPromise;
    }

    console.log('[ApiKeyService] Cache invalid or expired, fetching new keys');
    console.log('[ApiKeyService] Document cookie exists:', !!document.cookie);
    console.log('[ApiKeyService] Cookie length:', document.cookie.length);
    console.log('[ApiKeyService] Document referrer:', document.referrer);
    console.log('[ApiKeyService] Current location:', window.location.href);

    // Clear any existing cache
    this.apiKeyCache = null;
    this.isLoading = true;

    try {
      const csrfToken = this.getCsrfToken();

      console.log('[ApiKeyService] Step 1: Requesting API key token');
      this.loadPromise = (async () => {
        try {
          // Step 1: Get a temporary token
          console.log('[ApiKeyService] Making token request with headers:');
          console.log('[ApiKeyService] - Accept:', 'application/json');
          console.log('[ApiKeyService] - X-CSRF-Token:', csrfToken ? 'Present (not shown)' : 'Missing');
          console.log('[ApiKeyService] - withCredentials:', true);
          const tokenResponse = await axios.get('/api/keys/token', {
            headers: {
              'Accept': 'application/json',
              'X-CSRF-Token': csrfToken,
            },
            withCredentials: true, // Include cookies for authentication
          });

          console.log('[ApiKeyService] Token response status:', tokenResponse.status);
          console.log('[ApiKeyService] Token response status text:', tokenResponse.statusText);

          const { token, expires_at } = tokenResponse.data as TokenResponse;
          console.log('[ApiKeyService] Received token with length:', token.length);
          console.log('[ApiKeyService] Received token, expires at:', new Date(expires_at * 1000).toISOString());
          console.log('[ApiKeyService] Token expiry seconds from now:', expires_at - Math.floor(Date.now() / 1000));

          // Step 2: Exchange the token for actual API keys
          console.log('[ApiKeyService] Step 2: Exchanging token for API keys');
          console.log('[ApiKeyService] Making exchange request with headers:');
          console.log('[ApiKeyService] - Content-Type:', 'application/json');
          console.log('[ApiKeyService] - Accept:', 'application/json');
          console.log('[ApiKeyService] - X-CSRF-Token:', csrfToken ? 'Present (not shown)' : 'Missing');
          console.log('[ApiKeyService] - X-API-Token:', token ? 'Present (not shown)' : 'Missing');
          console.log('[ApiKeyService] - Token length:', token ? token.length : 0);
          console.log('[ApiKeyService] - withCredentials:', true);

          const keysResponse = await axios.post('/api/keys/exchange', {}, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-CSRF-Token': csrfToken,
              'X-API-Token': token,
            },
            withCredentials: true,
          });

          console.log('[ApiKeyService] Keys response status:', keysResponse.status);
          console.log('[ApiKeyService] Keys response status text:', keysResponse.statusText);
        
          // Store the keys in memory (not localStorage/sessionStorage for security)
          this.apiKeyCache = keysResponse.data as ApiKeyResponse;
          this.tokenExpiryTime = expires_at;

          console.log('[ApiKeyService] API keys received and cached');
          console.log('[ApiKeyService] Cache valid until:', new Date(expires_at * 1000).toISOString());
          console.log('[ApiKeyService] Number of API keys received:', Object.keys(this.apiKeyCache || {}).length);
        

          if (!this.apiKeyCache) {
            throw new Error('API keys response was empty or invalid');
          }

          // Log a sanitized summary of the keys we received
          const keySummary = Object.keys(this.apiKeyCache).map(key => {
            const value = this.apiKeyCache?.[key as keyof ApiKeyResponse] || '';
            return `${key}: ${value.substring(0, 3)}...${value.substring(value.length - 3)}`;
          });
          console.log('[ApiKeyService] API keys summary:', keySummary);

          return this.apiKeyCache;
        } catch (error) {
          console.error('[ApiKeyService] Error in API key fetch process:');
          this.handleError(error);
          throw error;
        } finally {
          this.isLoading = false;
        }
      })();

      return this.loadPromise;
    } catch (error) {
      this.isLoading = false;
      this.handleError(error);
      throw error;
    }
  }

  // Clear the cache (useful for testing or force-refreshing)
  public clearApiKeyCache(): void {
    console.log('[ApiKeyService] Clearing API key cache');
    this.apiKeyCache = null;
    this.tokenExpiryTime = 0;
    this.loadPromise = null;
  }

  // Method to format and log errors
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      console.error('[ApiKeyService] Axios error details:');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('[ApiKeyService] Error status:', error.response.status);
        console.error('[ApiKeyService] Error status text:', error.response.statusText);
        console.error('[ApiKeyService] Error headers:', JSON.stringify(error.response.headers));
        console.error('[ApiKeyService] Error data:', error.response.data);
        
        // Log specific headers that might be relevant
        console.error('[ApiKeyService] Response content-type:', error.response.headers['content-type']);
        console.error('[ApiKeyService] Response set-cookie:', error.response.headers['set-cookie']);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('[ApiKeyService] No response received. Request details:');
        console.error('[ApiKeyService] Request URL:', error.config?.url);
        console.error('[ApiKeyService] Request method:', error.config?.method);
        console.error('[ApiKeyService] Request headers:', JSON.stringify(error.config?.headers));
        console.error('[ApiKeyService] WithCredentials:', error.config?.withCredentials);
      } else {
        // Something happened in setting up the request
        console.error('[ApiKeyService] Error message:', error.message);
      }
      
      // Log network status
      console.error('[ApiKeyService] Navigator online status:', navigator.onLine);
    } else {
      console.error('[ApiKeyService] Non-Axios error:', error);
    }
    console.error('[ApiKeyService] Error stack:', error.stack);
  }

  // Get debug information about the current state
  public debugInfo(): object {
    const currentTime = Math.floor(Date.now() / 1000);
    return {
      hasCache: !!this.apiKeyCache,
      isLoading: this.isLoading,
      hasPendingPromise: !!this.loadPromise,
      timeUntilExpiry: this.tokenExpiryTime > 0 ? this.tokenExpiryTime - currentTime : 0,
      expiryTimestamp: this.tokenExpiryTime > 0 ? new Date(this.tokenExpiryTime * 1000).toISOString() : 'none',
      apiKeyCount: this.apiKeyCache ? Object.keys(this.apiKeyCache).length : 0,
      documentHasCsrfMeta: !!document.querySelector("meta[name='csrf-token']"),
      csrfToken: this.getCsrfToken().substring(0, 6) + '...' // Show just the beginning for security
    };
  }
}

// Create and export a singleton instance
const apiKeyService = new ApiKeyService();
export default apiKeyService;

// For backward compatibility with existing code
export async function getApiKeys(): Promise<ApiKeyResponse> {
  return apiKeyService.getApiKeys();
}

export function clearApiKeyCache(): void {
  apiKeyService.clearApiKeyCache();
}