/* @flow */

// -----------------------------------------------------------------------------
//
// AUXILARY TYPES
//
// -----------------------------------------------------------------------------

// Plaid Dates follow the format: YYYY-MM-DD
export type PlaidDate = string;

// TODO: Specify this type here.
export type PlaidProduct = string;

// TODO: Double check format of this.
export type PlaidLocation = {|
  +address?: string,
  +city?: string,
  +state?: string,
  +zip?: string,
  +lat: ?number,
  +lon: ?number,
|};

export type AccountType =
  | 'brokerage'
  | 'credit'
  | 'depository'
  | 'loan'
  | 'mortgage'
  | 'other';

export type AccountSubtype$Brokerage =
  | '401k'
  | 'brokerage'
  | 'ira'
  | 'retirement'
  | 'roth'
  | 'ugma';

export type AccountSubtype$Credit =
  | 'credit card'
  | 'paypal'
  | 'line of credit'
  | 'rewards';

export type AccountSubtype$Depository =
  | 'checking'
  | 'savings'
  | 'money market'
  | 'paypal'
  | 'prepaid';

export type AccountSubtype$Loan =
  | 'auto'
  | 'commercial'
  | 'construction'
  | 'consumer'
  | 'home'
  | 'home equity'
  | 'loan'
  | 'mortgage'
  | 'overdraft'
  | 'line of credit'
  | 'student';

export type AccountSubtype$Mortgage = 'home';

export type AccountSubtype$Other =
  | '403B'
  | 'cash management'
  | 'cd'
  | 'hsa'
  | 'keogh'
  | 'money market'
  | 'mutual fund'
  | 'prepaid'
  | 'recurring'
  | 'rewards'
  | 'safe deposit'
  | 'sarsep'
  | 'other';

// TODO: Make more precise by pairing correct type with subtype.
export type AccountSubtype =
  | AccountSubtype$Brokerage
  | AccountSubtype$Credit
  | AccountSubtype$Depository
  | AccountSubtype$Loan
  | AccountSubtype$Mortgage
  | AccountSubtype$Other;

// TODO: What is "special" and "unresolved".
export type TransactionType = 'place' | 'digital' | 'special';

// -----------------------------------------------------------------------------
//
// CORE TYPES
//
// -----------------------------------------------------------------------------

export type Institution = {|
  +credentials: Array<{ label: string, name: string, type: string }>,
  +has_mfa: bool,
  +institution_id: string,
  +mfa: Array<string>,
  +name: string,
  +products: Array<PlaidProduct>,
|};

export type Category = {|
  +category_id: string,
  +group: string,
  +hierarchy: Array<string>,
|};

export type Item = {|
  +available_products: Array<PlaidProduct>,
  +billed_products: Array<PlaidProduct>,
  +error: ?string,
  +institution_id: string,
  +item_id: string,
  +webhook: string,
|};

export type Account = {|
  +account_id: string,
  +balances: {|
    +available: number,
    +current: number,
    +limit: ?number,
  |},
  +mask: string,
  +name: string,
  +official_name: string,
  +subtype: AccountSubtype,
  +type: AccountType,
|};

export type AccountNumber = {|
  +account: string,
  +account_id: string,
  +routing: string,
  +wire_routing: string,
|};

export type Transaction = {|
  +account_id: string,
  +amount: number,
  +category: Array<string>,
  +category_id: string,
  +date: PlaidDate,
  +location: PlaidLocation,
  +name: string,
  +payment_meta: Object,
  +pending: bool,
  +pending_transaction_id: ?string,
  +account_owner: ?string,
  +transaction_id: string,
  +transaction_type: TransactionType,
|};

// -----------------------------------------------------------------------------
//
// WEBHOOKS
//
// -----------------------------------------------------------------------------

export type WebhookPayload =
  | WebhookPayload$Transactions
  | WebhookPayload$Item
  | WebhookPayload$Income;

// https://plaid.com/docs/api/#transactions-webhooks
export type WebhookPayload$Transactions =
  | {|
      +error: null,
      +item_id: string,
      +new_transactions: number,
      +webhook_code: 'INITIAL_UPDATE' | 'HISTORICAL_UPDATE' | 'DEFAULT_UPDATE',
      +webhook_type: 'TRANSACTIONS',
    |}
  | {|
      +error: null,
      +item_id: string,
      +removed_transactions: Array<string>,
      +webhook_code: 'TRANSACTIONS_REMOVED',
      +webhook_type: 'TRANSACTIONS',
    |};

