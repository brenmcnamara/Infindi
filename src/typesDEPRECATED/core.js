/* @flow */

export type ID = string;

export type YearMonthDay = string; // YYYY/MM/DD

// Seconds as a relative time unit.
export type Seconds = number;

// Seconds as an absolute time unit since epoch.
export type SecondsSinceEpoch = number;

export type Pointer<T: string> = {|
  +refID: string,
  +pointerType: T,
  +type: 'POINTER',
|};

export type ModelStub<T: string> = {
  +createdAt: Date,
  +id: string,
  +modelType: T,
  +type: 'MODEL',
  +updatedAt: Date,
};

export type Fuzzy<T> = {
  confidence: number,
  value: T,
};

export type Dollars = number;

export type Location = {|
  +city: ?string,
  +coordinates: ?{ lon: number, lat: number },
  +country?: string,
  +state: ?string,
  +street: ?string,
  +street2: ?string,
  +zip: ?string,
|};

export type Statistic = {|
  +confidenceDeltaOfMean95: number,
  +mean: number,
  +variance: number,
|};
