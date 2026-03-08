// WAEC Chemistry Practical — Volumetric Analysis (Titration)
// Scenario: Standardise HCl using primary standard Na2CO3

export interface TitrationRun {
  id: string;
  label: string;
  isPilot: boolean;
  endpoint: number;     // cm3 of HCl added at endpoint
  initialReading: number;
  finalReading: number;
  titre: number;
  valid: boolean;       // used in concordant check
}

export const TITRATION_SCENARIO = {
  title: 'Acid-Base Titration',
  subtitle: 'Standardise HCl against Na\u2082CO\u2083 primary standard',
  givenSubstances: [
    { label: 'Solution A', description: '0.100 mol dm\u207b\u00b3 Na\u2082CO\u2083 (prepared from 5.30 g in 500 cm\u00b3)', inBurette: false },
    { label: 'Solution B', description: 'HCl solution of unknown concentration', inBurette: true },
  ],
  indicator: 'Methyl orange',
  indicatorColors: { alkaline: '#FDE047', transition: '#FB923C', endpoint: '#DC2626' },
  flaskVolume: 25,   // cm3 pipette
  equation: 'Na\u2082CO\u2083 + 2HCl \u2192 2NaCl + H\u2082O + CO\u2082',
  molarRatio: { acid: 2, base: 1 },  // 2 mol HCl : 1 mol Na2CO3
};

export const TITRATION_RUNS: TitrationRun[] = [
  { id: 'pilot', label: 'Pilot', isPilot: true,  endpoint: 23.50, initialReading: 0.00, finalReading: 23.50, titre: 23.50, valid: false },
  { id: 'run1',  label: 'Run 1', isPilot: false, endpoint: 22.40, initialReading: 0.00, finalReading: 22.40, titre: 22.40, valid: true  },
  { id: 'run2',  label: 'Run 2', isPilot: false, endpoint: 22.35, initialReading: 0.00, finalReading: 22.35, titre: 22.35, valid: true  },
  { id: 'run3',  label: 'Run 3', isPilot: false, endpoint: 22.40, initialReading: 0.00, finalReading: 22.40, titre: 22.40, valid: true  },
];

// Concordant = within 0.10 cm3. Runs 1, 2, 3 all qualify.
export const CONCORDANT_RUNS = ['run1', 'run2', 'run3'];
export const AVERAGE_TITRE = 22.38;  // (22.40 + 22.35 + 22.40) / 3

// Calculation steps shown to student
export const CALCULATION_STEPS = [
  {
    step: 1,
    label: 'Find moles of Na\u2082CO\u2083',
    formula: 'n = C \u00d7 V',
    working: 'n(Na\u2082CO\u2083) = 0.100 \u00d7 (25.0 \u00f7 1000)',
    result: '= 0.00250 mol',
  },
  {
    step: 2,
    label: 'Use molar ratio 1 : 2',
    formula: 'Na\u2082CO\u2083 : HCl = 1 : 2',
    working: 'n(HCl) = 2 \u00d7 0.00250',
    result: '= 0.00500 mol',
  },
  {
    step: 3,
    label: 'Calculate concentration of HCl',
    formula: 'C = n \u00f7 V',
    working: 'C(HCl) = 0.00500 \u00f7 (22.38 \u00f7 1000)',
    result: '= 0.223 mol dm\u207b\u00b3',
  },
];

export const WAEC_PRECAUTIONS = [
  'Rinse the burette with HCl before filling to avoid dilution',
  'Rinse the pipette with Na\u2082CO\u2083 before measuring to avoid contamination',
  'Add indicator AFTER transferring alkali to the flask',
  'The pilot run is rough \u2014 done quickly to find approximate endpoint',
  'Accurate runs must be concordant (within \u00b10.10 cm\u00b3)',
  'Read burette at the bottom of the meniscus at eye level',
  'Do NOT include the pilot run in the average titre',
  'Swirl the flask continuously as you add acid near the endpoint',
];
