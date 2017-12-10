/* @flow */

import type { AccountType } from '../typesDEPRECATED/db';

export type GroupType = 'AVAILABLE_CASH' | 'OTHER';

export function getGroupTypeForAccountType(type: AccountType): GroupType {
  switch (type) {
    case 'CD':
    default:
      return 'OTHER';
  }
}
