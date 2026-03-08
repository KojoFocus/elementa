// WAEC Chemistry Practical — Qualitative Analysis (Salt Analysis)
// Students identify unknown salts by systematic testing

export interface TestResult {
  reagent: string;
  observation: string;
  inference: string;
  color?: string;        // color of precipitate / solution
  hasPrecipitate?: boolean;
  hasGas?: boolean;
  gasTest?: string;      // how to confirm the gas
  precipitateSoluble?: boolean;  // dissolves in excess reagent?
}

export interface UnknownSalt {
  id: string;
  label: string;        // e.g. "Salt Q"
  formula: string;
  name: string;
  appearance: { color: string; hex: string; description: string };
  waterTest: TestResult;
  naohTest: TestResult;
  excessNaohTest: TestResult;
  heatNaohTest?: TestResult;
  agno3Test?: TestResult;
  bacl2Test?: TestResult;
  conclusion: string;
  cation: string;
  anion: string;
}

export const UNKNOWN_SALTS: UnknownSalt[] = [
  {
    id: 'cuso4',
    label: 'Salt P',
    formula: 'CuSO\u2084',
    name: 'Copper(II) sulfate',
    appearance: { color: 'Blue', hex: '#3B82F6', description: 'Blue crystalline powder' },
    waterTest: {
      reagent: 'Distilled water',
      observation: 'Salt dissolves readily to form a blue solution',
      inference: 'Salt is soluble in water; Cu\u00b2\u207a ions give blue colour',
      color: '#3B82F6',
    },
    naohTest: {
      reagent: 'Dilute NaOH (few drops)',
      observation: 'Blue gelatinous precipitate forms',
      inference: 'Cu\u00b2\u207a(aq) + 2OH\u207b(aq) \u2192 Cu(OH)\u2082(s)',
      color: '#1D4ED8',
      hasPrecipitate: true,
    },
    excessNaohTest: {
      reagent: 'Excess NaOH',
      observation: 'Blue precipitate remains \u2014 does NOT dissolve in excess',
      inference: 'Confirms Cu\u00b2\u207a; Cu(OH)\u2082 is not amphoteric',
      color: '#1D4ED8',
      hasPrecipitate: true,
      precipitateSoluble: false,
    },
    bacl2Test: {
      reagent: 'Dilute HCl then BaCl\u2082 solution',
      observation: 'White precipitate insoluble in dilute HCl',
      inference: 'SO\u2084\u00b2\u207b(aq) + Ba\u00b2\u207a(aq) \u2192 BaSO\u2084(s) [white ppt]',
      color: '#FFFFFF',
      hasPrecipitate: true,
    },
    conclusion: 'The salt is Copper(II) sulfate, CuSO\u2084. Cu\u00b2\u207a confirmed by blue gelatinous precipitate with NaOH (insoluble in excess). SO\u2084\u00b2\u207b confirmed by white precipitate with acidified BaCl\u2082.',
    cation: 'Cu\u00b2\u207a',
    anion: 'SO\u2084\u00b2\u207b',
  },
  {
    id: 'fecl3',
    label: 'Salt Q',
    formula: 'FeCl\u2083',
    name: 'Iron(III) chloride',
    appearance: { color: 'Brown', hex: '#92400E', description: 'Yellow-brown crystalline solid' },
    waterTest: {
      reagent: 'Distilled water',
      observation: 'Dissolves to give a yellow-brown solution',
      inference: 'Fe\u00b3\u207a ions give characteristic yellow-brown colour',
      color: '#B45309',
    },
    naohTest: {
      reagent: 'Dilute NaOH (few drops)',
      observation: 'Reddish-brown gelatinous precipitate forms',
      inference: 'Fe\u00b3\u207a(aq) + 3OH\u207b(aq) \u2192 Fe(OH)\u2083(s)',
      color: '#92400E',
      hasPrecipitate: true,
    },
    excessNaohTest: {
      reagent: 'Excess NaOH',
      observation: 'Brown precipitate remains \u2014 does NOT dissolve',
      inference: 'Confirms Fe\u00b3\u207a; Fe(OH)\u2083 is not soluble in excess NaOH',
      color: '#92400E',
      hasPrecipitate: true,
      precipitateSoluble: false,
    },
    agno3Test: {
      reagent: 'Dilute HNO\u2083 then AgNO\u2083 solution',
      observation: 'White precipitate soluble in dilute ammonia solution',
      inference: 'Cl\u207b(aq) + Ag\u207a(aq) \u2192 AgCl(s) [white ppt, soluble in NH\u2083(aq)]',
      color: '#FFFFFF',
      hasPrecipitate: true,
    },
    conclusion: 'The salt is Iron(III) chloride, FeCl\u2083. Fe\u00b3\u207a confirmed by reddish-brown precipitate with NaOH insoluble in excess. Cl\u207b confirmed by white precipitate with acidified AgNO\u2083 (soluble in NH\u2083).',
    cation: 'Fe\u00b3\u207a',
    anion: 'Cl\u207b',
  },
  {
    id: 'znso4',
    label: 'Salt R',
    formula: 'ZnSO\u2084',
    name: 'Zinc sulfate',
    appearance: { color: 'White', hex: '#F1F5F9', description: 'White crystalline solid' },
    waterTest: {
      reagent: 'Distilled water',
      observation: 'Dissolves to give a colourless solution',
      inference: 'Zn\u00b2\u207a and SO\u2084\u00b2\u207b are colourless in aqueous solution',
      color: '#E0F2FE',
    },
    naohTest: {
      reagent: 'Dilute NaOH (few drops)',
      observation: 'White gelatinous precipitate forms',
      inference: 'Zn\u00b2\u207a(aq) + 2OH\u207b(aq) \u2192 Zn(OH)\u2082(s)',
      color: '#F1F5F9',
      hasPrecipitate: true,
    },
    excessNaohTest: {
      reagent: 'Excess NaOH',
      observation: 'White precipitate DISSOLVES to form colourless solution',
      inference: 'Zn(OH)\u2082 + 2OH\u207b \u2192 [Zn(OH)\u2084]\u00b2\u207b — amphoteric; confirms Zn\u00b2\u207a',
      color: '#E0F2FE',
      hasPrecipitate: false,
      precipitateSoluble: true,
    },
    bacl2Test: {
      reagent: 'Dilute HCl then BaCl\u2082 solution',
      observation: 'White precipitate insoluble in dilute HCl',
      inference: 'SO\u2084\u00b2\u207b(aq) + Ba\u00b2\u207a(aq) \u2192 BaSO\u2084(s)',
      color: '#FFFFFF',
      hasPrecipitate: true,
    },
    conclusion: 'The salt is Zinc sulfate, ZnSO\u2084. Zn\u00b2\u207a confirmed by white precipitate with NaOH that DISSOLVES in excess (amphoteric). SO\u2084\u00b2\u207b confirmed by white precipitate with acidified BaCl\u2082.',
    cation: 'Zn\u00b2\u207a',
    anion: 'SO\u2084\u00b2\u207b',
  },
  {
    id: 'nh4cl',
    label: 'Salt S',
    formula: 'NH\u2084Cl',
    name: 'Ammonium chloride',
    appearance: { color: 'White', hex: '#F1F5F9', description: 'White crystalline solid' },
    waterTest: {
      reagent: 'Distilled water',
      observation: 'Dissolves readily to give a colourless solution',
      inference: 'NH\u2084Cl is highly soluble; colourless ions',
      color: '#E0F2FE',
    },
    naohTest: {
      reagent: 'Dilute NaOH (few drops)',
      observation: 'No precipitate at room temperature; slight ammonia smell',
      inference: 'NH\u2084\u207a does not precipitate at room temperature with NaOH',
      color: '#E0F2FE',
      hasPrecipitate: false,
    },
    heatNaohTest: {
      reagent: 'Heat with NaOH solution',
      observation: 'Pungent-smelling gas given off; turns moist red litmus paper blue',
      inference: 'NH\u2084\u207a(aq) + OH\u207b(aq) \u2192 NH\u2083(g) + H\u2082O(l); confirms NH\u2084\u207a',
      hasGas: true,
      gasTest: 'Moist red litmus paper turns blue',
    },
    excessNaohTest: {
      reagent: 'Excess NaOH',
      observation: 'No precipitate; ammonia gas becomes more pronounced on heating',
      inference: 'Confirms ammonium ion \u2014 no precipitate distinguishes from metal cations',
      color: '#E0F2FE',
    },
    agno3Test: {
      reagent: 'Dilute HNO\u2083 then AgNO\u2083 solution',
      observation: 'White precipitate, soluble in dilute NH\u2083 solution',
      inference: 'Cl\u207b(aq) + Ag\u207a(aq) \u2192 AgCl(s)',
      color: '#FFFFFF',
      hasPrecipitate: true,
    },
    conclusion: 'The salt is Ammonium chloride, NH\u2084Cl. NH\u2084\u207a confirmed by pungent gas (NH\u2083) turning red litmus blue when heated with NaOH. Cl\u207b confirmed by white precipitate with acidified AgNO\u2083.',
    cation: 'NH\u2084\u207a',
    anion: 'Cl\u207b',
  },
];

