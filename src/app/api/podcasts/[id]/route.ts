import podcastModel from '../../db/models/podcast.model'
import { requiresLogin } from '../../middlewares/requires_login.middleware'
import { Handler } from '../../middlewares/types'
import { deleteFileFromCloudinary } from '../../utils/save_and_delete_file.util'

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

const deleteUserPodcast: Handler = async (req, { params }) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const podcast = await podcastModel.findOneAndDelete({ user: user._id, _id: params.id })
    if (!podcast) {
        return Response.json({ message: 'Podcast not found' }, { status: 404 })
    }

    await deleteFileFromCloudinary(podcast.uploader_public_id)

    return Response.json({
        data: podcast.toJSON(),
        message: 'Podcast deleted successfully'
    })
}

export const GET = requiresLogin(getUserPodcasts)
export const DELETE = requiresLogin(deleteUserPodcast)
