import { User } from "../interfaces";
import { convertKeysToCamelCase } from "../util/util";

interface UserResponse {
  user: User;
}

class UserService {
  private currentUser: User | null = null;
  private loading: boolean = false;
  private loadPromise: Promise<User | null> | null = null;

  public async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loading = true;
    this.loadPromise = fetch('/api/users/current')
      .then(response => {
        if (response.status === 401) {
          return null; // Not logged in
        }
        if (!response.ok) {
          throw new Error('Failed to fetch current user');
        }
        return response.json();
      })
      .then((data: UserResponse) => {
        if (data && data.user) {
          this.currentUser =  convertKeysToCamelCase(data.user);
        }
        this.loading = false;
        return data?.user || null;
      })
      .catch(error => {
        console.error('Error fetching current user:', error);
        this.loading = false;
        return null;
      });

    return this.loadPromise;
  }

  public isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  public clearCurrentUser(): void {
    this.currentUser = null;
    this.loadPromise = null;
  }
}

const userService = new UserService();
export default userService;