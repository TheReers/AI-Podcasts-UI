import { Schema, model, models } from 'mongoose'
import { BaseModelClient, IBaseModel } from './base.model'

export interface IUser extends IBaseModel {
    name: string
    email: string
    password: string
    is_verified: boolean
    tokens: {
        auth: {
            access?: string
            refresh?: string
        }
    }
}

export interface UserClient extends BaseModelClient {
    name: string
    email: string
    is_verified: boolean
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    is_verified: { type: Boolean, default: true },
    tokens: {
        auth: {
            access: String,
            refresh: String
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// json
userSchema.methods.toJSON = function (): UserClient {
    const student = this as IUser
    return {
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        is_verified: student.is_verified,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt
    }
}

const userModel = models.User<IUser> ||  model<IUser>('User', userSchema)

export const createNewUser = async (data: Partial<IUser>) => {
    try {
        const user = await userModel.create(data)
        return { data: user }
    } catch (err) {
        const error = err as unknown as Error & { code: number } 
        console.log('error creating user', error)

        if (error.code === 11000) {
            return { error: 'Account already exist', status: 400 }
        }

        return { error: 'Something went wrong', status: 500 }
    }
}

export default userModel
