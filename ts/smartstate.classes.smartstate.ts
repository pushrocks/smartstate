import * as plugins from './smartstate.plugins';
import { StatePart } from './smartstate.classes.statepart';

/**
 * Smartstate takes care of providing state
 */
export class Smartstate<StatePartNameType> {
  public statePartMap: { [key: string]: StatePart<StatePartNameType, any> } = {};

  constructor() {}

  public getStatePart<PayloadType>(
    statePartNameArg: StatePartNameType,
    initialArg?: PayloadType
  ): StatePart<StatePartNameType, PayloadType> {
    if (this.statePartMap[statePartNameArg as any]) {
      if (initialArg) {
        throw new Error(
          `${statePartNameArg} already exists, yet you try to set an initial state again`
        );
      }
      return this.statePartMap[statePartNameArg as any];
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

  /**
   * dispatches an action on the main level
   */
  public dispatch() {}
}
