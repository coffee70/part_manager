export type RouteRow = {
  id: string;
  instanceId: string;
};

export type RouteEdge = {
  id: string;
  sourceId: string;
  targetId: string;
};

export type RouteFormState = {
  routerId: string | null;
  route: RouteEdge[];
};

export type RouterType = {
  _id: string;
  name: string;
  [key: string]: any;
};

export type InstanceType = {
  _id: string;
  number: string;
  [key: string]: any;
}; 