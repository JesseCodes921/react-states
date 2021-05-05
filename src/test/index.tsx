import { render } from '@testing-library/react';
import React from 'react';
import { States } from '..';

export function renderReducerHook<T extends States<any, any>>(
  reducerHookCallback: () => T,
  renderCallback: (UseStates: React.FC) => Parameters<typeof render>[0],
) {
  // We create an emmpty context object only used for the testing, this
  // context will be mutated with any updates from the statesReducer.
  // NOTE! This strategy will not allow to compare the context object
  // itself in the test, but can not see any reason why you would want to
  const statesReducer: T = [{}, () => {}] as any;
  const TransitionsReducerComponent = () => {
    const updatedTransitionsReducer = reducerHookCallback();
    // We clean up the testing object
    Object.keys(statesReducer[0]).forEach(key => {
      delete statesReducer[0][key];
    });
    // We update from the updated statesReducer
    Object.keys(updatedTransitionsReducer[0]).forEach(key => {
      statesReducer[0][key] = updatedTransitionsReducer[0][key];
    });
    // We update the dispatcher as well, though really
    // only needed the first time
    statesReducer[1] = updatedTransitionsReducer[1];
    return null;
  };
  render(renderCallback(TransitionsReducerComponent));
  return statesReducer;
}
//# sourceMappingURL=index.js.map
