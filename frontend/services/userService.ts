// app/frontend/services/userService.ts
import axios from 'axios';
import { User } from '../interfaces';


interface UserResponse {
  user: User;
}

class UserService {
  private currentUser: User | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<User | null> | null = null;

  constructor() {
    console.log('[UserService] Initializing');
  }

  private getCsrfToken(): string | null | undefined {
    console.log('[UserService] Getting CSRF token');
    const token = document.querySelector("meta[name='csrf-token']")?.getAttribute("content");
    console.log('[UserService] CSRF token found:', token ? 'Yes' : 'No');
    return token;
  }

  public async getCurrentUser(): Promise<User | null> {
    console.log('[UserService] getCurrentUser called');
    
    if (this.currentUser) {
      console.log('[UserService] Returning cached user');
      return this.currentUser;
    }

    if (this.loadPromise) {
      console.log('[UserService] Request already in progress, returning existing promise');
      return this.loadPromise;
    }

    console.log('[UserService] Starting new request to fetch user');
    this.loading = true;
    
    const csrfToken = this.getCsrfToken();
    console.log('[UserService] Preparing request headers with CSRF token:', csrfToken);
    
    this.loadPromise = axios.get('/api/users/current', {
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      withCredentials: true
    })
      .then(response => {
        console.log('[UserService] Request successful', response.status);
        console.log('[UserService] Response data:', response.data);
        
        const data = response.data as UserResponse;
        if (data && data.user) {
          console.log('[UserService] User found in response');
          this.currentUser = data.user;
        } else {
          console.log('[UserService] No user data in response');
        }
        
        this.loading = false;
        return data.user || null;
      })
      .catch(error => {
        console.log('[UserService] Request failed');
        
        // Handle different types of errors
        if (error.response) {
          console.log('[UserService] Error status:', error.response.status);
          console.log('[UserService] Error data:', error.response.data);
          
          if (error.response.status === 401) {
            console.log('[UserService] User not authenticated (401)');
            return null; // Not logged in
          }
        } else if (error.request) {
          console.log('[UserService] No response received from server');
          console.log('[UserService] Request details:', error.request);
        } else {
          console.log('[UserService] Error setting up request:', error.message);
        }
        
        console.log('[UserService] Stack trace:', error.stack);
        this.loading = false;
        return null;
      });

    return this.loadPromise;
  }

  public isLoggedIn(): boolean {
    const loggedIn = this.currentUser !== null;
    console.log('[UserService] isLoggedIn check:', loggedIn);
    return loggedIn;
  }

  public clearCurrentUser(): void {
    console.log('[UserService] Clearing current user');
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