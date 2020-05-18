import { expect, tap } from '@pushrocks/tapbundle';
import * as smartstate from '../ts/index';

type TMyStateParts = 'testStatePart';
interface TStatePartPayload {
  currentFavorites: string[];
  deep: {
    hi: number;
  };
}

let testState: smartstate.Smartstate<TMyStateParts>;
let testStatePart: smartstate.StatePart<TMyStateParts, TStatePartPayload>;

tap.test('should create a new SmartState', async () => {
  testState = new smartstate.Smartstate<TMyStateParts>();
  expect(testState).to.be.instanceOf(smartstate.Smartstate);
});

tap.test('should create a new StatePart', async () => {
  testStatePart = testState.getStatePart<TStatePartPayload>('testStatePart', {
    currentFavorites: [],
    deep: {
      hi: 2
    }
  });
  expect(testStatePart).to.be.instanceOf(smartstate.StatePart);
  console.log(testStatePart);
});

tap.test('should select something', async () => {
  testStatePart
    .select(state => state.deep.hi)
    .subscribe(substate => {
      expect(substate).to.equal(2);
    });
});

tap.test('should dispatch a state action', async tools => {
  const done = tools.defer();
  const addFavourite = testStatePart.createAction<string>(async (statePart, payload) => {
    const currentState = statePart.getState();
    currentState.currentFavorites.push(payload);
    return currentState;
  });
  testStatePart
    .waitUntilPresent(state => {
      return state.currentFavorites[0];
    })
    .then(() => {
      done.resolve();
    });
  await testStatePart.dispatchAction(addFavourite, 'my favourite things');
  expect(testStatePart.getState().currentFavorites).to.include('my favourite things');
  await done.promise;
});

tap.start();
