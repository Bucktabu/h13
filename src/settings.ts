export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb://0.0.0.0:27017/blogPlatform?maxPoolSize=20&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  BASIC_USER: 'admin',
  BASIC_PASS: 'qwerty',
  TIME_TO_EXPIRED_AT: '10000', // Time life for accessToken
  TIME_TO_EXPIRED_RT: '20000', // Time life for refreshToken
  CONNECTION_TIME_LIMIT: '10000',
  CONNECTION_COUNT_LIMIT: '5',
  environment: 'dev',
};
