import * as plugins from './smartstate.plugins';

import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil, map } from 'rxjs/operators';

import { StateAction } from './smartstate.classes.stateaction';

export class StatePart<StatePartNameType, PayloadType> {
  name: StatePartNameType;
  state = new Subject<PayloadType>();
  stateStore: PayloadType;

  constructor(nameArg: StatePartNameType) {
    this.name = nameArg;
  }

  /**
   * gets the state from the state store
   */
  getState(): PayloadType {
    return this.stateStore;
  }

  /**
   * sets the stateStore to the new state
   * @param newStateArg
   */
  setState(newStateArg: PayloadType) {
    this.stateStore = newStateArg;
    this.notifyChange();
  }

  /**
   * notifies of a change on the state
   */
  notifyChange() {
    this.state.next(this.stateStore);
  }

  /**
   * selects a state or a substate
   */
  select<T = PayloadType>(selectorFn?: (state: PayloadType) => T): Observable<T> {
    if (!selectorFn) {
      selectorFn = (state: PayloadType) => <T>(<any>state);
    }

    const mapped = this.state.pipe(
      startWith(this.getState()),
      map(selectorFn)
    );

    return mapped;
  }

  /**
   * dispatches an action on the statepart level
   */
  async dispatch(stateAction: StateAction<PayloadType>) {
    const newState = stateAction.actionDef(this.getState());
    this.setState(newState);
  }
}
