/* @flow */

import OpenHSAAccountCard from './open-hsa-account/Card.react';
import OpenHSAAccountComponent from './open-hsa-account/Component.react';
import OpenRothAccountCard from './open-roth-account/Card.react';
import OpenRothAccountComponent from './open-roth-account/Component.react';
import RevertOverdraftFeeCard from './revert-overdraft-fee/Card.react';
import RevertOverdraftFeeComponent from './revert-overdraft-fee/Component.react';

import { Template as OpenHSAAccountTemplate } from './open-hsa-account/Metadata';
import { Template as OpenRothAccountTemplate } from './open-roth-account/Metadata';
import { Template as RevertOverdraftFeeTemplate } from './revert-overdraft-fee/Metadata';

import type { ID } from 'common/src/types/core';

export type ActionItemTemplate = {|
  +id: ID,
  +savingsStatement: string,
  +subTitle: string,
  +title: string,
|};

export const Templates = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountTemplate,
  [OpenRothAccountTemplate.id]: OpenRothAccountTemplate,
  [RevertOverdraftFeeTemplate.id]: RevertOverdraftFeeTemplate,
};

export type ActionItemCardProps = {
  +enableUserInteraction: bool,
  +isFocused: bool,
  +onNoThanks: () => any,
  +onSeeDetails: () => any,
};

export const Cards = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountCard,
  [OpenRothAccountTemplate.id]: OpenRothAccountCard,
  [RevertOverdraftFeeTemplate.id]: RevertOverdraftFeeCard,
};

export type ActionItemComponentProps = {
  +onNoThanks: () => any,
};

export const Components = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountComponent,
  [OpenRothAccountTemplate.id]: OpenRothAccountComponent,
  [RevertOverdraftFeeTemplate.id]: RevertOverdraftFeeComponent,
};