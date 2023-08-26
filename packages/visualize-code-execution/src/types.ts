export type Step = Array<Frame>;

export interface VariableContent {
  type: string;
  value: string;
}

export type Variables = Record<string, VariableContent>;

export interface Frame {
  fn_name: string;
  line: number;
  variables: Variables;
}
