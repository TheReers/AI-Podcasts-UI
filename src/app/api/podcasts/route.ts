import { requiresLogin } from '../middlewares/requires_login.middleware'
import { createPodcast } from './create_podcast.route'
import { getUserPodcasts } from './get_user_podcasts.route'

export const POST = requiresLogin(createPodcast)
export const GET = requiresLogin(getUserPodcasts)