export const CATION_TESTS = [
  { ion: 'Cu\u00b2\u207a', appearance: 'Blue solid/solution', naoh: 'Blue ppt, insoluble in excess', other: '—' },
  { ion: 'Fe\u00b2\u207a', appearance: 'Pale green solution', naoh: 'Green ppt, insoluble in excess', other: '—' },
  { ion: 'Fe\u00b3\u207a', appearance: 'Yellow-brown solution', naoh: 'Brown ppt, insoluble in excess', other: '—' },
  { ion: 'Zn\u00b2\u207a', appearance: 'Colourless solution', naoh: 'White ppt, DISSOLVES in excess', other: 'Amphoteric' },
  { ion: 'Al\u00b3\u207a', appearance: 'Colourless solution', naoh: 'White ppt, DISSOLVES in excess', other: 'Amphoteric' },
  { ion: 'Ca\u00b2\u207a', appearance: 'Colourless solution', naoh: 'White ppt, insoluble in excess', other: 'Slight ppt' },
  { ion: 'NH\u2084\u207a', appearance: 'Colourless solution', naoh: 'No ppt; NH\u2083 gas on heating', other: 'Red litmus \u2192 blue' },
  { ion: 'Pb\u00b2\u207a', appearance: 'Colourless/white', naoh: 'White ppt, DISSOLVES in excess', other: 'Amphoteric' },
];

