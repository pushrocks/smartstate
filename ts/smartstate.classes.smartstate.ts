import * as plugins from './smartstate.plugins';
import { StatePart } from './smartstate.classes.statepart';

/**
 * Smartstate takes care of providing state
 */
export class Smartstate<StatePartNameType> {
  public statePartMap: { [key: string]: StatePart<StatePartNameType, unknown> } = {};

  constructor() {}

  public getStatePart<PayloadType>(
    statePartNameArg: string & StatePartNameType,
    initialArg?: PayloadType,
    initMode?: 'soft' | 'mandatory'
  ): StatePart<StatePartNameType, PayloadType> {
    if (this.statePartMap[statePartNameArg as any]) {
      if (initialArg && (!initMode || initMode !== 'soft')) {
        throw new Error(
          `${statePartNameArg} already exists, yet you try to set an initial state again`
        );
      }
      return this.statePartMap[statePartNameArg] as StatePart<StatePartNameType, PayloadType>;
    } else {
      if (!initialArg) {
        throw new Error(
          `${statePartNameArg} does not yet exist, yet you don't provide an initial state`
        );
      }
      return this.createStatePart<PayloadType>(statePartNameArg, initialArg);
    }
  }

  /**
   * creates a statepart
   * @param statePartName
   * @param initialPayloadArg
   */
  private createStatePart<PayloadType>(
    statePartName: StatePartNameType,
    initialPayloadArg: PayloadType
  ): StatePart<StatePartNameType, PayloadType> {
    const newState = new StatePart<StatePartNameType, PayloadType>(statePartName);
    newState.setState(initialPayloadArg);
    this.statePartMap[statePartName as any] = newState;
    return newState;
  }
}
