import { Schema, model, models } from 'mongoose'
import { BaseModelClient, IBaseModel, getModel } from './base.model'

export interface IPodcast extends IBaseModel {
    name: string
    url?: string
    duration: number
    uploader_public_id: string
    slug: string
    user: Schema.Types.ObjectId
}

export interface PodcastClient extends BaseModelClient {
    name: string
    /**
     * Public url of the podcast
     */
    url?: string
    slug: string
    uploader_public_id?: string
    /**
     * Duration of the podcast in seconds
     */
    duration: number
    user: string
}

const podcastSchema = new Schema<IPodcast>({
    name: { type: String, required: true },
    slug: { type: String, required: true },
    url: { type: String },
    uploader_public_id: { type: String },
    duration: { type: Number, min: 0 },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// json
podcastSchema.methods.toJSON = function (): PodcastClient {
    const podcast = this as IPodcast
    return {
        _id: podcast._id.toString(),
        name: podcast.name,
        slug: podcast.slug,
        url: podcast.url,
        user: podcast.user.toString(),
        duration: podcast.duration,
        createdAt: podcast.createdAt,
        updatedAt: podcast.updatedAt
    }
}

const podcastModel = getModel('Podcast', podcastSchema)

export const createNewPodcast = async (data: Partial<PodcastClient>) => {
    try {
        const podcast = await podcastModel.create(data)
        return { data: podcast }
    } catch (err) {
        const error = err as unknown as Error & { code: number } 
        console.log('error saving podcast to db', error)

        return { error: 'Something went wrong', message: 'Error saving podcast to db' }
    }
}

export default podcastModel
