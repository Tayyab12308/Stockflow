import axios from 'axios';
import { User } from '../interfaces';
import { createDebugger } from '../util/debug'


interface UserResponse {
  user: User;
}

class UserService {
  private currentUser: User | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<User | null> | null = null;
  private debug = createDebugger({ namespace: 'service:user', prefix: '[ApiKeyService] ' });

  constructor() {
    this.debug.log('[UserService] Initializing');
  }

  private getCsrfToken(): string | null | undefined {
    this.debug.log('[UserService] Getting CSRF token');
    const token = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");
    this.debug.log('[UserService] CSRF token found:', token ? 'Yes' : 'No');
    return token;
  }

  public async getCurrentUser(): Promise<User | null> {
    this.debug.log('[UserService] getCurrentUser called');
    
    if (this.currentUser) {
      this.debug.log('[UserService] Returning cached user');
      return this.currentUser;
    }

    if (this.loadPromise) {
      this.debug.log('[UserService] Request already in progress, returning existing promise');
      return this.loadPromise;
    }

    this.debug.log('[UserService] Starting new request to fetch user');
    this.loading = true;
    
    const csrfToken = this.getCsrfToken();
    this.debug.log('[UserService] Preparing request headers with CSRF token:', csrfToken);
    
    this.loadPromise = axios.get('/api/users/current', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        this.debug.log('[UserService] Request successful', response.status);
        this.debug.log('[UserService] Response data:', response.data);
        
        const data = response.data as UserResponse;
        if (data && data.user) {
          this.debug.log('[UserService] User found in response');
          this.currentUser = data.user;
        } else {
          this.debug.log('[UserService] No user data in response');
        }
        
        this.loading = false;
        return data.user || null;
      })
      .catch(error => {
        this.debug.log('[UserService] Request failed');
        
        // Handle different types of errors
        if (error.response) {
          this.debug.log('[UserService] Error status:', error.response.status);
          this.debug.log('[UserService] Error data:', error.response.data);
          
          if (error.response.status === 401) {
            this.debug.log('[UserService] User not authenticated (401)');
            return null; // Not logged in
          }
        } else if (error.request) {
          this.debug.log('[UserService] No response received from server');
          this.debug.log('[UserService] Request details:', error.request);
        } else {
          this.debug.log('[UserService] Error setting up request:', error.message);
        }
        
        this.debug.log('[UserService] Stack trace:', error.stack);
        this.loading = false;
        return null;
      });

    return this.loadPromise;
  }

  public isLoggedIn(): boolean {
    const loggedIn = this.currentUser !== null;
    this.debug.log('[UserService] isLoggedIn check:', loggedIn);
    return loggedIn;
  }

  public clearCurrentUser(): void {
    this.debug.log('[UserService] Clearing current user');
    this.currentUser = null;
    this.loadPromise = null;
  }

  public debugInfo(): object {
    return {
      hasCurrentUser: !!this.currentUser,
      isLoading: this.loading,
      hasPendingPromise: !!this.loadPromise,
      documentHasCsrfMeta: !!document.querySelector("meta[name='csrf-token']"),
      csrfToken: this.getCsrfToken()?.substring(0, 10) + '...' // Show just the beginning for security
    };
  }
}

const userService = new UserService();
export default userService;