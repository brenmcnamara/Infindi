/* @flow */

export type ID = string;

export type YearMonthDay = string; // YYYY/MM/DD

export type SecondsSinceEpoch = number;

export type Pointer<T: string> = {|
  +refID: string,
  +pointerType: T,
  +type: 'POINTER',
|};

export type ModelStub<T: string> = {|
  +createdAtSecs: SecondsSinceEpoch,
  +id: string,
  +modelType: T,
  +type: 'MODEL',
  +updatedAtSecs: SecondsSinceEpoch,
|};

export type Fuzzy<T> = {
  confidence: number,
  value: T,
};

export type CurrencyDollars = number;

export type Location = {|
  +city: ?string,
  +coordinates: ?{ lon: number, lat: number },
  +country?: string,
  +state: ?string,
  +street: ?string,
  +street2: ?string,
  +zip: ?string,
|};
