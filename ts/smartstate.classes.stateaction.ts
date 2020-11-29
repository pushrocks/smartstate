import * as plugins from './smartstate.plugins';
import { StatePart } from './smartstate.classes.statepart';

export interface IActionDef<TStateType, TActionPayloadType> {
  (stateArg: StatePart<any, TStateType>, actionPayload: TActionPayloadType): Promise<TStateType>;
}

/**
 * an actionmodifier for the state
 */
export class StateAction<TStateType, TActionPayloadType> {
  constructor(
    public statePartRef: StatePart<any, any>,
    public actionDef: IActionDef<TStateType, TActionPayloadType>
  ) {}

  public trigger(payload: TActionPayloadType) {
    this.statePartRef.dispatchAction(this, payload);
  }
}
