import * as plugins from './smartstate.plugins';
import { StateAction, IActionDef } from './smartstate.classes.stateaction';

export class StatePart<TStatePartName, TStatePayload> {
  public name: TStatePartName;
  public state = new plugins.smartrx.rxjs.Subject<TStatePayload>();
  public stateStore: TStatePayload;

  constructor(nameArg: TStatePartName) {
    this.name = nameArg;
  }

  /**
   * gets the state from the state store
   */
  public getState(): TStatePayload {
    return this.stateStore;
  }

  /**
   * sets the stateStore to the new state
   * @param newStateArg
   */
  public setState(newStateArg: TStatePayload) {
    this.stateStore = newStateArg;
    this.notifyChange();
  }

  /**
   * notifies of a change on the state
   */
  public notifyChange() {
    this.state.next(this.stateStore);
  }

  /**
   * selects a state or a substate
   */
  public select<T = TStatePayload>(
    selectorFn?: (state: TStatePayload) => T
  ): plugins.smartrx.rxjs.Observable<T> {
    if (!selectorFn) {
      selectorFn = (state: TStatePayload) => <T>(<any>state);
    }

    const mapped = this.state.pipe(
      plugins.smartrx.rxjs.ops.startWith(this.getState()),
      plugins.smartrx.rxjs.ops.map((stateArg) => {
        try {
          return selectorFn(stateArg);
        } catch (e) {
          // Nothing here
        }
      })
    );

    return mapped;
  }

  /**
   * creates an action capable of modifying the state
   */
  public createAction<TActionPayload>(
    actionDef: IActionDef<TStatePayload, TActionPayload>
  ): StateAction<TStatePayload, TActionPayload> {
    return new StateAction(this, actionDef);
  }

  /**
   * dispatches an action on the statepart level
   */
  public async dispatchAction<T>(stateAction: StateAction<TStatePayload, T>, actionPayload: T) {
    const newState = await stateAction.actionDef(this, actionPayload);
    this.setState(newState);
  }

  /**
   * waits until a certain part of the state becomes available
   * @param selectorFn
   */
  public async waitUntilPresent<T = TStatePayload>(
    selectorFn?: (state: TStatePayload) => T
  ): Promise<T> {
    const done = plugins.smartpromise.defer<T>();
    const selectedObservable = this.select(selectorFn);
    const subscription = selectedObservable.subscribe(async (value) => {
      if (value) {
        done.resolve(value);
      }
    });
    const result = await done.promise;
    subscription.unsubscribe();
    return result;
  }
}