// https://plaid.com/docs/api/#item-webhooks
export type WebhookPayload$Item =
  | {|
      +error: null,
      +item_id: string,
      +new_webhook: string,
      +webhook_code: 'WEBHOOK_UPDATE_ACKNOWLEDGED',
      +webhook_type: 'ITEM',
    |}
  | {|
      +error: {|
        +error_code: string,
        +error_message: string,
        +display_message: string,
        +status: 400,
      |},
      +item_id: string,
      +webhook_code: 'ERROR',
      +webhook_type: 'ITEM',
    |};

// https://plaid.com/docs/api/#income-webhooks
export type WebhookPayload$Income = {|
  +error: null,
  +item_id: string,
  +webhook_code: 'PRODUCT_READY',
  +webhook_type: 'INCOME',
|};

// -----------------------------------------------------------------------------
//
// POST /auth/get
// https://plaid.com/docs/api/#auth
//
// -----------------------------------------------------------------------------

// https://plaid.com/docs/api/#auth
export type AuthGetRequest = {|
  +access_token: string,
  +client_id: string,
  +options?: {|
    +account_ids?: ?Array<string>,
  |},
  +secret: string,
|};

export type AuthGetResponse = {|
  +accounts: Array<Account>,
  +numbers: Array<AccountNumber>,
  +item: Object,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /transactions/get
// https://plaid.com/docs/api/#transactions
//
// -----------------------------------------------------------------------------

export type TransactionsGetRequest = {|
  +access_token: string,
  +client_id: string,
  +end_date: PlaidDate,
  +options?: {|
    +account_ids?: ?Array<string>,
    +count?: number,
    +offset?: number,
  |},
  +secret: string,
  +start_date: PlaidDate,
|};

export type TransactionsGetResponse = {|
  +accounts: Array<Account>,
  +transactions: Array<Transaction>,
  +item: Object,
  +total_transactions: number,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /income/get
// https://plaid.com/docs/api/#income
//
// -----------------------------------------------------------------------------

export type IncomeGetRequest = {|
  +client_id: string,
  +secret: string,
  +access_token: string,
|};

export type IncomeGetResponse = {|
  +last_year_income: number,
  +last_year_income_before_tax: number,
  +projected_yearly_income: number,
  +projected_yearly_income_before_tax: number,
  +income_streams: Array<{|
    +monthly_income: number,
    +confidence: number,
    +days: number,
    +name: string,
  |}>,
  +max_number_of_overlapping_income_streams: number,
  +number_of_income_streams: number,
|};

// -----------------------------------------------------------------------------
//
// POST /accounts/balance/get
// https://plaid.com/docs/api/#balance
//
// -----------------------------------------------------------------------------

export type AccountsBalanceGetRequest = {|
  +access_token: string,
  +client_id: string,
  +options?: {
    +account_ids?: ?Array<string>,
  },
  +secret: string,
|};

export type AccountsBalanceGetResponse = {|
  +accounts: Array<Account>,
  +item: Object,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /item/get
// https://plaid.com/docs/api/#retrieve-item
//
// -----------------------------------------------------------------------------

export type ItemGetRequest = {|
  +access_token: string,
  +client_id: string,
  +secret: string,
|};

export type ItemGetResponse = {|
  +item: Item,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /item/webhook/update
// https://plaid.com/docs/api/#update-webook
//
// -----------------------------------------------------------------------------

export type ItemWebookUpdateRequest = {|
  +access_token: string,
  +client_id: string,
  +secret: string,
  +webhook: string,
|};

export type ItemWebhookUpdateResponse = {|
  +item: Item,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /item/access_token/invalidate
// https://plaid.com/docs/api/#rotate-access-token
//
// -----------------------------------------------------------------------------

export type ItemAccessTokenInvalidateRequest = {|
  +access_token: string,
  +client_id: string,
  +secret: string,
|};

export type ItemAccessTokenInvalidateResponse = {|
  +new_access_token: string,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /item/delete
// https://plaid.com/docs/api/#delete-an-item
//
// -----------------------------------------------------------------------------

export type ItemDeleteRequest = {|
  +access_token: string,
  +client_id: string,
  +secret: string,
|};

export type ItemDeleteResponse = {|
  deleted: bool,
  request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /institutions/search
// https://plaid.com/docs/api/#institution-search
//
// -----------------------------------------------------------------------------

export type InstitutionsSearchRequest = {|
  +options?: Object,
  +products: Array<string>,
  +public_key: string,
  +query: string,
|};

export type InstitutionsSearchResponse = {|
  +institutions: Array<Institution>,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /institutions/get
// https://plaid.com/docs/api/#all-institutions
//
// -----------------------------------------------------------------------------

export type InstitutionsGetRequest = {|
  +client_id: string,
  +count: number,
  +offset: number,
  +secret: string,
|};

export type InstitutionsGetResponse = {|
  +institutions: Array<Institution>,
  +request_id: string,
  +total: number,
|};

// -----------------------------------------------------------------------------
//
// POST /institutions/get_by_id
// https://plaid.com/docs/api/#all-institutions
//
// -----------------------------------------------------------------------------

export type InstitutionsGetByIDRequest = {|
  +institution_id: string,
  +public_key: string,
|};

export type InstitutionsGetByIDResponse = {|
  +institution: Institution,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// POST /categories/get
// https://plaid.com/docs/api/#category-overview
//
// -----------------------------------------------------------------------------

export type CategoriesGetRequest = {|
  +category: Array<Category>,
  +request_id: string,
|};

// -----------------------------------------------------------------------------
//
// ENDPOINT RESPONSE ERRORS
//
// -----------------------------------------------------------------------------

export type ErrorResponse =
  | ErrorResponse$InvalidRequest
  | ErrorResponse$InvalidInput
  | ErrorResponse$RateLimitExceeded
  | ErrorResponse$APIError
  | ErrorResponse$ItemError
  | ErrorResponse$InstitutionError;

// https://plaid.com/docs/api/#invalid-request-errors
export type ErrorResponse$InvalidRequest = {|
  +error_type: 'INVALID_REQUEST',
  +http_code: 400 | 404,
  +error_code: | 'MISSING_FIELDS'
    | 'UNKNOWN_FIELDS'
    | 'INVALID_FIELDS'
    | 'INVALID_BODY'
    | 'INVALID_HEADERS'
    | 'NOT_FOUND'
    | 'SANDBOX_ONLY',
  +error_message: string,
  +display_message: null,
  +request_id: string,
|};

// https://plaid.com/docs/api/#invalid-input-errors
export type ErrorResponse$InvalidInput = {|
  +error_type: 'INVALID_INPUT',
  +http_code: 400,
  +error_code: | 'INVALID_API_KEYS'
    | 'UNAUTHORIZED_ENVIRONMENT'
    | 'INVALID_ACCESS_TOKEN'
    | 'INVALID_PUBLIC_TOKEN'
    | 'INVALID_PRODUCT`'
    | 'INVALID_ACCOUNT_ID'
    | 'INVALID_INSTITUTION',
  +error_message: string,
  +display_message: null,
  +request_id: string,
|};

// https://plaid.com/docs/api/#rate-limit-exceeded-errors
export type ErrorResponse$RateLimitExceeded = {|
  +error_type: 'RATE_LIMIT_EXCEEDED',
  +http_code: 429,
  +error_code: | 'ADDITION_LIMIT'
    | 'AUTH_LIMIT'
    | 'TRANSACTION_LIMIT'
    | 'IDENTITY_LIMIT'
    | 'INCOME_LIMIT'
    | 'ITEM_GET_LIMIT'
    | 'RATE_LIMIT',
  +error_message: string,
  +display_message: ?string,
  +request_id: string,
|};

// https://plaid.com/docs/api/#api-errors
export type ErrorResponse$APIError = {|
  +error_type: 'API_ERROR',
  +http_code: 500,
  +error_code: 'INTERNAL_SERVER_ERROR' | 'PLANNED_MAINTENANCE',
  +error_message: string,
  +display_message: string,
  +request_id: string,
|};

// https://plaid.com/docs/api/#item-errors
export type ErrorResponse$ItemError = {|
  +error_type: 'ITEM_ERROR',
  +http_code: 400,
  +error_code: | 'INVALID_CREDENTIALS'
    | 'INVALID_MFA'
    | 'ITEM_LOCKED'
    | 'ITEM_LOGIN_REQUIRED'
    | 'ITEM_NO_ERROR'
    | 'ITEM_NOT_SUPPORTED'
    | 'USER_SETUP_REQUIRED'
    | 'MFA_NOT_SUPPORTED'
    | 'NO_ACCOUNTS'
    | 'NO_AUTH_ACCOUNTS'
    | 'PRODUCT_NOT_READY'
    | 'PRODUCT_NOT_SUPPORTED',
  +error_message: string,
  +display_message: ?string,
  _request_id: string,
|};

// https://plaid.com/docs/api/#institution-errors
export type ErrorResponse$InstitutionError = {|
  +error_type: 'INSTITUTION_ERROR',
  +http_code: 400,
  +error_code: | 'INSTITUTION_DOWN'
    | 'INSTITUTION_NOT_RESPONDING'
    | 'INSTITUTION_NOT_AVAILABLE'
    | 'INSTITUTION_NO_LONGER_SUPPORTED',
  +error_message: string,
  +display_message: ?string,
  +request_id: string,
|};
