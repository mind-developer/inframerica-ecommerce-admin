import { parseAsInteger, parseAsString, parseAsStringLiteral } from 'nuqs/server';

/** The list's URL state: the server reads it to ask the API for the right page. */
export const sectorListParams = {
  q: parseAsString.withDefault(''),
  status: parseAsStringLiteral(['active', 'inactive'] as const),
  page: parseAsInteger.withDefault(1),
};
