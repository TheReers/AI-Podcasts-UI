import podcastModel from '../../db/models/podcast.model'
import { requiresLogin } from '../../middlewares/requires_login.middleware'
import { Handler } from '../../middlewares/types'

const getUserPodcasts: Handler = async (req, { params }) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const podcast = await podcastModel.findOne({ user: user._id, _id: params.id })
    if (!podcast) {
        return Response.json({ message: 'Podcast not found' }, { status: 404 })
    }

    return Response.json({
        data: podcast.toJSON(),
        message: 'Podcast fetched successfully'
    })
}

export const GET = requiresLogin(getUserPodcasts)
