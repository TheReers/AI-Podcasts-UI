export default async function parseRequestBody(req: Request) {
    try {
        return await req.json()
    } catch (error) {
        return null
    }
}
