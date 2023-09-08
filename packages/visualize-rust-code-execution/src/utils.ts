import { Frame } from "types";

export type VariablesChanged = Record<
  string,
  {
    newFrame: boolean;
    variables: Record<
      string,
      {
        name: boolean;
        type: boolean;
        value: boolean;
      }
    >;
  }
>;
export function computeChanged(
  oldFrames: Frame[],
  newFrames: Frame[]
): VariablesChanged {
  const changed: VariablesChanged = {};

  for (const newFrame of newFrames) {
    changed[newFrame.fn_name] = {
      newFrame: false,
      variables: {},
    };
    const oldFrame = oldFrames.find(
      (oldFrame) => oldFrame.fn_name === newFrame.fn_name
    );
    if (!oldFrame) {
      // This frame is new
      changed[newFrame.fn_name].newFrame = true;
    } else {
      // Frame is the same
      for (const [newVarName, newVarContents] of Object.entries(
        newFrame.variables
      )) {
        const oldVariableContent = oldFrame.variables[newVarName];
        if (oldVariableContent) {
          if (oldVariableContent.address !== newVarContents.address) {
            // This is a new variable
            changed[newFrame.fn_name].variables[newVarName] = {
              name: true,
              type: true,
              value: true,
            };
          } else {
            const typeChanged = oldVariableContent.type !== newVarContents.type;
            const valueChanged =
              oldVariableContent.value !== newVarContents.value;

            changed[newFrame.fn_name].variables[newVarName] = {
              name: false,
              type: typeChanged,
              value: valueChanged,
            };
          }
        } else {
          // This is a new variable
          changed[newFrame.fn_name].variables[newVarName] = {
            name: true,
            type: true,
            value: true,
          };
        }
      }
    }
  }

  return changed;
}
