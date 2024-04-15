import getMP3Duration from 'get-mp3-duration'
import AI from '../utils/ai_generation.util'
import { Handler } from '../middlewares/types'
import { uploadFileToCloudinary } from '../utils/save_and_delete_file.util'
import podcastModel, { IPodcast, createNewPodcast } from '../db/models/podcast.model'
import { IUser } from '../db/models/user.model'
import parseRequestBody from '../utils/get_request_body.util'

const ai = new AI()

const duplicatePodcast = async (podcast: IPodcast, user: string) => {
    const createPodcast = await createNewPodcast({
        name: podcast.name,
        slug: podcast.slug,
        duration: podcast.duration,
        url: podcast.url,
        user
    })

    return createPodcast
}

type DuplicatePodcastData = {
    statusCode?: number
} & ({
    message: string
    status: 'duplicated' | 'conflict'
    data: IPodcast
} | {
    error: string
})

const duplicatePodcastData = async (podcast: IPodcast, user: IUser) => {
    if (podcast.user.toString() !== user._id.toString()) {
        const duplicatePodcastResult = await duplicatePodcast(podcast, user._id.toString())
        if (duplicatePodcastResult.error || !duplicatePodcastResult.data) {
            return duplicatePodcastResult
        }

        return {
            statusCode: 201,
            message: 'Podcast created successfully',
            status: 'duplicated',
            data: duplicatePodcastResult.data.toJSON()
        }
    }

    return {
        statusCode: 200,
        message: 'Podcast already exist',
        status: 'conflict',
        data: podcast.toJSON()
    }
}

const createPodcastText = async ({
    message, user_id
}: {
    message: string
    user_id: string
}) => {
    const slug = message.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    const messageResponse = await ai.generatePodcastText(message)
    if (messageResponse.error || !messageResponse.data) {
        return messageResponse
    }

    const createPodcast = await createNewPodcast({
        name: message,
        slug,
        user: user_id,
        text: messageResponse.data
    })

    return createPodcast
}

const createPodcastAudio = async (podcast: IPodcast) => {
    const audioResponse = await ai.convertToAudio(podcast.text)
    if (audioResponse.error || !audioResponse.data) {
        return { error: audioResponse.error || 'Something went wrong', message: 'Failed to generate audio' }
    }

    const uploadResult = await uploadFileToCloudinary({
        data: audioResponse.data,
        filename: `${podcast.slug}.mp3`,
        folder: 'podcasts',
    })

    if (uploadResult.error || !uploadResult.data) {
        return uploadResult
    }

    const duration = getMP3Duration(audioResponse.data)
    podcast.duration = duration
    podcast.url = uploadResult.data.secure_url
    podcast.uploader_public_id = uploadResult.data.public_id
    await podcast.save()

    return { data: podcast }
}

const generatePodcastText = async (message: string, user: IUser) => {
    const messageSlug = message.toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

    const podcastExist = await podcastModel.findOne({ slug: messageSlug })

    // If the podcast has been fully created, i.e a url for the podcast has been generated,
    // Or if the podcast text has been created,
    // we want to do:
    // 1. check if the creator is the requester and we return a duplicate response(conflict)
    // 2. if it's a different user we duplicate the podcast.
    if (podcastExist?.url || podcastExist?.text) {
        if (podcastExist.user.toString() !== user._id.toString()) {
            const duplicatePodcastResult = await duplicatePodcast(podcastExist, user._id.toString())
            if (duplicatePodcastResult.error || !duplicatePodcastResult.data) {
                return Response.json(duplicatePodcastResult, { status: 400 })
            }
    
            return Response.json({
                message: 'Podcast created successfully',
                status: 'duplicated',
                data: duplicatePodcastResult.data.toJSON()
            }, { status: 201 })
        }
    
        return Response.json({
            message: 'Podcast already exist',
            status: 'conflict',
            data: podcastExist.toJSON()
        })
    }

    const podcastData = await createPodcastText({ message, user_id: user._id.toString() })
    if (podcastData.error || !podcastData.data) {
        return Response.json(podcastData, { status: 400 })
    }

    return Response.json(podcastData)
}

/**
 * Generates podcast audio
 * This function is used to convert the text of a podcast to audio
 */
const generatePodcastAudio = async (slug: string, user: IUser) => {
    // If the podcast has been fully created, i.e a url for the podcast has been generated,
    // we want to do:
    // 1. check if the creator is the requester and we return a duplicate error(conflict)
    // 2. if it's a different user we duplicate the podcast.
    // Or if the podcast text has been created,
    // we want to generate the audio and update,
    // if the text was not saved return an error (this shouldn't happen)
    const podcastExist = await podcastModel.findOne({ slug })
    if (!podcastExist) {
        return Response.json({ message: 'Podcast not found' })
    }

    // This should never happen
    if (!podcastExist.text) {
        return Response.json({ message: 'Something went wrong' })
    }

    // If the podcast has been fully created, i.e a url for the podcast has been generated,
    if (podcastExist?.url) {
        return Response.json({
            message: 'Podcast audio already generated',
            status: 'conflict',
            data: podcastExist.toJSON()
        })
    }

    const podcastData = await createPodcastAudio(podcastExist)
    if (podcastData.error || !podcastData.data) {
        return Response.json(podcastData, { status: 400 })
    }

    return Response.json(podcastData)
}

export const createPodcast: Handler = async (req) => {
    const { user } = req
    if (!user) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await parseRequestBody(req)
    if (!body) {
        return Response.json({ message: 'Invalid request payload provided' }, { status: 400 })
    }

    const { message, slug } = body
    if ((!message && !slug) || (message && slug)) {
        return Response.json({
            message: 'Invalid request payload provided',
            errors: { message: 'Only one of message or slug is required' }
        }, { status: 400 })
    }

    // Podcast is a new one, we want to just generate the text for the podcast
    if (message) {
        return generatePodcastText(message, user)
    }

    // Podcast text has been created, we want to generate the audio and update
    return generatePodcastAudio(slug, user)
}
