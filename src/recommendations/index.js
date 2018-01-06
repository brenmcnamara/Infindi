/* @flow */

import OpenHSAAccountCard from './open-hsa-account/Card.react';
import OpenHSAAccountComponent from './open-hsa-account/Component.react';
import OpenRothAccountCard from './open-roth-account/Card.react';
import OpenRothAccountComponent from './open-roth-account/Component.react';

import { Template as OpenHSAAccountTemplate } from './open-hsa-account/Metadata';
import { Template as OpenRothAccountTemplate } from './open-roth-account/Metadata';

import type { ID } from 'common/src/types/core';

export type RecommendationTemplate = {|
  +id: ID,
  +subTitle: string,
  +title: string,
|};

export const Templates = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountTemplate,
  [OpenRothAccountTemplate.id]: OpenRothAccountTemplate,
};

export type RecommendationCardProps = {
  +enableUserInteraction: bool,
  +isFocused: bool,
  +onNoThanks: () => any,
  +onSeeDetails: () => any,
};

export const Cards = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountCard,
  [OpenRothAccountTemplate.id]: OpenRothAccountCard,
};

export type RecommendationComponentProps = {
  +onNoThanks: () => any,
};

export const Components = {
  [OpenHSAAccountTemplate.id]: OpenHSAAccountComponent,
  [OpenRothAccountTemplate.id]: OpenRothAccountComponent,
};
