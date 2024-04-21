import { ObjectId } from 'mongoose'
import podcastModel from '../db/models/podcast.model'
import { Handler } from '../middlewares/types'

export const getUserPodcasts: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const slugFilter = req.nextUrl.searchParams.get('slug')
    const filter: { user: ObjectId; slug?: RegExp } = { user: user._id }
    if (slugFilter) {
        filter.slug = new RegExp(slugFilter.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''), 'i')
    }

    const podcasts = await podcastModel
        .find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })

    return Response.json({
        data: podcasts.map((podcast) => podcast.toJSON()),
        message: 'Podcasts fetched successfully'
    })
}
