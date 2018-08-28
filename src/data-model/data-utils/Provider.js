/* @flow */

/* eslint-disable flowtype/generic-spacing */

import Provider from 'common/lib/models/Provider';

import { generateDataUtils } from './DataUtils';

import type { DataUtils } from './DataUtils';

const ProviderDataUtils: DataUtils<'Provider'> = generateDataUtils(Provider);

export default ProviderDataUtils;
