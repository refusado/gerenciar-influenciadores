export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  createdAdmin: {
    id: number;
    name: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  loggedAdmin: {
    id: number;
    name: string;
    email: string;
  };
}
