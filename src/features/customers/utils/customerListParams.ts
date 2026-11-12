import { parseAsString, parseAsStringLiteral } from 'nuqs/server';

/** The list's URL state. `q` and `tag` are read by the server to filter on the API; `id` opens a customer. */
export const customerListParams = {
  q: parseAsString.withDefault(''),
  tag: parseAsStringLiteral(['account_holder', 'exempt'] as const),
  id: parseAsString,
};
