// ============================================================
//  Elementa — Acid-Base Indicator Experiment Data
//  Aligned to WAEC SHS Chemistry Practical Syllabus (West Africa)
//  Reagents, procedures, marking-scheme language and questions
//  match the WAEC past-paper format for both school and private
//  candidates.
// ============================================================

export type SubstanceId = 'hcl' | 'ethanoic' | 'water' | 'na2co3' | 'naoh';
export type Classification = 'acid' | 'neutral' | 'alkali';
export type LitmusResult = 'blue-to-red' | 'no-change' | 'red-to-blue';

export interface Substance {
  id: SubstanceId;
  name: string;
  formula: string;
  indicatorColor: string;       // hex — universal indicator result
  indicatorColorName: string;   // must match a COLOR_OPTIONS label exactly
  classification: Classification;
  litmusBlue: LitmusResult;
  litmusRed: LitmusResult;
  pH: string;
  acidBaseStrength: string;
  ionicEquation: string;
}

export interface ExperimentStep {
  id: number;
  title: string;
  instruction: string;
  action: string;
  correctFeedback: string;
  wrongFeedback: string;
  points: number;
  animationKey: string;
}

export interface QuizOption { id: string; text: string; }
export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation: string;
}

// ─── WAEC Standard Reagents ───────────────────────────────────
// These are the exact solutions used in WAEC SHS Chemistry
// Practical papers. Labels A–E match the standard WAEC lettering.

export const SUBSTANCES: Substance[] = [
  {
    id: 'hcl',
    name: 'Dilute HCl (A)',
    formula: 'HCl(aq)',
    indicatorColor: '#ef4444',
    indicatorColorName: 'Red',
    classification: 'acid',
    litmusBlue: 'blue-to-red',
    litmusRed: 'no-change',
    pH: '1–2',
    acidBaseStrength: 'Strong acid',
    ionicEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
  },
  {
    id: 'ethanoic',
    name: 'Ethanoic Acid (B)',
    formula: 'CH₃COOH(aq)',
    indicatorColor: '#f97316',
    indicatorColorName: 'Orange',
    classification: 'acid',
    litmusBlue: 'blue-to-red',
    litmusRed: 'no-change',
    pH: '3–4',
    acidBaseStrength: 'Weak acid',
    ionicEquation: 'CH₃COOH(aq) ⇌ CH₃COO⁻(aq) + H⁺(aq)',
  },
  {
    id: 'water',
    name: 'Distilled Water (C)',
    formula: 'H₂O(l)',
    indicatorColor: '#22c55e',
    indicatorColorName: 'Green',
    classification: 'neutral',
    litmusBlue: 'no-change',
    litmusRed: 'no-change',
    pH: '7',
    acidBaseStrength: 'Neutral',
    ionicEquation: 'H₂O(l) ⇌ H⁺(aq) + OH⁻(aq)  [Kw = 1×10⁻¹⁴]',
  },
  {
    id: 'na2co3',
    name: 'Na₂CO₃ Solution (D)',
    formula: 'Na₂CO₃(aq)',
    indicatorColor: '#3b82f6',
    indicatorColorName: 'Blue',
    classification: 'alkali',
    litmusBlue: 'no-change',
    litmusRed: 'red-to-blue',
    pH: '10–11',
    acidBaseStrength: 'Weak alkali (salt of strong base / weak acid)',
    ionicEquation: 'CO₃²⁻(aq) + H₂O(l) ⇌ HCO₃⁻(aq) + OH⁻(aq)',
  },
  {
    id: 'naoh',
    name: 'NaOH Solution (E)',
    formula: 'NaOH(aq)',
    indicatorColor: '#a855f7',
    indicatorColorName: 'Purple',
    classification: 'alkali',
    litmusBlue: 'no-change',
    litmusRed: 'red-to-blue',
    pH: '13–14',
    acidBaseStrength: 'Strong alkali',
    ionicEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
  },
];

// ─── 7 Experiment Steps (WAEC Practical Marking Scheme) ───────