export const ANION_TESTS = [
  { ion: 'Cl\u207b', reagent: 'Acidified AgNO\u2083', observation: 'White ppt', extra: 'Soluble in dilute NH\u2083' },
  { ion: 'Br\u207b', reagent: 'Acidified AgNO\u2083', observation: 'Pale yellow ppt', extra: 'Sparingly soluble in conc. NH\u2083' },
  { ion: 'I\u207b', reagent: 'Acidified AgNO\u2083', observation: 'Yellow ppt', extra: 'Insoluble in NH\u2083' },
  { ion: 'SO\u2084\u00b2\u207b', reagent: 'Acidified BaCl\u2082', observation: 'White ppt (BaSO\u2084)', extra: 'Insoluble in dilute HCl' },
  { ion: 'CO\u2083\u00b2\u207b', reagent: 'Dilute HCl', observation: 'Effervescence (CO\u2082)', extra: 'CO\u2082 turns limewater milky' },
  { ion: 'NO\u2083\u207b', reagent: 'Brown ring test', observation: 'Brown ring with FeSO\u2084 + conc. H\u2082SO\u2084', extra: '—' },
  { ion: 'SO\u2083\u00b2\u207b', reagent: 'Acidified BaCl\u2082 or dil. HCl', observation: 'White ppt; SO\u2082 gas (pungent)', extra: 'Ppt dissolves in HCl' },
];
