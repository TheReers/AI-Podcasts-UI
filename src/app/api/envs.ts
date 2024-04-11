/**
 * This file is used to store all the environment variables that are used in the application.
 * It serves as a single source of truth for all the environment variables.
 * As a result, calling process.env.* outside of this file is discouraged.
 * All environment variables are prefixed with NEXT_ as suggested by Next.js.
 */
const envs = {
    openAI: {
        apiKey: process.env.NEXT_OPEN_AI_API_KEY || ''
    },
    elevenLabs: {
        apiKey: process.env.NEXT_ELEVEN_LABS_API_KEY || ''
    },
    secretKey: process.env.NEXT_SECRET_KEY || '',
    dbUri: process.env.NEXT_DB_URI || '',
    imageUpload: {
        cloudName: process.env.NEXT_CLOUDINARY_NAME || '',
        apiKey: process.env.NEXT_CLOUDINARY_API_KEY || '',
        apiSecret: process.env.NEXT_CLOUDINARY_API_SECRET || ''
    }
}

export default envs
