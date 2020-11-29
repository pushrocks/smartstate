import * as plugins from './smartstate.plugins';
import { StatePart } from './smartstate.classes.statepart';

/**
 * A StatePartCollection is a collection of StateParts.
 * It can be used for expressing interest in a certain set of StateParts.
 */
export class StatePartCollection<StatePartNameType, T> extends StatePart<StatePartNameType, T> {
  constructor(nameArg: StatePartNameType) {
    super(nameArg);
  }
}
