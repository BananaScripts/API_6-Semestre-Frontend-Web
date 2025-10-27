import {
  Usuario,
  CreateUsuario,
  UpdateUsuario,
  LoginRequest,
  LoginResponse,
  Venda,
  Estoque,
  EmailRequest,
  EmailResponse,
  UploadResponse,
  HealthResponse,
  PaginationParams,
  UploadType,
  ApiError,
} from "@/types/api";

// Base API configuration
// Usando prefixo /api para aproveitar o proxy definido em vite.config.ts e evitar CORS
const API_BASE_URL = "/api";

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("access_token");
  }

  // Helper method to get headers
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle API responses
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(error.detail);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Set token for authenticated requests
  setToken(token: string) {
    this.token = token;
    localStorage.setItem("access_token", token);
  }

  // Clear token
  clearToken() {
    this.token = null;
    localStorage.removeItem("access_token");
  }

  // 🔐 Authentication Routes

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await fetch(`${this.baseUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const result = await this.handleResponse<LoginResponse>(response);
    
    // Store token after successful login
    this.setToken(result.access_token);
    
    return result;
  }

  // 👤 User Management Routes

  async createUser(userData: CreateUsuario): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuario`, {
      method: "POST",
      headers: this.getHeaders(false), // No auth needed for registration
      body: JSON.stringify(userData),
    });

    return this.handleResponse<Usuario>(response);
  }

  async getUser(userId: number): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuario/${userId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<Usuario>(response);
  }

  async updateUser(userId: number, userData: UpdateUsuario): Promise<Usuario> {
    const response = await fetch(`${this.baseUrl}/usuario/${userId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<Usuario>(response);
  }

  async deleteUser(userId: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/usuario/${userId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    await this.handleResponse<void>(response);
  }

  // 📊 Data Routes

  async getVendas(params: PaginationParams = {}): Promise<Venda[]> {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/vendas${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<Venda[]>(response);
  }

  async getEstoque(params: PaginationParams = {}): Promise<Estoque[]> {
    const searchParams = new URLSearchParams();
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${this.baseUrl}/estoque${searchParams.toString() ? `?${searchParams.toString()}` : ""}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    return this.handleResponse<Estoque[]>(response);
  }

  // 📁 File Upload Routes

  async uploadFile(tipo: UploadType, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/upload/${tipo}`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, let the browser set it
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    return this.handleResponse<UploadResponse>(response);
  }

  // 📧 Email/Reports Routes

  async sendReport(
    emailData: EmailRequest,
    assunto: string,
    corpo: string
  ): Promise<EmailResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append("assunto", assunto);
    searchParams.append("corpo", corpo);

    const response = await fetch(
      `${this.baseUrl}/relatorios/enviar?${searchParams.toString()}`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(emailData),
      }
    );

    return this.handleResponse<EmailResponse>(response);
  }

  // 🏥 Health Check

  async healthCheck(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/`, {
      method: "GET",
      headers: this.getHeaders(false), // No auth needed for health check
    });

    return this.handleResponse<HealthResponse>(response);
  }

  // 🔍 Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // 📄 Get current token
  getToken(): string | null {
    return this.token;
  }

  // 🔗 Check API connectivity
  async checkConnectivity(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing purposes
export { ApiService };