export const settings = {
  MONGO_URI:
    process.env.mongoURI ||
    'mongodb://0.0.0.0:27017/blogPlatform?maxPoolSize=20&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || '123',
  BASIC_USER: 'admin',
  BASIC_PASS: 'qwerty',
  TIME_TO_EXPIRED_AT: '300000', // Time life for accessToken: 5 min
  TIME_TO_EXPIRED_RT: '600000' // Time life for refreshToken: 10 min
};
