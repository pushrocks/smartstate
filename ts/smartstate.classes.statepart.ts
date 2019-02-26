import * as plugins from './smartstate.plugins';

import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil, map } from 'rxjs/operators';

import { StateAction, IActionDef } from './smartstate.classes.stateaction';

export class StatePart<TStatePartName, TStatePayload> {
  name: TStatePartName;
  state = new Subject<TStatePayload>();
  stateStore: TStatePayload;

  constructor(nameArg: TStatePartName) {
    this.name = nameArg;
  }

  /**
   * gets the state from the state store
   */
  getState(): TStatePayload {
    return this.stateStore;
  }

  /**
   * sets the stateStore to the new state
   * @param newStateArg
   */
  setState(newStateArg: TStatePayload) {
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
  select<T = TStatePayload>(selectorFn?: (state: TStatePayload) => T): Observable<T> {
    if (!selectorFn) {
      selectorFn = (state: TStatePayload) => <T>(<any>state);
    }

    const mapped = this.state.pipe(
      startWith(this.getState()),
      map(selectorFn)
    );

    return mapped;
  }

  /**
   * creates an action capable of modifying the state
   */
  createAction <TActionPayload>(actionDef: IActionDef<TStatePayload, TActionPayload>): StateAction<TStatePayload, TActionPayload> {
    return new StateAction(actionDef);
  }

  /**
   * dispatches an action on the statepart level
   */
  async dispatchAction<T>(stateAction: StateAction<TStatePayload, T>, actionPayload: T) {
    const newState = await stateAction.actionDef(this, actionPayload);
    this.setState(newState);
  }
}
