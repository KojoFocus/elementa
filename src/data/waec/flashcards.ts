// WAEC Chemistry Practical — Flashcard Bank
// Organised by topic for self-study and revision

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  topic: FlashcardTopic;
  difficulty: 'easy' | 'medium' | 'hard';
  waecTip?: string;
}

export type FlashcardTopic = 'titration' | 'salt-analysis' | 'gas-tests' | 'indicators' | 'calculations';

export const FLASHCARDS: Flashcard[] = [
  // ── TITRATION ──────────────────────────────────────────────
  {
    id: 'f1',
    topic: 'titration',
    difficulty: 'easy',
    front: 'What indicator is used for a Na\u2082CO\u2083 vs HCl titration?',
    back: 'Methyl orange\n\nColour change: Yellow (alkaline) \u2192 Orange/Red (acidic)\n\nWhy: The equivalence point is at pH \u2248 4, within methyl orange\u2019s range (pH 3.1\u20134.4).',
    waecTip: 'NEVER use phenolphthalein for Na\u2082CO\u2083 + HCl \u2014 it only detects the first neutralisation step.',
  },
  {
    id: 'f2',
    topic: 'titration',
    difficulty: 'easy',
    front: 'What is a "concordant titre"?',
    back: 'Two (or more) titration results that agree within \u00b10.10 cm\u00b3 of each other.\n\nExample: 22.40 and 22.35 differ by 0.05 cm\u00b3 \u2192 concordant \u2713\nExample: 22.40 and 22.60 differ by 0.20 cm\u00b3 \u2192 NOT concordant \u2717',
    waecTip: 'WAEC requires at least 2 concordant results. The pilot is NEVER included in the average.',
  },
  {
    id: 'f3',
    topic: 'titration',
    difficulty: 'medium',
    front: 'How do you calculate the concentration of an acid from a titration?\n\nGiven: Na\u2082CO\u2083 (0.10 mol dm\u207b\u00b3, 25 cm\u00b3) vs HCl (average titre = 22.38 cm\u00b3)',
    back: 'Step 1: n(Na\u2082CO\u2083) = 0.10 \u00d7 (25.0 \u00f7 1000) = 0.0025 mol\n\nStep 2: Ratio Na\u2082CO\u2083 : HCl = 1 : 2\n\u2234 n(HCl) = 2 \u00d7 0.0025 = 0.0050 mol\n\nStep 3: C(HCl) = 0.0050 \u00f7 (22.38 \u00f7 1000)\n= 0.223 mol dm\u207b\u00b3',
    waecTip: 'Always check the molar ratio from the balanced equation FIRST \u2014 this is the most common error.',
  },
  {
    id: 'f4',
    topic: 'titration',
    difficulty: 'easy',
    front: 'Why is the burette rinsed with acid (not water) before filling?',
    back: 'Residual water in the burette would DILUTE the acid, reducing its concentration.\n\nThis causes the titre reading to be too HIGH \u2014 more acid appears needed because it\u2019s weaker than it should be.\n\nResult: calculated concentration of unknown would be wrong.',
    waecTip: 'The conical flask is rinsed with distilled water (not the alkali) \u2014 this does NOT affect results because titration depends on moles, not concentration.',
  },
  {
    id: 'f5',
    topic: 'titration',
    difficulty: 'easy',
    front: 'What is the Molar Mass of Na\u2082CO\u2083? Why is this important?',
    back: 'M(Na\u2082CO\u2083) = 2(23) + 12 + 3(16)\n= 46 + 12 + 48 = 106 g mol\u207b\u00b9\n\nImportance: Na\u2082CO\u2083 is the PRIMARY STANDARD in WAEC titrations. It is weighed accurately and used to standardise the acid.',
    waecTip: 'Memorise Mr(Na\u2082CO\u2083) = 106. WAEC asks this almost every year.',
  },
  {
    id: 'f6',
    topic: 'titration',
    difficulty: 'hard',
    front: 'WAEC Question: 5.3 g of Na\u2082CO\u2083 was dissolved in water and made to 500 cm\u00b3. What is its concentration in mol dm\u207b\u00b3?',
    back: 'Mr(Na\u2082CO\u2083) = 106 g mol\u207b\u00b9\n\nmoles = mass \u00f7 Mr = 5.3 \u00f7 106 = 0.050 mol\n\nConcentration = n \u00f7 V = 0.050 \u00f7 (500 \u00f7 1000)\n= 0.050 \u00f7 0.500 = 0.10 mol dm\u207b\u00b3',
    waecTip: 'Mass \u00f7 Mr \u00f7 Volume(dm\u00b3). Remember to convert cm\u00b3 to dm\u00b3 by dividing by 1000.',
  },
  {
    id: 'f7',
    topic: 'titration',
    difficulty: 'easy',
    front: 'Why is the pilot titration result discarded?',
    back: 'The pilot run is done QUICKLY to find the approximate endpoint. Because acid is added rapidly, the student often OVERSHOOTS the endpoint.\n\nThe result is therefore slightly too large and would inflate the average titre.',
    waecTip: 'WAEC mark scheme: "The pilot run may be inaccurate due to overshooting the endpoint."',
  },
  {
    id: 'f8',
    topic: 'titration',
    difficulty: 'medium',
    front: 'Describe the endpoint of a Na\u2082CO\u2083 + HCl titration using methyl orange.',
    back: 'The solution in the conical flask changes from YELLOW to a permanent ORANGE/RED colour on swirling.\n\nAt the start: Na\u2082CO\u2083 is alkaline, methyl orange = yellow\nAt the endpoint: one drop of HCl causes a permanent colour change to orange/red',
    waecTip: 'Key WAEC phrase: "permanent colour change". The colour must NOT return to yellow on swirling.',
  },
  {
    id: 'f9',
    topic: 'titration',
    difficulty: 'medium',
    front: 'What does it mean to read a burette at the bottom of the meniscus?',
    back: 'Liquids in glass form a curved surface called the MENISCUS.\n\n- Water and most solutions: meniscus curves DOWN (concave)\n- Read at the LOWEST point of the curve\n\nReading at the top of the meniscus gives a reading that is too HIGH \u2014 sources of systematic error.\n\nAlways read at EYE LEVEL to avoid parallax error.',
    waecTip: 'Burette readings are always given to 2 decimal places (e.g., 22.40 not 22.4).',
  },
  {
    id: 'f10',
    topic: 'titration',
    difficulty: 'hard',
    front: 'Adding water to the conical flask during titration \u2014 does it affect the result?',
    back: 'NO. Adding water to the flask does NOT affect the titre.\n\nWhy: Titration depends on MOLES, not concentration.\nThe number of moles of alkali in the flask stays the same.\nThe same number of moles of acid is still needed to neutralise it.\n\u2234 The same volume of acid is required.',
    waecTip: 'This is a classic WAEC "trick question". The answer is always NO effect on the titre.',
  },

  // ── SALT ANALYSIS ─────────────────────────────────────────
  {
    id: 'f11',
    topic: 'salt-analysis',
    difficulty: 'easy',
    front: 'What precipitate does Cu\u00b2\u207a form with NaOH? Is it soluble in excess NaOH?',
    back: 'Cu\u00b2\u207a + 2OH\u207b \u2192 Cu(OH)\u2082(s)\n\nPrecipitate: BLUE gelatinous precipitate\n\nIn excess NaOH: precipitate does NOT dissolve\n(Cu(OH)\u2082 is not amphoteric)',
    waecTip: 'Blue precipitate with NaOH = Cu\u00b2\u207a. Always test with excess NaOH to check if amphoteric.',
  },
  {
    id: 'f12',
    topic: 'salt-analysis',
    difficulty: 'easy',
    front: 'Which cations give a WHITE precipitate with NaOH that DISSOLVES in excess?',
    back: 'Zn\u00b2\u207a and Al\u00b3\u207a (and Pb\u00b2\u207a)\n\nThese are AMPHOTERIC hydroxides:\nZn(OH)\u2082 + 2OH\u207b \u2192 [Zn(OH)\u2084]\u00b2\u207b (colourless)\nAl(OH)\u2083 + OH\u207b \u2192 [Al(OH)\u2084]\u207b (colourless)\n\nDistinguish Zn\u00b2\u207a from Al\u00b3\u207a using NH\u2083(aq): Al(OH)\u2083 does NOT dissolve in NH\u2083.',
    waecTip: '"Dissolves in excess NaOH" = amphoteric. This is the KEY distinguishing test.',
  },
  {
    id: 'f13',
    topic: 'salt-analysis',
    difficulty: 'easy',
    front: 'How do you confirm the presence of NH\u2084\u207a (ammonium ion)?',
    back: 'Heat the salt with NaOH solution.\n\nObservation: Pungent-smelling gas evolved\n\nTest the gas: Hold MOIST RED LITMUS paper in the gas\n\nResult: Moist red litmus turns BLUE (only NH\u2083 does this)\n\nEquation: NH\u2084\u207a + OH\u207b \u2192 NH\u2083(g) + H\u2082O',
    waecTip: 'NH\u2084\u207a is the ONLY cation that gives ammonia gas. No precipitate forms at room temperature.',
  },
  {
    id: 'f14',
    topic: 'salt-analysis',
    difficulty: 'medium',
    front: 'How do you test for SO\u2084\u00b2\u207b (sulfate ion)?',
    back: 'Step 1: Add dilute HCl to the solution (to remove interfering ions like SO\u2083\u00b2\u207b and CO\u2083\u00b2\u207b)\n\nStep 2: Add BaCl\u2082 solution\n\nObservation: WHITE precipitate forms, insoluble in dilute HCl\n\nEquation: Ba\u00b2\u207a(aq) + SO\u2084\u00b2\u207b(aq) \u2192 BaSO\u2084(s)\n\nThe insolubility in HCl confirms SO\u2084\u00b2\u207b (not SO\u2083\u00b2\u207b).',
    waecTip: 'Always add HCl FIRST before BaCl\u2082. If you add BaCl\u2082 first, CO\u2083\u00b2\u207b also forms a white ppt.',
  },
  {
    id: 'f15',
    topic: 'salt-analysis',
    difficulty: 'medium',
    front: 'How do you test for Cl\u207b (chloride ion)?',
    back: 'Step 1: Add dilute HNO\u2083 (to acidify and destroy interfering anions)\n\nStep 2: Add AgNO\u2083 solution\n\nObservation: WHITE precipitate forms\n\nConfirmation: Precipitate dissolves in dilute NH\u2083(aq)\n\nEquation: Ag\u207a(aq) + Cl\u207b(aq) \u2192 AgCl(s)',
    waecTip: 'Distinguish halides: Cl\u207b = white ppt (soluble in dil. NH\u2083), Br\u207b = pale yellow (sparingly), I\u207b = yellow (insoluble).',
  },
  {
    id: 'f16',
    topic: 'salt-analysis',
    difficulty: 'easy',
    front: 'What does Fe\u00b3\u207a look like in solution? What precipitate does it form with NaOH?',
    back: 'In solution: Yellow-brown colour\n\nWith NaOH: Reddish-brown gelatinous precipitate\nFe\u00b3\u207a + 3OH\u207b \u2192 Fe(OH)\u2083(s)\n\nIn excess NaOH: precipitate does NOT dissolve\n\nDistinguish from Fe\u00b2\u207a: Fe\u00b2\u207a gives a GREEN precipitate (Fe(OH)\u2082)',
    waecTip: 'Fe\u00b3\u207a = brown precipitate. Fe\u00b2\u207a = green precipitate. Different iron states = different colours.',
  },
  {
    id: 'f17',
    topic: 'salt-analysis',
    difficulty: 'easy',
    front: 'How do you test for CO\u2083\u00b2\u207b (carbonate ion)?',
    back: 'Add dilute HCl (or any dilute acid) to the salt.\n\nObservation: EFFERVESCENCE (bubbling) — colourless odourless gas\n\nTest the gas: Pass into limewater\n\nResult: Limewater turns MILKY\n\nEquation: CO\u2083\u00b2\u207b + 2H\u207a \u2192 H\u2082O + CO\u2082(g)',
    waecTip: 'CO\u2083\u00b2\u207b is incompatible with Cu\u00b2\u207a, Fe\u00b3\u207a, Fe\u00b2\u207a in solution \u2014 they would precipitate the carbonate.',
  },

  // ── GAS TESTS ─────────────────────────────────────────────
  {
    id: 'f18',
    topic: 'gas-tests',
    difficulty: 'easy',
    front: 'What test identifies hydrogen gas? Describe the observation.',
    back: 'Test: Hold a BURNING SPLINT at the mouth of the test tube\n\nObservation: Gas ignites with a SQUEAKY POP sound\n\nExplanation: H\u2082 burns in air with a characteristic squeaky pop.\n\n2H\u2082(g) + O\u2082(g) \u2192 2H\u2082O(g)',
    waecTip: 'Burning splint = test for H\u2082. Glowing splint = test for O\u2082. Do NOT mix these up!',
  },
  {
    id: 'f19',
    topic: 'gas-tests',
    difficulty: 'easy',
    front: 'What is the test for oxygen gas? What is the key word in the observation?',
    back: 'Test: Hold a GLOWING (not burning) splint at mouth of the tube\n\nObservation: Glowing splint REKINDLES (relights)\n\nKey word: "rekindles" or "relights"\n\nExplanation: O\u2082 supports combustion; the enriched oxygen reignites the glowing wood.',
    waecTip: 'The splint must be GLOWING, not burning. A burning splint goes out in air \u2014 it doesn\u2019t test for O\u2082.',
  },
  {
    id: 'f20',
    topic: 'gas-tests',
    difficulty: 'easy',
    front: 'What happens when CO\u2082 gas is passed into limewater?',
    back: 'Limewater [Ca(OH)\u2082(aq)] turns MILKY (cloudy white)\n\nCO\u2082(g) + Ca(OH)\u2082(aq) \u2192 CaCO\u2083(s) + H\u2082O(l)\n\nThe white precipitate is CaCO\u2083 (calcium carbonate).\n\nWith EXCESS CO\u2082: milky solution clears again\nCaCO\u2083(s) + CO\u2082(g) + H\u2082O(l) \u2192 Ca(HCO\u2083)\u2082(aq)',
    waecTip: '"Turns milky" is the correct WAEC phrase. "Turns white" may not score full marks.',
  },
  {
    id: 'f21',
    topic: 'gas-tests',
    difficulty: 'easy',
    front: 'How do you test for ammonia gas?',
    back: 'Hold MOIST RED LITMUS PAPER in the gas.\n\nObservation: Moist red litmus turns BLUE.\n\nWhy: NH\u2083 is the ONLY common gas that is alkaline \u2014 it is the only gas that turns red litmus blue.\n\nAlso: white fumes with glass rod dipped in conc. HCl\nNH\u2083(g) + HCl(g) \u2192 NH\u2084Cl(s)',
    waecTip: 'Must be MOIST litmus. Dry litmus does not work. "Moist red litmus turns blue" = NH\u2083 confirmed.',
  },
  {
    id: 'f22',
    topic: 'gas-tests',
    difficulty: 'medium',
    front: 'What happens to damp blue litmus paper in chlorine gas?',
    back: 'Two-stage reaction:\n\n1. Cl\u2082 dissolves in moisture \u2192 forms acid \u2192 litmus turns RED\n2. Cl\u2082 bleaches the litmus \u2192 litmus becomes COLOURLESS/WHITE\n\nSo: Blue litmus \u2192 Red \u2192 Bleached (colourless)\n\nKey: It\u2019s the BLEACHING that confirms Cl\u2082, not just the colour change to red.',
    waecTip: 'The bleaching action is unique to Cl\u2082. Other acidic gases only turn litmus red \u2014 they don\u2019t bleach it.',
  },
  {
    id: 'f23',
    topic: 'gas-tests',
    difficulty: 'medium',
    front: 'How do you distinguish SO\u2082 from CO\u2082? Both turn limewater milky.',
    back: 'Use ACIDIFIED POTASSIUM DICHROMATE(VI) solution (orange).\n\nSO\u2082 is a reducing agent:\nK\u2082Cr\u2082O\u2087 (orange) \u2192 Cr\u00b3\u207a (GREEN) in the presence of SO\u2082\n\nCO\u2082 does NOT decolourise dichromate.\n\nSO\u2082: orange \u2192 GREEN = positive for SO\u2082\nCO\u2082: no colour change to dichromate',
    waecTip: 'Orange \u2192 Green = SO\u2082ites. This test is unique to SO\u2082.',
  },

  // ── INDICATORS ────────────────────────────────────────────
  {
    id: 'f24',
    topic: 'indicators',
    difficulty: 'easy',
    front: 'Give the colour of universal indicator for each pH range.',
    back: 'Red: pH 1\u20133 (strong acid)\nOrange: pH 4\u20135 (weak acid)\nYellow: pH 5\u20136 (weakly acidic)\nGreen: pH 7 (neutral)\nBlue: pH 8\u201310 (weak alkali)\nViolet/Purple: pH 11\u201314 (strong alkali)',
    waecTip: 'On WAEC, always state BOTH the colour AND the pH range for full marks.',
  },
  {
    id: 'f25',
    topic: 'indicators',
    difficulty: 'easy',
    front: 'What is the pH of 0.01 mol dm\u207b\u00b3 HCl?',
    back: 'HCl is a strong acid \u2014 fully dissociates:\nHCl \u2192 H\u207a + Cl\u207b\n\n[H\u207a] = 0.01 = 10\u207b\u00b2 mol dm\u207b\u00b3\n\npH = \u2212log[H\u207a] = \u2212log(10\u207b\u00b2) = 2\n\nUniversal indicator colour: RED',
    waecTip: 'pH = \u2212log[H\u207a]. For round numbers: [H\u207a] = 10\u207b\u207f \u2192 pH = n.',
  },
  {
    id: 'f26',
    topic: 'indicators',
    difficulty: 'medium',
    front: 'What is the pH of 0.001 mol dm\u207b\u00b3 NaOH?',
    back: 'NaOH fully dissociates: [OH\u207b] = 0.001 = 10\u207b\u00b3\n\npOH = \u2212log[OH\u207b] = 3\n\npH + pOH = 14\npH = 14 \u2212 3 = 11\n\nUniversal indicator colour: BLUE (weak alkali)',
    waecTip: 'Remember: pH + pOH = 14 at 25\u00b0C. This formula is essential for alkali calculations.',
  },
  {
    id: 'f27',
    topic: 'indicators',
    difficulty: 'easy',
    front: 'Blue litmus paper tests. What result indicates an ACID?',
    back: 'ACID: Blue litmus turns RED\nALKALI: Red litmus turns BLUE\nNEUTRAL: No change to either litmus\n\nMemory tip: Acids attack blue litmus.\nAlkalis attack red litmus.',
    waecTip: 'WAEC requires you test BOTH red AND blue litmus. One test alone is not sufficient for full marks.',
  },

  // ── CALCULATIONS ──────────────────────────────────────────
  {
    id: 'f28',
    topic: 'calculations',
    difficulty: 'medium',
    front: 'What mass of NaOH must be dissolved to make 250 cm\u00b3 of 0.200 mol dm\u207b\u00b3 solution?\n[Mr NaOH = 40]',
    back: 'Step 1: moles needed = C \u00d7 V\n= 0.200 \u00d7 (250 \u00f7 1000) = 0.0500 mol\n\nStep 2: mass = moles \u00d7 Mr\n= 0.0500 \u00d7 40 = 2.00 g\n\nFormula chain: mass = C \u00d7 V \u00d7 Mr',
    waecTip: 'The chain is: mass \u2192 moles \u2192 concentration. Learn it in both directions.',
  },
  {
    id: 'f29',
    topic: 'calculations',
    difficulty: 'hard',
    front: '25 cm\u00b3 of 0.15 mol dm\u207b\u00b3 H\u2082SO\u2084 is titrated against NaOH.\n[H\u2082SO\u2084 + 2NaOH \u2192 Na\u2082SO\u2084 + 2H\u2082O]\n\nTitle of NaOH = 30.0 cm\u00b3. Find [NaOH].',
    back: 'n(H\u2082SO\u2084) = 0.15 \u00d7 (25 \u00f7 1000) = 0.00375 mol\n\nRatio H\u2082SO\u2084 : NaOH = 1 : 2\nn(NaOH) = 2 \u00d7 0.00375 = 0.00750 mol\n\nC(NaOH) = 0.00750 \u00f7 (30.0 \u00f7 1000)\n= 0.00750 \u00f7 0.0300 = 0.250 mol dm\u207b\u00b3',
    waecTip: '1 mol H\u2082SO\u2084 reacts with 2 mol NaOH. Always identify ratio BEFORE calculating.',
  },
  {
    id: 'f30',
    topic: 'calculations',
    difficulty: 'medium',
    front: 'A NaOH solution has a concentration of 4.00 g dm\u207b\u00b3. What is it in mol dm\u207b\u00b3?\n[Mr NaOH = 40]',
    back: 'Convert g dm\u207b\u00b3 to mol dm\u207b\u00b3:\n\nConcentration = (g dm\u207b\u00b3) \u00f7 Mr\n= 4.00 \u00f7 40 = 0.100 mol dm\u207b\u00b3\n\nForward: mol dm\u207b\u00b3 \u00d7 Mr = g dm\u207b\u00b3\nReverse: g dm\u207b\u00b3 \u00f7 Mr = mol dm\u207b\u00b3',
    waecTip: 'WAEC gives concentrations in BOTH units. Know how to convert between them.',
  },
];

export const TOPIC_LABELS: Record<FlashcardTopic, string> = {
  'titration': 'Titration',
  'salt-analysis': 'Salt Analysis',
  'gas-tests': 'Gas Tests',
  'indicators': 'pH & Indicators',
  'calculations': 'Calculations',
};

export const TOPIC_COLORS: Record<FlashcardTopic, string> = {
  'titration': '#4FD1FF',
  'salt-analysis': '#7AFFB2',
  'gas-tests': '#FB923C',
  'indicators': '#A78BFA',
  'calculations': '#FCD34D',
};
