export type RouteRow = {
  id: string;
  routerId: string;
  instanceId: string;
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