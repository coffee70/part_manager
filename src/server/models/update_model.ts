'use server'
import { Model, ModelDoc } from "@/types/collections";
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

type Input = {
    _id: string;
    model: Partial<Model>;
}

export async function updateModel(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { _id, model } = validators.input<Input>(input);

    const modelsCollection = db.collection<ModelDoc>('models');

    await modelsCollection.updateOne({ 
        _id: new ObjectId(_id),
    }, { 
        $set: {
            name: model.name,
            color: model.color,
            attachable: model.attachable,
            linkable: model.linkable,
            commentable: model.commentable,
            updatedAt: new Date(),
            updatedById: user._id
        } 
    });
}

