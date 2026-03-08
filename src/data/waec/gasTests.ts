// WAEC Chemistry Practical — Gas Tests
// Comprehensive reference for identifying gases in the laboratory

export interface GasTest {
  id: string;
  name: string;
  formula: string;
  color: string;           // hex accent color for UI
  smell: string;
  appearance: string;      // visual description
  tests: GasTestMethod[];
  sources: string[];       // how it's produced in the lab
  icon: string;            // emoji
}

export interface GasTestMethod {
  method: string;          // what you do
  observation: string;     // what you see
  result: string;          // what it confirms
  animColor?: string;      // color for animation
}

export const GAS_TESTS: GasTest[] = [
  {
    id: 'hydrogen',
    name: 'Hydrogen',
    formula: 'H\u2082',
    color: '#4FD1FF',
    smell: 'Odourless',
    appearance: 'Colourless gas',
    icon: '\uD83D\uDCA7',
    tests: [
      {
        method: 'Hold a burning splint at the mouth of the test tube',
        observation: 'Gas ignites with a squeaky "pop" sound',
        result: 'Confirms hydrogen gas',
        animColor: '#FDE047',
      },
    ],
    sources: [
      'Zn(s) + H\u2082SO\u2084(aq) \u2192 ZnSO\u2084(aq) + H\u2082(g)',
      'Mg(s) + 2HCl(aq) \u2192 MgCl\u2082(aq) + H\u2082(g)',
      'Reaction of metals with dilute acids',
    ],
  },
  {
    id: 'oxygen',
    name: 'Oxygen',
    formula: 'O\u2082',
    color: '#7AFFB2',
    smell: 'Odourless',
    appearance: 'Colourless gas',
    icon: '\u2B55',
    tests: [
      {
        method: 'Hold a glowing (not burning) splint at the mouth of the test tube',
        observation: 'Glowing splint rekindles / relights',
        result: 'Confirms oxygen gas',
        animColor: '#F97316',
      },
    ],
    sources: [
      '2H\u2082O\u2082(aq) \u2192 2H\u2082O(l) + O\u2082(g)  [MnO\u2082 catalyst]',
      '2KClO\u2083(s) \u2192 2KCl(s) + 3O\u2082(g)  [heat + MnO\u2082]',
      'Decomposition of hydrogen peroxide',
    ],
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO\u2082',
    color: '#A78BFA',
    smell: 'Odourless (slight acidic taste)',
    appearance: 'Colourless gas, denser than air',
    icon: '\uD83C\uDF2B\uFE0F',
    tests: [
      {
        method: 'Pass gas through limewater [Ca(OH)\u2082 solution]',
        observation: 'Limewater turns milky / cloudy white',
        result: 'CO\u2082(g) + Ca(OH)\u2082(aq) \u2192 CaCO\u2083(s) + H\u2082O(l)',
        animColor: '#F1F5F9',
      },
      {
        method: 'Continue passing excess CO\u2082',
        observation: 'Milky precipitate DISSOLVES \u2014 solution becomes clear again',
        result: 'CaCO\u2083(s) + CO\u2082(g) + H\u2082O(l) \u2192 Ca(HCO\u2083)\u2082(aq)',
        animColor: '#E0F2FE',
      },
    ],
    sources: [
      'CaCO\u2083(s) + 2HCl(aq) \u2192 CaCl\u2082(aq) + H\u2082O(l) + CO\u2082(g)',
      'Na\u2082CO\u2083(aq) + 2HCl(aq) \u2192 2NaCl(aq) + H\u2082O(l) + CO\u2082(g)',
      'Combustion of carbon compounds',
    ],
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    formula: 'NH\u2083',
    color: '#FCD34D',
    smell: 'Pungent, choking smell',
    appearance: 'Colourless gas',
    icon: '\uD83D\uDCA8',
    tests: [
      {
        method: 'Hold moist red litmus paper in the gas',
        observation: 'Moist red litmus paper turns BLUE',
        result: 'Confirms ammonia \u2014 only alkaline gas turns red litmus blue',
        animColor: '#3B82F6',
      },
      {
        method: 'Hold a glass rod dipped in conc. HCl near the gas',
        observation: 'Dense white fumes form',
        result: 'NH\u2083(g) + HCl(g) \u2192 NH\u2084Cl(s)  [white smoke]',
        animColor: '#F1F5F9',
      },
    ],
    sources: [
      'NH\u2084Cl(s) + NaOH(aq) \u2192 NaCl(aq) + H\u2082O(l) + NH\u2083(g)  [heat]',
      'Decomposition of ammonium salts with alkalis',
    ],
  },
  {
    id: 'chlorine',
    name: 'Chlorine',
    formula: 'Cl\u2082',
    color: '#84CC16',
    smell: 'Choking, bleach smell',
    appearance: 'Pale yellow-green gas',
    icon: '\uD83C\uDF3F',
    tests: [
      {
        method: 'Hold damp blue litmus paper in the gas',
        observation: 'Litmus turns red first, then is BLEACHED white',
        result: 'Cl\u2082 is acidic (turns red) then bleaching confirms Cl\u2082',
        animColor: '#FEF08A',
      },
      {
        method: 'Observe colour of gas',
        observation: 'Pale yellow-green colour visible',
        result: 'Distinctive colour of chlorine',
        animColor: '#BEF264',
      },
    ],
    sources: [
      'MnO\u2082(s) + 4HCl(aq) \u2192 MnCl\u2082(aq) + 2H\u2082O(l) + Cl\u2082(g)  [heat]',
      'Electrolysis of brine',
    ],
  },
  {
    id: 'so2',
    name: 'Sulfur Dioxide',
    formula: 'SO\u2082',
    color: '#FB923C',
    smell: 'Pungent, chocking smell (like burning matches)',
    appearance: 'Colourless gas',
    icon: '\uD83D\uDCA5',
    tests: [
      {
        method: 'Pass gas through acidified potassium dichromate(VI) solution',
        observation: 'Orange solution turns GREEN',
        result: 'SO\u2082 is a reducing agent; confirms SO\u2082',
        animColor: '#4ADE80',
      },
      {
        method: 'Pass gas through limewater',
        observation: 'Turns milky (like CO\u2082 test)',
        result: 'Not specific \u2014 use dichromate test to distinguish from CO\u2082',
        animColor: '#F1F5F9',
      },
    ],
    sources: [
      'Cu(s) + 2H\u2082SO\u2084(conc) \u2192 CuSO\u2084(aq) + 2H\u2082O(l) + SO\u2082(g)  [heat]',
      'Na\u2082SO\u2083(s) + H\u2082SO\u2084(aq) \u2192 Na\u2082SO\u2084(aq) + H\u2082O(l) + SO\u2082(g)',
    ],
  },
  {
    id: 'hcl_gas',
    name: 'Hydrogen Chloride',
    formula: 'HCl',
    color: '#F472B6',
    smell: 'Sharp, choking smell',
    appearance: 'Colourless gas; fumes in moist air',
    icon: '\uD83D\uDCA6',
    tests: [
      {
        method: 'Hold moist blue litmus paper in the gas',
        observation: 'Moist blue litmus turns RED',
        result: 'HCl dissolves in moisture to form acid; confirms acidic gas',
        animColor: '#EF4444',
      },
      {
        method: 'Hold glass rod dipped in NH\u2083(aq) near gas',
        observation: 'White fumes / dense white smoke',
        result: 'HCl(g) + NH\u2083(g) \u2192 NH\u2084Cl(s)',
        animColor: '#F1F5F9',
      },
    ],
    sources: [
      'NaCl(s) + H\u2082SO\u2084(conc) \u2192 NaHSO\u2084(s) + HCl(g)',
      'Direct combination: H\u2082(g) + Cl\u2082(g) \u2192 2HCl(g)',
    ],
  },
  {
    id: 'no2',
    name: 'Nitrogen Dioxide',
    formula: 'NO\u2082',
    color: '#F97316',
    smell: 'Pungent, acrid smell',
    appearance: 'Brown/reddish-brown gas',
    icon: '\uD83E\uDDA0',
    tests: [
      {
        method: 'Observe colour of gas',
        observation: 'Distinctive brown/reddish-brown colour',
        result: 'NO\u2082 is one of very few brown gases \u2014 distinctive identification',
        animColor: '#92400E',
      },
      {
        method: 'Pass gas into water',
        observation: 'Gas dissolves; solution turns acidic',
        result: '3NO\u2082 + H\u2082O \u2192 2HNO\u2083 + NO',
        animColor: '#EF4444',
      },
    ],
    sources: [
      'Cu(s) + 4HNO\u2083(conc) \u2192 Cu(NO\u2083)\u2082(aq) + 2H\u2082O(l) + 2NO\u2082(g)',
      'Decomposition of metal nitrates on heating',
    ],
  },
];

// Quick reference table for WAEC exam
export const GAS_QUICK_REFERENCE = [
  { gas: 'H\u2082', test: 'Burning splint', result: 'Squeaky pop' },
  { gas: 'O\u2082', test: 'Glowing splint', result: 'Relights/rekindles' },
  { gas: 'CO\u2082', test: 'Limewater', result: 'Turns milky' },
  { gas: 'NH\u2083', test: 'Moist red litmus', result: 'Turns blue' },
  { gas: 'Cl\u2082', test: 'Damp blue litmus', result: 'Turns red, then bleaches' },
  { gas: 'SO\u2082', test: 'Acidified K\u2082Cr\u2082O\u2087', result: 'Orange turns green' },
  { gas: 'HCl', test: 'Moist blue litmus', result: 'Turns red' },
  { gas: 'NO\u2082', test: 'Observation', result: 'Brown gas visible' },
];
