import { Schema, Document } from 'mongoose'

export interface IBaseModel extends Document {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface BaseModelClient {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
