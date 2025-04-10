// app/frontend/services/apiKeyService.ts
import axios from 'axios';
import { createDebugger } from '../util/debug';

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
  private debug = createDebugger({ namespace: 'service:apiKey', prefix: '[ApiKeyService] ' });

  constructor() {
    this.debug.log('[ApiKeyService] Initializing');
  }

  private getCsrfToken(): string {
    this.debug.log('[ApiKeyService] Getting CSRF token');
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    this.debug.log('[ApiKeyService] CSRF token found:', token ? 'Yes' : 'No');
    return token;
  }

  public async getApiKeys(): Promise<ApiKeyResponse> {
    this.debug.log('[ApiKeyService] getApiKeys called');

    const currentTime = Math.floor(Date.now() / 1000);
    this.debug.log('[ApiKeyService] Current time:', currentTime);
    this.debug.log('[ApiKeyService] Token expiry time:', this.tokenExpiryTime);
    this.debug.log('[ApiKeyService] Time until expiry:', this.tokenExpiryTime - currentTime, 'seconds');

    // Return cached keys if they exist and aren't about to expire
    if (this.apiKeyCache && this.tokenExpiryTime > currentTime + 30) {
      this.debug.log('[ApiKeyService] Using cached API keys, valid for', this.tokenExpiryTime - currentTime, 'seconds');
      return this.apiKeyCache;
    }

    // If there's already a request in progress, return that promise
    if (this.isLoading && this.loadPromise) {
      this.debug.log('[ApiKeyService] Request already in progress, returning existing promise');
      return this.loadPromise;
    }

    this.debug.log('[ApiKeyService] Cache invalid or expired, fetching new keys');
    this.debug.log('[ApiKeyService] Document cookie exists:', !!document.cookie);
    this.debug.log('[ApiKeyService] Cookie length:', document.cookie.length);
    this.debug.log('[ApiKeyService] Document referrer:', document.referrer);
    this.debug.log('[ApiKeyService] Current location:', window.location.href);

    // Clear any existing cache
    this.apiKeyCache = null;
    this.isLoading = true;

    try {
      const csrfToken = this.getCsrfToken();

      this.debug.log('[ApiKeyService] Step 1: Requesting API key token');
      this.loadPromise = (async () => {
        try {
          // Step 1: Get a temporary token
          this.debug.log('[ApiKeyService] Making token request with headers:');
          this.debug.log('[ApiKeyService] - Accept:', 'application/json');
          this.debug.log('[ApiKeyService] - X-CSRF-Token:', csrfToken ? 'Present (not shown)' : 'Missing');
          this.debug.log('[ApiKeyService] - withCredentials:', true);
          const tokenResponse = await axios.get('/api/keys/token', {
            headers: {
              'Accept': 'application/json',
              'X-CSRF-Token': csrfToken,
            },
            withCredentials: true, // Include cookies for authentication
          });

          this.debug.log('[ApiKeyService] Token response status:', tokenResponse.status);
          this.debug.log('[ApiKeyService] Token response status text:', tokenResponse.statusText);

          const { token, expires_at } = tokenResponse.data as TokenResponse;
          this.debug.log('[ApiKeyService] Received token with length:', token.length);
          this.debug.log('[ApiKeyService] Received token, expires at:', new Date(expires_at * 1000).toISOString());
          this.debug.log('[ApiKeyService] Token expiry seconds from now:', expires_at - Math.floor(Date.now() / 1000));

          // Step 2: Exchange the token for actual API keys
          this.debug.log('[ApiKeyService] Step 2: Exchanging token for API keys');
          this.debug.log('[ApiKeyService] Making exchange request with headers:');
          this.debug.log('[ApiKeyService] - Content-Type:', 'application/json');
          this.debug.log('[ApiKeyService] - Accept:', 'application/json');
          this.debug.log('[ApiKeyService] - X-CSRF-Token:', csrfToken ? 'Present (not shown)' : 'Missing');
          this.debug.log('[ApiKeyService] - X-API-Token:', token ? 'Present (not shown)' : 'Missing');
          this.debug.log('[ApiKeyService] - Token length:', token ? token.length : 0);
          this.debug.log('[ApiKeyService] - withCredentials:', true);

          const keysResponse = await axios.post('/api/keys/exchange', {}, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-CSRF-Token': csrfToken,
              'X-API-Token': token,
            },
            withCredentials: true,
          });

          this.debug.log('[ApiKeyService] Keys response status:', keysResponse.status);
          this.debug.log('[ApiKeyService] Keys response status text:', keysResponse.statusText);
        
          // Store the keys in memory (not localStorage/sessionStorage for security)
          this.apiKeyCache = keysResponse.data as ApiKeyResponse;
          this.tokenExpiryTime = expires_at;

          this.debug.log('[ApiKeyService] API keys received and cached');
          this.debug.log('[ApiKeyService] Cache valid until:', new Date(expires_at * 1000).toISOString());
          this.debug.log('[ApiKeyService] Number of API keys received:', Object.keys(this.apiKeyCache || {}).length);
        

          if (!this.apiKeyCache) {
            throw new Error('API keys response was empty or invalid');
          }

          // Log a sanitized summary of the keys we received
          const keySummary = Object.keys(this.apiKeyCache).map(key => {
            const value = this.apiKeyCache?.[key as keyof ApiKeyResponse] || '';
            return `${key}: ${value.substring(0, 3)}...${value.substring(value.length - 3)}`;
          });
          this.debug.log('[ApiKeyService] API keys summary:', keySummary);

          return this.apiKeyCache;
        } catch (error) {
          this.debug.error('[ApiKeyService] Error in API key fetch process:');
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
    this.debug.log('[ApiKeyService] Clearing API key cache');
    this.apiKeyCache = null;
    this.tokenExpiryTime = 0;
    this.loadPromise = null;
  }

  // Method to format and log errors
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      this.debug.error('[ApiKeyService] Axios error details:');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        this.debug.error('[ApiKeyService] Error status:', error.response.status);
        this.debug.error('[ApiKeyService] Error status text:', error.response.statusText);
        this.debug.error('[ApiKeyService] Error headers:', JSON.stringify(error.response.headers));
        this.debug.error('[ApiKeyService] Error data:', error.response.data);
        
        // Log specific headers that might be relevant
        this.debug.error('[ApiKeyService] Response content-type:', error.response.headers['content-type']);
        this.debug.error('[ApiKeyService] Response set-cookie:', error.response.headers['set-cookie']);
      } else if (error.request) {
        // The request was made but no response was received
        this.debug.error('[ApiKeyService] No response received. Request details:');
        this.debug.error('[ApiKeyService] Request URL:', error.config?.url);
        this.debug.error('[ApiKeyService] Request method:', error.config?.method);
        this.debug.error('[ApiKeyService] Request headers:', JSON.stringify(error.config?.headers));
        this.debug.error('[ApiKeyService] WithCredentials:', error.config?.withCredentials);
      } else {
        // Something happened in setting up the request
        this.debug.error('[ApiKeyService] Error message:', error.message);
      }
      
      // Log network status
      this.debug.error('[ApiKeyService] Navigator online status:', navigator.onLine);
    } else {
      this.debug.error('[ApiKeyService] Non-Axios error:', error);
    }
    this.debug.error('[ApiKeyService] Error stack:', error.stack);
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