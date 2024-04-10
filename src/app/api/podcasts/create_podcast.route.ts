import getMP3Duration from 'get-mp3-duration'
import AI from '../utils/ai_generation.util'
import { Handler } from '../middlewares/types'
import { uploadFileToCloudinary } from '../utils/save_and_delete_file.util'
import podcastModel, { IPodcast, createNewPodcast } from '../db/models/podcast.model'

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

export const createPodcast: Handler = async (req) => {
  const { user } = req
  if (!user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { message } = await req.json()
  if (!message) {
    return Response.json({ error: 'message is required' }, { status: 400 })
  }

  const slug = message.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const podcastExist = await podcastModel.findOne({ slug })
  if (podcastExist) {
    if (podcastExist.user.toString() !== user._id.toString()) {
        const duplicatePodcastResult = await duplicatePodcast(podcastExist, user._id.toString())

        if (duplicatePodcastResult.error || !duplicatePodcastResult.data) {
            return Response.json(duplicatePodcastResult, { status: 400 })
        }

        return Response.json({
            message: 'Podcast created successfully',
            data: duplicatePodcastResult.data.toJSON()
        }, { status: 201 })
    }

    return Response.json({ message: 'Podcast already exist', data: podcastExist.toJSON() }, { status: 409 })
  }

  Response.json({ message: 'Creating podcast', data: { slug } }, { status: 201 })

  const ai = new AI()
  const messageResponse = await ai.generatePodcastText(message)
  if (messageResponse.error || !messageResponse.data) {
    return Response.json(messageResponse, { status: 400 })
  }

  const audioResponse = await ai.convertToAudio(messageResponse.data)
  if (audioResponse.error || !audioResponse.data) {
    return Response.json(audioResponse, { status: 400 })
  }

  const uploadResult = await uploadFileToCloudinary({
    data: audioResponse.data,
    filename: `${slug}.mp3`,
    folder: 'podcasts',
  })


  if (uploadResult.error || !uploadResult.data) {
    return Response.json(uploadResult, { status: 400 })
  }

  const duration = getMP3Duration(audioResponse.data)
  const createPodcast = await createNewPodcast({
    name: message,
    slug,
    duration,
    url: uploadResult.data.secure_url,
    uploader_public_id: uploadResult.data.public_id,
    user: user._id.toString()
  })

    if (createPodcast.error || !createPodcast.data) {
        return Response.json(createPodcast, { status: 400 })
    }

    return Response.json({ message: 'Podcast created successfully', data: createPodcast.data.toJSON() }, { status: 201 })
}
