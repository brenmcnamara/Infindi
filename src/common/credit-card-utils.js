/* @flow */

import Icons from '../design/icons';

import invariant from 'invariant';

import type Account from 'common/lib/models/Account';

export type CreditCardType =
  | 'AMEX'
  | 'DISCOVER'
  | 'MASTERCARD'
  | 'OTHER'
  | 'VISA';

const REGEXP_AMEX = /^3[47][0-9]{0,}$/;
// eslint-disable-next-line max-len
const REGEXP_DISCOVER = /^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$/;
// eslint-disable-next-line max-len
const REGEXP_MASTERCARD = /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/;
const REGEXP_VISA = /^4[0-9]{0,}$/;

export function isCreditCardAccount(account: Account): boolean {
  return (
    account.sourceOfTruth.type === 'YODLEE' &&
    account.sourceOfTruth.value.CONTAINER === 'creditCard'
  );
}

export function getCreditCardNumber(account: Account): string {
  invariant(
    isCreditCardAccount(account),
    'Expecting account %s to be valid credit card account',
  );
  invariant(
    account.sourceOfTruth.type === 'YODLEE',
    'Expecting account to come from YODLEE',
  );
  const { accountNumber } = account.sourceOfTruth.value;
  return accountNumber || '(No Card Number Found)';
}

export function getCreditCardType(account: Account): CreditCardType {
  const creditCardNumber = getCreditCardNumber(account);

  if (REGEXP_AMEX.test(creditCardNumber)) {
    return 'AMEX';
  } else if (REGEXP_DISCOVER.test(creditCardNumber)) {
    return 'DISCOVER';
  } else if (REGEXP_MASTERCARD.test(creditCardNumber)) {
    return 'MASTERCARD';
  } else if (REGEXP_VISA.test(creditCardNumber)) {
    return 'VISA';
  }
  return 'OTHER';
}

export function getIconForCreditCardType(creditCardType: CreditCardType) {
  return Icons.CreditCard[creditCardType];
}
