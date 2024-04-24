import mongoose from 'mongoose'
import envs from '../envs'

let client: mongoose.Connection

export const connectToDB = async () => {
    const url = envs.dbUri
    if (!url) {
        return { error: 'No database url set' }
    }

    if (!client) {
        console.log('setting db client')
        const connect = await mongoose.connect(url)
        client = connect.connection
    }

    return {
        data: client
    }
}
