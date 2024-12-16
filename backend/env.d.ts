declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
