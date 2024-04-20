import podcastModel from '../db/models/podcast.model'
import { Handler } from '../middlewares/types'

export const getUserPodcasts: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const podcasts = await podcastModel
        .find({ user: user._id })
        .sort({ updatedAt: -1, createdAt: -1 })

    return Response.json({
        data: podcasts.map((podcast) => podcast.toJSON()),
        message: 'Podcasts fetched successfully'
    })
}
