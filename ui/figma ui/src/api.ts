// API service for the UI app
const API_BASE_URL = 'http://192.168.29.81:5000/api'; // Adjust IP as needed

interface ApiResponse<T> extends Record<string, any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  specialization?: string;
  experience?: number;
  currentWorkplace?: string;
  registrationNumber?: string;
  highestQualification?: string;
  city?: string;
  state?: string;
  organization?: string;
  location?: string;
  isProfileComplete?: boolean;
  profilePicture?: string;
  role?: string;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getDashboardStats(): Promise<{
    courses: number;
    events: number;
    workshops: number;
    registered: number;
    enrolled: number;
  }> {
    const response = await this.request<ApiResponse<any>>('/dashboard/stats');
    if (response.success) {
      return {
        courses: response.courses || 0,
        events: response.events || 0,
        workshops: response.workshops || 0,
        registered: response.registered || 0,
        enrolled: response.enrolled || 0,
      };
    }
    throw new Error(response.message || 'Failed to fetch dashboard stats');
  }

  async getDashboardNews(limit: number = 10): Promise<any[]> {
    const response = await this.request<ApiResponse<any>>('/dashboard/news');
    if (response.success) {
      return response.news || [];
    }
    return [];
  }

  async getDashboardCourses(limit: number = 10): Promise<any[]> {
    const response = await this.request<ApiResponse<any>>('/dashboard/courses');
    if (response.success) {
      return response.courses || [];
    }
    return [];
  }

  async getDashboardEvents(limit: number = 10): Promise<any[]> {
    const response = await this.request<ApiResponse<any>>('/dashboard/events');
    if (response.success) {
      return response.events || [];
    }
    return [];
  }

  async getDashboardWorkshops(limit: number = 10): Promise<any[]> {
    const response = await this.request<ApiResponse<any>>('/dashboard/workshops');
    if (response.success) {
      return response.workshops || [];
    }
    return [];
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }> {
    const response = await this.request<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.success) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }

  async loginPhone(phoneNumber: string): Promise<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }> {
    const response = await this.request<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }>('/auth/login-phone', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
    if (response.success) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }

  async register(data: {
    name: string;
    email?: string;
    phoneNumber: string;
    specialization?: string;
    experience?: number;
    currentWorkplace?: string;
    registrationNumber?: string;
    highestQualification?: string;
    city?: string;
    state?: string;
    organization?: string;
    isProfileComplete?: boolean;
  }): Promise<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }> {
    const response = await this.request<{ success: boolean; user: User; accessToken: string; refreshToken: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (response.success) {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }

  // Profile methods
  async getProfile(): Promise<{ success: boolean; user: User }> {
    return this.request<{ success: boolean; user: User }>('/profile');
  }

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user: User; message: string }> {
    return this.request<{ success: boolean; user: User; message: string }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}

export const apiService = new ApiService(API_BASE_URL);