export const STEPS: ExperimentStep[] = [
  {
    id: 1,
    title: 'Set Up Apparatus',
    instruction:
      'Label five clean, dry test tubes A to E and place them in the test-tube rack. Rinse each test tube with a small volume of the solution it will contain before transferring the full amount.',
    action: 'Click each test tube to place it in the rack.',
    correctFeedback: 'Apparatus set up. Test tubes A–E labelled and placed correctly in the rack.',
    wrongFeedback: 'Ensure all five test tubes are placed and labelled before proceeding.',
    points: 8,
    animationKey: 'setup',
  },
  {
    id: 2,
    title: 'Transfer Solutions',
    instruction:
      'Using a clean dropper, pipette about 2 cm³ of each labelled solution (A–E) into its corresponding test tube. Rinse the dropper with distilled water between each solution to prevent contamination.',
    action: 'Click each substance bottle to transfer it into its test tube.',
    correctFeedback: 'Solutions transferred correctly. Dropper rinsed between each — contamination prevented.',
    wrongFeedback: 'Use the dropper for each substance and rinse it between transfers.',
    points: 10,
    animationKey: 'addSubstance',
  },
  {
    id: 3,
    title: 'Add Universal Indicator',
    instruction:
      'Add exactly 3 drops of universal indicator solution to each test tube. Swirl gently to mix. Compare the resulting colour with the standard WAEC pH colour chart: Red/Orange = Acid · Green = Neutral · Blue/Violet = Alkali.',
    action: 'Select the universal indicator bottle, then click each test tube in turn.',
    correctFeedback: 'Indicator added to all five tubes. Colour changes are visible and ready to record.',
    wrongFeedback: 'Select the indicator bottle first, then add to each tube individually.',
    points: 10,
    animationKey: 'addIndicator',
  },
  {
    id: 4,
    title: 'Record Observed Colours',
    instruction:
      'Hold each test tube against a white tile or sheet of white paper in good light. Record the colour change in your results table. This colour determines the approximate pH of each solution.',
    action: 'For each solution, click the colour circle that matches your observation.',
    correctFeedback: 'Excellent. Colours recorded accurately and match the expected universal indicator results.',
    wrongFeedback: 'Check your observation. Red/Orange = Acid · Green = Neutral · Blue/Violet = Alkali.',
    points: 8,
    animationKey: 'recordColors',
  },
  {
    id: 5,
    title: 'Test with Litmus Paper',
    instruction:
      'Cut small pieces of both red and blue litmus paper. Dip one strip of each into every test tube. Record each result. WAEC Mark Scheme: Blue → Red confirms acid; Red → Blue confirms alkali; No change to either confirms neutral.',
    action: 'Click each test tube to perform the litmus paper test.',
    correctFeedback: 'Litmus tests complete. Results confirm and corroborate your universal indicator observations.',
    wrongFeedback: 'Test both red and blue litmus in each tube and record both results.',
    points: 7,
    animationKey: 'litmusTest',
  },
  {
    id: 6,
    title: 'Classify Each Solution',
    instruction:
      'Based on your colour observations and litmus results, classify each solution. In your WAEC answer booklet you would write: "Solution A is an acid. The universal indicator turned red (pH 1–2) and blue litmus paper turned red, confirming an acid."',
    action: 'Select acid, neutral, or alkali for each solution.',
    correctFeedback: 'All classifications correct. Your reasoning matches the WAEC expected conclusions.',
    wrongFeedback: 'Review your litmus and colour data. Red/Orange → Acid · Green → Neutral · Blue/Violet → Alkali.',
    points: 7,
    animationKey: 'classify',
  },
  {
    id: 7,
    title: 'Clean Up the Laboratory',
    instruction:
      'Pour all solutions into the designated waste container — never down the sink undiluted. Rinse each test tube three times with distilled water. Return all apparatus to its original location. Wash your hands thoroughly with soap and water.',
    action: 'Click each test tube to dispose of its contents, then click Rinse.',
    correctFeedback: 'Laboratory cleaned safely. All chemicals disposed of correctly.',
    wrongFeedback: 'Dispose of all test-tube contents before rinsing the apparatus.',
    points: 0,
    animationKey: 'cleanup',
  },
];

// ─── Scoring ──────────────────────────────────────────────────

export const SAFETY_SCORES = { handwash: 8, gloves: 8, goggles: 9 } as const; // 25 total
export const QUIZ_POINTS_PER_Q = 5; // 5 × 5 = 25 total
export const PASS_MARK = 70;

export const TOTAL_SAFETY_SCORE     = 25;
export const TOTAL_EXPERIMENT_SCORE = 50;
export const TOTAL_QUIZ_SCORE       = 25;

