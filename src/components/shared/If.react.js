/* @flow */

import React from 'react';

export type Props = {
  children?: ?any,
  predicate: mixed,
};

export default function If(props: Props) {
  const component = React.Children.only(props.children);
  return props.predicate ? component : null;
}
