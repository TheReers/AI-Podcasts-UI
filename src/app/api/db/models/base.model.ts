import { Schema, model, models, Document, Model } from 'mongoose'

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

export const getModel = <T extends IBaseModel>(modelName: string, schema: Schema<T>) => {
    if (models[modelName]) {
        return models[modelName] as Model<T>
    } else {
        return model<T>(modelName, schema)
    }
}
