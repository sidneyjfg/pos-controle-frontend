export interface ApiCredentials {
  id: number;
  userApi: string;
  passwordApi: string;
  subscriptionKey: string;
  jwt?: string | null;
  jwtExpiresAt?: string | null;
}

export interface UpdateApiCredentialsDTO {
  userApi: string;
  passwordApi: string;
  subscriptionKey: string;
}

export interface CreateApiCredentialsDTO {
  userApi: string;
  passwordApi: string;
  subscriptionKey: string;
}
