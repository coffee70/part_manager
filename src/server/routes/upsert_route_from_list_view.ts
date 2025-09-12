'use server'
import { z } from "zod";
import { getCurrentSession } from "@/server/auth/get_current_session";
import { ActionState, validate } from "@/lib/validators/server_actions";
import { db } from "@/lib/db";
import { InstanceDoc, StepState } from "@/types/collections";
import { ObjectId } from "mongodb";
import { RouteState } from "@/types/collections";
import { RouteSchema } from "@/types/collections";

const InputSchema = z.object({
  modelId: z.string(),
  instanceId: z.string().nullable(),
  route: RouteSchema,
});

export async function upsertRouteFromListView(
  input: z.input<typeof InputSchema>
): Promise<ActionState<typeof InputSchema>> {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Unauthorized");

  const validation = validate(InputSchema, input);
  if (!validation.success) return validation;

  const { modelId, instanceId, route } = validation.data;

  if (!modelId) return { success: false, error: "Model ID is required" };
  if (!instanceId) return { success: false, error: "Instance ID is required" };
  if (!route.routerId) return { success: false, error: "Router ID is required" };

  // Verify router exists
  const routerCollection = db.collection("routers");
  const router = await routerCollection.findOne({ _id: new ObjectId(route.routerId) });
  if (!router) return { success: false, error: "Router not found" };

  // Verify instance exists
  const instanceCollection = db.collection<InstanceDoc>(modelId);
  const instance = await instanceCollection.findOne({ _id: new ObjectId(instanceId) });
  if (!instance) return { success: false, error: "Instance not found" };

  // Verify all instances exist in the router collection
  const routerInstanceCollection = db.collection<InstanceDoc>(route.routerId);

  // validate the incoming route nodes
  if (route.nodes.length === 0) {
    return {
      success: false,
      error: "Route nodes are required"
    };
  }

  for (const node of route.nodes) {
    if (!ObjectId.isValid(node.instanceId)) {
      return {
        success: false,
        error: "Ensure all router instances are filled in and are valid!"
      };
    }
    const routerInstance = await routerInstanceCollection.findOne({ _id: new ObjectId(node.instanceId) });
    if (!routerInstance) {
      return {
        success: false,
        error: `Router instance with ID ${node.instanceId} not found`
      };
    }
  }

  // handle the case where the instance has no route
  if (!instance.route) {
    await instanceCollection.updateOne(
      { _id: new ObjectId(instanceId) },
      {
        $set: {
          route: {
            ...route,
            state: RouteState.Stopped,
            currentStepId: null
          },
          updatedAt: new Date(),
          updatedById: user._id
        }
      }
    );
    return { success: true };
  }

  // ensure the current step id is valid
  let currentIdIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
  // this means the current step was deleted
  if (currentIdIndex === -1) {
    // get the information about the saved current step node
    const savedCurrentStepNode = instance.route.nodes.find(node => node.id === route.currentStepId);

    // set the current step to the earliest step which has not been completed
    // if no step has not been completed, set the current step to null and the state to completed
    const earliestNotCompletedStepId = route.nodes.find(node => node.state !== StepState.Completed)?.id;
    if (earliestNotCompletedStepId) {
      route.currentStepId = earliestNotCompletedStepId;
      route.nodes.forEach(node => {
        if (node.id === route.currentStepId) {
          node.state = savedCurrentStepNode?.state ?? StepState.InProgress;
        }
      })
      currentIdIndex = route.nodes.findIndex(node => node.id === route.currentStepId);
    }
    else {
      route.currentStepId = null;
      route.state = RouteState.Completed;
      currentIdIndex = route.nodes.length;
    }
  }

  // update the route nodes based on the current step id
  route.nodes.forEach(node => {
    if (route.nodes.findIndex(node => node.id === node.id) < currentIdIndex) {
      return {
        ...node,
        state: node.state ?? StepState.Completed
      }
    }
    else if (route.nodes.findIndex(node => node.id === node.id) > currentIdIndex) {
      return {
        ...node,
        state: node.state ?? StepState.NotStarted
      }
    }
    return node;
  })

  // Store the route with the instance
  await instanceCollection.updateOne(
    { _id: new ObjectId(instanceId) },
    {
      $set: {
        route: {
          ...route,
          nodes: route.nodes.map(node => ({
            ...node,
            state: node.state ?? StepState.NotStarted
          })),
        },
        updatedAt: new Date(),
        updatedById: user._id
      }
    }
  );

  return { success: true };
} 