// ─── WAEC-Style Quiz Questions (with Calculations) ────────────
// Mirrors actual WAEC Chemistry Practical objective questions:
// pH calculations, titration molarity, molar mass/concentration,
// indicator selection, and 1:2 stoichiometry problems.

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question:
      'What is the pH of a 0.01 mol dm⁻³ solution of hydrochloric acid (HCl)? [HCl is a strong acid and fully dissociates in water]',
    options: [
      { id: 'a', text: 'pH = 1' },
      { id: 'b', text: 'pH = 2' },
      { id: 'c', text: 'pH = 7' },
      { id: 'd', text: 'pH = 12' },
    ],
    correctId: 'b',
    explanation:
      'HCl is a strong acid: HCl → H⁺ + Cl⁻ (complete dissociation). Therefore [H⁺] = 0.01 mol dm⁻³ = 10⁻² mol dm⁻³. pH = −log[H⁺] = −log(10⁻²) = 2. Note: the pH scale is logarithmic — each unit decrease means the solution is 10× more acidic.',
  },
  {
    id: 'q2',
    question:
      'In a titration, 25.0 cm³ of NaOH solution was exactly neutralised by 20.0 cm³ of 0.10 mol dm⁻³ HCl. What is the molar concentration of the NaOH solution? [NaOH + HCl → NaCl + H₂O]',
    options: [
      { id: 'a', text: '0.050 mol dm⁻³' },
      { id: 'b', text: '0.080 mol dm⁻³' },
      { id: 'c', text: '0.10 mol dm⁻³' },
      { id: 'd', text: '0.125 mol dm⁻³' },
    ],
    correctId: 'b',
    explanation:
      'Step 1 — moles HCl = C × V = 0.10 × (20.0 ÷ 1000) = 0.0020 mol. Step 2 — from the 1:1 equation, moles NaOH = 0.0020 mol. Step 3 — [NaOH] = n ÷ V = 0.0020 ÷ (25.0 ÷ 1000) = 0.0020 ÷ 0.025 = 0.080 mol dm⁻³. Always convert cm³ to dm³ by dividing by 1000.',
  },
  {
    id: 'q3',
    question:
      '5.3 g of anhydrous sodium carbonate (Na₂CO₃) was dissolved in distilled water and made up to exactly 500 cm³. Calculate the molar concentration of the solution. [Na = 23, C = 12, O = 16]',
    options: [
      { id: 'a', text: '0.10 mol dm⁻³' },
      { id: 'b', text: '0.20 mol dm⁻³' },
      { id: 'c', text: '0.50 mol dm⁻³' },
      { id: 'd', text: '1.06 mol dm⁻³' },
    ],
    correctId: 'a',
    explanation:
      'Molar mass of Na₂CO₃ = 2(23) + 12 + 3(16) = 46 + 12 + 48 = 106 g mol⁻¹. Moles = 5.3 ÷ 106 = 0.050 mol. Volume = 500 cm³ = 0.500 dm³. Concentration = 0.050 ÷ 0.500 = 0.10 mol dm⁻³. Na₂CO₃ is the primary standard in most WAEC titration practicals — memorise its molar mass (106 g mol⁻¹).',
  },
  {
    id: 'q4',
    question:
      'A student titrates dilute H₂SO₄ against NaOH solution. Which indicator gives the sharpest, most precise end-point for this strong acid–strong base titration?',
    options: [
      { id: 'a', text: 'Litmus solution' },
      { id: 'b', text: 'Universal indicator' },
      { id: 'c', text: 'Methyl orange' },
      { id: 'd', text: 'Starch solution' },
    ],
    correctId: 'c',
    explanation:
      'Methyl orange (or phenolphthalein) gives a sudden, distinct colour change at the equivalence point. Methyl orange: red in acid → yellow in alkali at pH ≈ 4. Universal indicator changes gradually through many colours, making the precise end-point impossible to identify. Starch is used only in iodine/thiosulfate redox titrations.',
  },
  {
    id: 'q5',
    question:
      '24.0 cm³ of 0.15 mol dm⁻³ H₂SO₄ reacted completely with 40.0 cm³ of NaOH solution. Using the equation H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O, calculate the concentration of the NaOH.',
    options: [
      { id: 'a', text: '0.090 mol dm⁻³' },
      { id: 'b', text: '0.18 mol dm⁻³' },
      { id: 'c', text: '0.36 mol dm⁻³' },
      { id: 'd', text: '0.45 mol dm⁻³' },
    ],
    correctId: 'b',
    explanation:
      'Step 1 — moles H₂SO₄ = 0.15 × (24.0 ÷ 1000) = 0.0036 mol. Step 2 — the equation shows a 1:2 molar ratio (H₂SO₄ : NaOH), so moles NaOH = 2 × 0.0036 = 0.0072 mol. Step 3 — [NaOH] = 0.0072 ÷ (40.0 ÷ 1000) = 0.0072 ÷ 0.040 = 0.18 mol dm⁻³. Always read the molar ratio from the balanced equation — this is the most common WAEC calculation error.',
  },
];

// ─── Colour options for step 4 (universal indicator scale) ────
// Ordered from red (strongly acidic) to violet (strongly alkaline)
// matching the WAEC pH colour chart.

export const COLOR_OPTIONS = [
  { id: 'red',    label: 'Red',    hex: '#ef4444' },
  { id: 'orange', label: 'Orange', hex: '#f97316' },
  { id: 'yellow', label: 'Yellow', hex: '#eab308' },
  { id: 'green',  label: 'Green',  hex: '#22c55e' },
  { id: 'blue',   label: 'Blue',   hex: '#3b82f6' },
  { id: 'purple', label: 'Purple', hex: '#a855f7' },
  { id: 'pink',   label: 'Pink',   hex: '#ec4899' },
];
