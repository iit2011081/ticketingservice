import dotenv from 'dotenv'
dotenv.config();
const config = {
	port: process.env.PORT || 8081,
	accessTokenLifetime: process.env.ACCESS_TOKEN_EXPIRY_SECONDS || 86400,
	jwtIssuer : process.env.JWT_ISSUER || 'ticketservice',
	jwtSecretAccessToken: process.env.SECRET || 'HCBA9cO9fM9N7bpHOV4cBFUqrYnrTQx6',
	jwtSecretRefreshToken: process.env.REFRESH_SECRET || 'VLxBQkBOteTi65ZLbliFg8pObmjN58AW',
	DB: {
		username: process.env.POSTGRES_USER || 'root',
		password: process.env.POSTGRES_PASSWORD || 'password',
		database: process.env.DATABASE || 'ticketing_system',
		host: process.env.POSTGRES_HOST || 'localhost',
		port: process.env.POSTGRES_PORT || '5432',
		dialect: 'postgres',
	},
	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: process.env.REDIS_PORT || '6379',
		password: process.env.REDIS_PASSWORD || ''
	}
};
export default config