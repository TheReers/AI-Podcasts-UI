import mongoose from 'mongoose'
import envs from '../envs'

let client: mongoose.Connection
let now: number

export const connectToDB = async () => {
    const url = envs.dbUri
    if (!url) {
        return { error: 'No database url set' }
    }

    if (!client) {
        const connect = await mongoose.connect(url)
        client = connect.connection
        now = Date.now()
    }

    return {
        data: client
    }
}
