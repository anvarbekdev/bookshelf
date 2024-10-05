export interface User {
  email: string;
  id: number;
  key: string;
  name: string;
  secret: string;
}

export interface ApiResponse {
  data: User;
  isOk: boolean;
  message: string;
}
