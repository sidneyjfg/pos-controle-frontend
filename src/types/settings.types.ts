export interface ApiCredentials {
  id: number;
  userApi: string;
  passwordApi: string;
  subscriptionKey: string;
  webhookUrl?: string | null;
  hasJwt?: boolean;
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
  webhookUrl?: string | null;
}

export interface UpdateWebhookDTO {
  webhookUrl: string | null;
}

export interface RotateApiAccessResponse {
  clientId: string;
  clientSecret: string;
  message: string;
}
