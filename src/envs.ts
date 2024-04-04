/**
 * This file is used to store all the environment variables that are used on the client side of the application.
 * It serves as a single source of truth for all the environment variables.
 * As a result, calling process.env.* outside of this file is discouraged.
 */
const envs = {
    nextAuthSecret: process.env.NEXTAUTH_SECRET || '',
    baseUrl: process.env.REACT_APP_BASE_URL || 'http://localhost:3000',
}

export default envs
