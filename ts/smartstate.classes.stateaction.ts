import * as plugins from './smartstate.plugins';

/**
 * an actionmodifier for the state
 */
export class StateAction<StatePayload> {
  constructor(public actionDef: (stateArg: StatePayload) => StatePayload) {}
}
