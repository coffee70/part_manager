'use server'
import { db } from "@/lib/db";
import { getCurrentSession } from "../auth/get_current_session";
import { validators } from "../validators/validators";
import { Create, ModelDoc } from "@/types/collections";
import { WithoutId } from "mongodb";

type Input = {
    model: Create<ModelDoc>
}

export async function createModel(input: Input) {
    const { user } = await getCurrentSession();
    if (!user || user.role !== 'admin') throw new Error('Unauthorized');

    const { model } = validators.input<Input>(input);

    // create the model
    const modelsCollection = db.collection<WithoutId<ModelDoc>>('models');

    await modelsCollection.insertOne({
        ...model,
        updatedAt: new Date(),
        updatedBy: user._id,
    });
}