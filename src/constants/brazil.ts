/** The 26 states and the Federal District. Same codes the API accepts. */
export const BRAZIL_STATES = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
} as const;
export type BrazilState = keyof typeof BRAZIL_STATES;
export const STATE_CODES = Object.keys(BRAZIL_STATES) as [BrazilState, ...BrazilState[]];
export const STATE_OPTIONS = STATE_CODES.map((value) => ({ value, label: `${value} – ${BRAZIL_STATES[value]}` }));

/** Government level of a public agency customer. */
export const PUBLIC_SPHERE_LABEL = {
  federal: 'Federal',
  state: 'Estadual',
  municipal: 'Municipal',
  union: 'União',
} as const;
export type PublicSphere = keyof typeof PUBLIC_SPHERE_LABEL;
export const PUBLIC_SPHERES = Object.keys(PUBLIC_SPHERE_LABEL) as [PublicSphere, ...PublicSphere[]];

/** Purchase terms the customer accepts at sign-up. */
export const TERMS_URL = 'https://www.bsb.aero/arquivo/e-commerce/TERMO_E-COMMERCE_SALA_VIP_BSB.pdf';
