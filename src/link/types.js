/* @flow */

import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';

export type LoginFormContainer = { [providerID: ID]: YodleeLoginForm };
