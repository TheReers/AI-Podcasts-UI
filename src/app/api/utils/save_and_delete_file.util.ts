import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import { Readable } from 'stream'
import envs from '../envs'

cloudinary.config({
	cloud_name: envs.imageUpload.cloudName,
	api_key: envs.imageUpload.apiKey,
	api_secret: envs.imageUpload.apiSecret,
})

const upload = async (data: Buffer, filename: string, folder: string) => {
    return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            type: 'upload',
            filename_override: filename,
            use_filename: true,
            unique_filename: true,
            folder,
        }, (error, result) => {
            if (result) {
                resolve(result)
            }
            if (error) {
                reject(error)
            }
        })

        Readable.from(data).pipe(stream)
    })
}

export const uploadFileToCloudinary = async ({
    data, filename, folder
}: {
    data: Buffer, filename: string, folder: string
}) => {
    const start = Date.now()
    try {
        const uplodResp = await upload(data, filename, folder)
        console.log(`Time taken to upload file to cloudinary: ${(Date.now() - start)}ms`)

        return {
            data: uplodResp
        }
    } catch (error) {
        console.log('error saving file to cloudinary', error)
        return { error: (error as Error).message, message: 'Error saving file to cloudinary' }
    }
}

export const deleteAudioFromCloudinary = async (publicId: string) => {
    try {
        const deleteResp = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video',
            type: 'upload',
            invalidate: true
        })

        return {
            data: deleteResp
        }
    } catch (error) {
        console.log('error deleting file from cloudinary', error)
        return { error: (error as Error).message }
    }
}
