/* @flow */

export type Route = RootNode;

export type RootType =
  | 'MAIN'
  | 'NO_INTERNET'
  | 'AUTH'
  | 'LOADING'
  | 'RECOMMENDATION';

export type RootNode =
  | {|
      +name: 'MAIN',
      +next: TabNode,
    |}
  | {|
      +name: 'NO_INTERNET' | 'AUTH' | 'LOADING' | 'RECOMMENDATION',
      +next: null,
    |};

export type TabType = 'HOME' | 'ACCOUNTS';

export type TabNode = {
  +name: TabType,
  +next: null,
};

export function getRoot(route: Route): RootType {
  return route.name;
}

export function getTab(route: Route): TabType | null {
  return route.name === 'MAIN' ? route.next.name : null;
}

export function stringify(route: Route): string {
  let node = route;
  let str = '';
  while (node) {
    str += `/${node.name}`;
    node = node.next;
  }
  return str;
}
