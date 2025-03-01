import ModelError from "@/components/models/model_error";
import { router } from "@/lib/url";
import { getModels } from "@/server/models/get_models";
import { redirect } from "next/navigation";

export default async function Page() {
    const models = await getModels();

    if (models.length > 0) {
        redirect(router().models().instances().model(models[0]._id));
    }

    else return <ModelError />
}


