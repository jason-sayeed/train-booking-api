declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URL: string;
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    SESSION_SECRET: string;
  }
}
