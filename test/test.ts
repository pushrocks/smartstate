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
    .select(state => state.deep)
    .subscribe(substate => {
      console.log(substate);
    });
});

tap.test('should dispatch a state action', async () => {});

tap.start();
