/* @flow */

import React from 'react';
import Store from '../../store';

import { Provider } from 'react-redux';

export default function withProvider(Component: *) {
  return (props: *) => (
    <Provider store={Store}>
      <Component {...props} />
    </Provider>
  );
}
