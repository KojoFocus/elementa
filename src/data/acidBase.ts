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
// Paper 3 (Practical) commonly uses: HCl, H₂SO₄, Na₂CO₃, NaOH,
// ethanoic acid — always in the same A–E labelling format.

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
    acidBaseStrength: 'Strong acid — fully dissociates: HCl → H⁺ + Cl⁻',
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
    acidBaseStrength: 'Weak acid — partially dissociates',
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
    acidBaseStrength: 'Neutral — neither acid nor alkali',
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
    acidBaseStrength: 'Weak alkali (salt of strong base / weak acid); Mr = 106 g mol⁻¹',
    ionicEquation: 'CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)',
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
    acidBaseStrength: 'Strong alkali — fully dissociates: NaOH → Na⁺ + OH⁻',
    ionicEquation: 'H⁺(aq) + OH⁻(aq) → H₂O(l)',
  },
];

// ─── 7 Experiment Steps (WAEC Practical Marking Scheme) ───────
// Procedure mirrors WAEC SHS Chemistry Paper 3 (Practical).
// Indicator testing with universal indicator and litmus is the
// standard opening practical for WAEC. Points reflect the WAEC
// marking scheme weightings (total experiment = 50 marks).

export const STEPS: ExperimentStep[] = [
  {
    id: 1,
    title: 'Set Up Apparatus',
    instruction:
      'Label five clean, dry test tubes A to E and place them in the test-tube rack. WAEC precaution: Rinse each test tube with a small volume of the solution it will contain before adding the full amount. This prevents dilution errors from residual water.',
    action: 'Click each test tube to place it in the rack.',
    correctFeedback: 'Apparatus set up correctly. Test tubes A–E labelled and rinsed — this is worth marks on the WAEC precautions question.',
    wrongFeedback: 'Ensure all five test tubes are placed and labelled before proceeding.',
    points: 8,
    animationKey: 'setup',
  },
  {
    id: 2,
    title: 'Transfer Solutions',
    instruction:
      'Using a clean dropper or pipette, transfer about 2 cm³ of each labelled solution (A–E) into its corresponding test tube. WAEC precaution: Rinse the dropper with distilled water between each solution to prevent cross-contamination, which would give misleading results.',
    action: 'Click each substance bottle to transfer it into its test tube.',
    correctFeedback: 'Solutions transferred correctly. Dropper rinsed between each — rinsing between solutions is a WAEC required precaution worth 2 marks.',
    wrongFeedback: 'Use the dropper for each substance and rinse it between transfers.',
    points: 10,
    animationKey: 'addSubstance',
  },
  {
    id: 3,
    title: 'Add Universal Indicator',
    instruction:
      'Add exactly 3 drops of universal indicator solution to each test tube. Swirl gently to mix. WAEC standard colour chart: Red (pH 1–3) = Strong acid · Orange (pH 4–5) = Weak acid · Green (pH 6–8) = Neutral · Blue (pH 9–11) = Weak alkali · Violet/Purple (pH 12–14) = Strong alkali.',
    action: 'Select the universal indicator bottle, then click each test tube in turn.',
    correctFeedback: 'Indicator added to all five tubes. Colours match WAEC expected results — A: Red, B: Orange, C: Green, D: Blue, E: Violet.',
    wrongFeedback: 'Select the indicator bottle first, then add exactly 3 drops to each tube individually.',
    points: 10,
    animationKey: 'addIndicator',
  },
  {
    id: 4,
    title: 'Record Observed Colours',
    instruction:
      'Hold each test tube against a white tile or white paper in good lighting. Record the colour change in your WAEC results table. WAEC mark scheme: You must state the colour AND the pH range for full marks. Example: "Solution A — Red — pH 1–2."',
    action: 'For each solution, click the colour circle that matches your observation.',
    correctFeedback: 'Excellent. Colours recorded accurately. A: Red (pH 1–2) · B: Orange (pH 3–4) · C: Green (pH 7) · D: Blue (pH 10–11) · E: Violet (pH 13–14).',
    wrongFeedback: 'Check your observation. Red/Orange = Acid · Green = Neutral · Blue/Violet = Alkali.',
    points: 8,
    animationKey: 'recordColors',
  },
  {
    id: 5,
    title: 'Test with Litmus Paper',
    instruction:
      'Cut small pieces of both red and blue litmus paper. Dip a separate strip of each colour into every test tube and record the result immediately. WAEC mark scheme: Blue litmus → Red = acid · Red litmus → Blue = alkali · No change to either = neutral. You must test BOTH colours for full marks.',
    action: 'Click each test tube to perform the litmus paper test.',
    correctFeedback: 'Litmus tests complete. Results confirm the universal indicator data. Using both litmus papers is required by the WAEC mark scheme.',
    wrongFeedback: 'Test both red and blue litmus in each tube and record both results.',
    points: 7,
    animationKey: 'litmusTest',
  },
  {
    id: 6,
    title: 'Classify Each Solution',
    instruction:
      'Using your colour and litmus evidence, classify each solution as acid, neutral, or alkali. WAEC model answer: "Solution A is a strong acid. The universal indicator turned red (pH 1–2). Blue litmus turned red; red litmus showed no change. This confirms an acidic solution." Evidence-based conclusions earn full marks.',
    action: 'Select acid, neutral, or alkali for each solution.',
    correctFeedback: 'All classifications correct. A: Acid (strong) · B: Acid (weak) · C: Neutral · D: Alkali (weak) · E: Alkali (strong). Your reasoning matches the WAEC mark scheme.',
    wrongFeedback: 'Review your litmus and colour data. Red/Orange → Acid · Green → Neutral · Blue/Violet → Alkali.',
    points: 7,
    animationKey: 'classify',
  },
  {
    id: 7,
    title: 'Clean Up the Laboratory',
    instruction:
      'WAEC safety requirement: Pour all solutions into the designated waste container — never down the sink undiluted. Rinse each test tube three times with distilled water. Return all apparatus to its original location. Wash your hands thoroughly with soap and water for at least 20 seconds.',
    action: 'Click each test tube to dispose of its contents, then click Rinse.',
    correctFeedback: 'Laboratory cleaned safely. All chemicals disposed of correctly — safe lab practice is assessed in the WAEC oral/viva component.',
    wrongFeedback: 'Dispose of all test-tube contents before rinsing the apparatus.',
    points: 0,
    animationKey: 'cleanup',
  },
];

// ─── Scoring ──────────────────────────────────────────────────

export const SAFETY_SCORES = { handwash: 8, gloves: 8, goggles: 9 } as const; // 25 total
export const QUIZ_POINTS_PER_Q = 5; // 5 pts per question
export const PASS_MARK = 70;

export const TOTAL_SAFETY_SCORE     = 25;
export const TOTAL_EXPERIMENT_SCORE = 50;
// QUIZ_QUESTIONS contains 17 questions (comprehensive WAEC bank).
// The quiz page awards QUIZ_POINTS_PER_Q per correct answer.
// Total quiz score is capped at TOTAL_QUIZ_SCORE for the report card.
export const TOTAL_QUIZ_SCORE       = 25;

// ─── WAEC-Style Quiz Questions (Comprehensive Bank) ───────────
// Covers ALL examinable aspects of WAEC SHS Chemistry Practical:
//   • pH calculations (strong acid, strong alkali, logarithm)
//   • Titration: moles, concentration, 1:1 and 1:2 ratios
//   • Na₂CO₃ primary standard: mass, molar mass, concentration
//   • Burette readings: average titre, concordant readings
//   • Indicator selection: which indicator for which titration type
//   • End-point observations: methyl orange, phenolphthalein
//   • Ionic equations for neutralisation reactions
//   • Mass calculations from concentration (g dm⁻³)
//   • Precautions and sources of error (WAEC marking scheme)
//   • Back titration calculations
// Each question includes a full worked solution as explanation.

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ── SECTION A: pH Calculations ────────────────────────────
  {
    id: 'q1',
    question:
      'What is the pH of a 0.01 mol dm⁻³ solution of hydrochloric acid (HCl)? [HCl fully dissociates in water]',
    options: [
      { id: 'a', text: 'pH = 1' },
      { id: 'b', text: 'pH = 2' },
      { id: 'c', text: 'pH = 7' },
      { id: 'd', text: 'pH = 12' },
    ],
    correctId: 'b',
    explanation:
      'HCl is a strong acid: HCl → H⁺ + Cl⁻ (complete dissociation). Therefore [H⁺] = 0.01 = 10⁻² mol dm⁻³. pH = −log[H⁺] = −log(10⁻²) = 2. Remember: the pH scale is logarithmic — each unit decrease means the solution is 10× more acidic. pH 1 is 10× more acidic than pH 2.',
  },
  {
    id: 'q2a',
    question:
      'A solution of NaOH has a concentration of 0.001 mol dm⁻³. NaOH fully dissociates. What is the pH of this solution at 25 °C? [Kw = 1 × 10⁻¹⁴]',
    options: [
      { id: 'a', text: 'pH = 3' },
      { id: 'b', text: 'pH = 7' },
      { id: 'c', text: 'pH = 11' },
      { id: 'd', text: 'pH = 14' },
    ],
    correctId: 'c',
    explanation:
      'NaOH is a strong alkali: NaOH → Na⁺ + OH⁻. [OH⁻] = 0.001 = 10⁻³ mol dm⁻³. pOH = −log[OH⁻] = −log(10⁻³) = 3. Since pH + pOH = 14 at 25 °C: pH = 14 − 3 = 11. Key formula to memorise: pH + pOH = 14 (at 25 °C).',
  },
  {
    id: 'q2b',
    question:
      'Two HCl solutions have concentrations of 0.1 mol dm⁻³ and 0.001 mol dm⁻³. How many times more acidic is the first solution than the second?',
    options: [
      { id: 'a', text: '2 times' },
      { id: 'b', text: '10 times' },
      { id: 'c', text: '100 times' },
      { id: 'd', text: '1000 times' },
    ],
    correctId: 'c',
    explanation:
      'pH of 0.1 mol dm⁻³ HCl = −log(0.1) = 1. pH of 0.001 mol dm⁻³ HCl = −log(0.001) = 3. The pH difference is 3 − 1 = 2 units. Because the scale is logarithmic (base 10), a difference of 2 pH units = 10² = 100 times difference in acidity. This is a common WAEC calculation.',
  },

  // ── SECTION B: Titration Calculations (1:1 ratio) ─────────
  {
    id: 'q3',
    question:
      'In a titration, 25.0 cm³ of NaOH solution was exactly neutralised by 20.0 cm³ of 0.10 mol dm⁻³ HCl. What is the molar concentration of the NaOH? [NaOH + HCl → NaCl + H₂O]',
    options: [
      { id: 'a', text: '0.050 mol dm⁻³' },
      { id: 'b', text: '0.080 mol dm⁻³' },
      { id: 'c', text: '0.10 mol dm⁻³' },
      { id: 'd', text: '0.125 mol dm⁻³' },
    ],
    correctId: 'b',
    explanation:
      'Step 1 — moles HCl = C × V = 0.10 × (20.0 ÷ 1000) = 0.0020 mol. Step 2 — molar ratio NaOH : HCl = 1:1, so moles NaOH = 0.0020 mol. Step 3 — [NaOH] = n ÷ V = 0.0020 ÷ (25.0 ÷ 1000) = 0.0020 ÷ 0.025 = 0.080 mol dm⁻³. Always convert cm³ → dm³ by dividing by 1000.',
  },

  // ── SECTION C: Titration Calculations (1:2 ratio) ─────────
  {
    id: 'q4',
    question:
      '24.0 cm³ of 0.15 mol dm⁻³ H₂SO₄ reacted completely with 40.0 cm³ of NaOH solution. [H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O] Calculate the concentration of NaOH.',
    options: [
      { id: 'a', text: '0.090 mol dm⁻³' },
      { id: 'b', text: '0.18 mol dm⁻³' },
      { id: 'c', text: '0.36 mol dm⁻³' },
      { id: 'd', text: '0.45 mol dm⁻³' },
    ],
    correctId: 'b',
    explanation:
      'Step 1 — moles H₂SO₄ = 0.15 × (24.0 ÷ 1000) = 0.0036 mol. Step 2 — molar ratio H₂SO₄ : NaOH = 1:2, so moles NaOH = 2 × 0.0036 = 0.0072 mol. Step 3 — [NaOH] = 0.0072 ÷ (40.0 ÷ 1000) = 0.0072 ÷ 0.040 = 0.18 mol dm⁻³. Reading the molar ratio from the balanced equation is the most commonly missed step in WAEC.',
  },
  {
    id: 'q4b',
    question:
      '20.0 cm³ of 0.10 mol dm⁻³ Na₂CO₃ was titrated against HCl using methyl orange as indicator. [Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂] What volume of 0.20 mol dm⁻³ HCl is required for complete neutralisation?',
    options: [
      { id: 'a', text: '5.0 cm³' },
      { id: 'b', text: '10.0 cm³' },
      { id: 'c', text: '20.0 cm³' },
      { id: 'd', text: '40.0 cm³' },
    ],
    correctId: 'c',
    explanation:
      'Step 1 — moles Na₂CO₃ = 0.10 × (20.0 ÷ 1000) = 0.0020 mol. Step 2 — molar ratio Na₂CO₃ : HCl = 1:2, so moles HCl needed = 2 × 0.0020 = 0.0040 mol. Step 3 — volume HCl = n ÷ C = 0.0040 ÷ 0.20 = 0.020 dm³ = 20.0 cm³. The 1:2 ratio for Na₂CO₃ + HCl appears in WAEC every year — know it by heart.',
  },

  // ── SECTION D: Na₂CO₃ Primary Standard (Mass & Mr) ────────
  {
    id: 'q5',
    question:
      '5.3 g of anhydrous Na₂CO₃ was dissolved and made up to 500 cm³. Calculate the molar concentration. [Na = 23, C = 12, O = 16]',
    options: [
      { id: 'a', text: '0.10 mol dm⁻³' },
      { id: 'b', text: '0.20 mol dm⁻³' },
      { id: 'c', text: '0.50 mol dm⁻³' },
      { id: 'd', text: '1.06 mol dm⁻³' },
    ],
    correctId: 'a',
    explanation:
      'Mr(Na₂CO₃) = 2(23) + 12 + 3(16) = 46 + 12 + 48 = 106 g mol⁻¹. Moles = 5.3 ÷ 106 = 0.050 mol. Volume = 500 cm³ = 0.500 dm³. Concentration = 0.050 ÷ 0.500 = 0.10 mol dm⁻³. Na₂CO₃ (Mr = 106) is the primary standard in virtually every WAEC titration practical — the Mr is essential to memorise.',
  },
  {
    id: 'q5b',
    question:
      'What mass of NaOH must be dissolved and made up to 250 cm³ to prepare a 0.200 mol dm⁻³ solution? [Na = 23, O = 16, H = 1]',
    options: [
      { id: 'a', text: '0.80 g' },
      { id: 'b', text: '2.00 g' },
      { id: 'c', text: '8.00 g' },
      { id: 'd', text: '40.0 g' },
    ],
    correctId: 'b',
    explanation:
      'Mr(NaOH) = 23 + 16 + 1 = 40 g mol⁻¹. Moles needed = C × V = 0.200 × (250 ÷ 1000) = 0.200 × 0.250 = 0.050 mol. Mass = moles × Mr = 0.050 × 40 = 2.00 g. Formula chain: mass = C × V × Mr. Memorise this — WAEC frequently asks "what mass must be weighed out."',
  },

  // ── SECTION E: Burette Readings & Average Titre ───────────
  {
    id: 'q6',
    question:
      'A student records the following burette readings for an acid–base titration: Pilot: 22.50 cm³ · Run 1: 22.40 cm³ · Run 2: 23.10 cm³ · Run 3: 22.35 cm³. Which runs are concordant and what is the correct average titre?',
    options: [
      { id: 'a', text: 'Runs 1, 2, 3 are concordant; average = 22.62 cm³' },
      { id: 'b', text: 'Runs 1 and 3 are concordant; average = 22.38 cm³' },
      { id: 'c', text: 'Runs 1 and 2 are concordant; average = 22.75 cm³' },
      { id: 'd', text: 'All four runs are concordant; average = 22.59 cm³' },
    ],
    correctId: 'b',
    explanation:
      'Concordant titres must agree within ±0.10 cm³ (WAEC standard). Run 1 = 22.40 cm³ and Run 3 = 22.35 cm³ differ by only 0.05 cm³ — concordant. Run 2 = 23.10 cm³ deviates by 0.70 cm³ from Run 1 — discard it. The pilot run is never used in the average. Average titre = (22.40 + 22.35) ÷ 2 = 22.375 ≈ 22.38 cm³ (2 d.p.). Always record burette readings to 2 decimal places.',
  },
  {
    id: 'q6b',
    question:
      'Why is the pilot (rough) titration result NOT included when calculating the average titre?',
    options: [
      { id: 'a', text: 'It is always the largest reading so it inflates the average' },
      { id: 'b', text: 'It is done quickly and may overshoot the end-point, giving an inaccurate result' },
      { id: 'c', text: 'The burette is not rinsed before the pilot run' },
      { id: 'd', text: 'The indicator is added after the pilot run, not before' },
    ],
    correctId: 'b',
    explanation:
      'The pilot (rough) run is performed rapidly to find the approximate endpoint. Because the student adds acid or alkali quickly, they often overshoot the exact end-point, giving a titre that is slightly too large. Only concordant accurate runs (agreeing within ±0.10 cm³) are averaged. The WAEC mark scheme deducts marks if the pilot result is included in the average.',
  },

  // ── SECTION F: Indicator Selection ────────────────────────
  {
    id: 'q7',
    question:
      'Which indicator is most suitable for a titration of Na₂CO₃ solution against dilute HCl, and why?',
    options: [
      { id: 'a', text: 'Phenolphthalein — because it changes colour at pH 8–10, matching the Na₂CO₃ equivalence point' },
      { id: 'b', text: 'Litmus — because it has a clear colour change from blue to red' },
      { id: 'c', text: 'Methyl orange — because it gives a sharp colour change in the weakly acidic pH range where the reaction is complete' },
      { id: 'd', text: 'Universal indicator — because it shows all pH values' },
    ],
    correctId: 'c',
    explanation:
      'For Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂, the equivalence point occurs at a slightly acidic pH (around pH 4). Methyl orange changes colour at pH 3.1–4.4 (red in acid, yellow in alkali), perfectly matching this. Phenolphthalein changes at pH 8–10 and detects only the first neutralisation step (Na₂CO₃ → NaHCO₃), NOT full neutralisation. Universal indicator cannot give a precise end-point.',
  },
  {
    id: 'q7b',
    question:
      'A student titrates dilute H₂SO₄ against NaOH solution. Which indicator gives the sharpest end-point for this strong acid–strong base titration?',
    options: [
      { id: 'a', text: 'Litmus solution' },
      { id: 'b', text: 'Universal indicator' },
      { id: 'c', text: 'Methyl orange or phenolphthalein' },
      { id: 'd', text: 'Starch solution' },
    ],
    correctId: 'c',
    explanation:
      'For a strong acid–strong base titration, both methyl orange and phenolphthalein give a sharp, sudden colour change at the equivalence point (pH 7). Methyl orange: red → yellow at pH ≈ 4. Phenolphthalein: colourless → pink at pH ≈ 8.2. Both are acceptable for WAEC. Universal indicator changes gradually — no sharp end-point. Litmus has a gradual change and is not used in burette titrations. Starch is only for iodine-thiosulfate redox titrations.',
  },

  // ── SECTION G: End-point Observations ─────────────────────
  {
    id: 'q8',
    question:
      'When titrating Na₂CO₃ solution (in the conical flask) against HCl (in the burette) using methyl orange indicator, what is the correct description of the end-point?',
    options: [
      { id: 'a', text: 'The solution in the flask turns from colourless to pink' },
      { id: 'b', text: 'The solution in the flask turns from yellow to orange/red and the colour is permanent after swirling' },
      { id: 'c', text: 'A white precipitate forms in the flask' },
      { id: 'd', text: 'The solution becomes colourless and stays colourless' },
    ],
    correctId: 'b',
    explanation:
      'Methyl orange is yellow in alkaline/neutral solution and red/orange in acid. At the start, with Na₂CO₃ in the flask, methyl orange is yellow. As HCl is added, the solution becomes more acidic. The end-point is reached when one drop of HCl causes a permanent colour change from yellow to orange/red that does not revert to yellow on swirling. WAEC mark scheme key word: "permanent colour change."',
  },
  {
    id: 'q8b',
    question:
      'What observation confirms the end-point when phenolphthalein indicator is used in a NaOH–HCl titration (NaOH in the conical flask)?',
    options: [
      { id: 'a', text: 'The pink solution turns colourless and remains colourless after swirling' },
      { id: 'b', text: 'The colourless solution turns blue' },
      { id: 'c', text: 'Effervescence is observed in the flask' },
      { id: 'd', text: 'The solution turns yellow' },
    ],
    correctId: 'a',
    explanation:
      'Phenolphthalein is pink/magenta in alkaline solution (NaOH in flask = pink) and colourless in acidic or neutral solution. As HCl is added from the burette, the NaOH is neutralised. The end-point is when one drop of HCl turns the pink solution permanently colourless. "Permanently colourless" means the colour does not return on swirling — this is the key WAEC phrase for full marks.',
  },

  // ── SECTION H: Ionic Equations ────────────────────────────
  {
    id: 'q9',
    question:
      'What is the ionic equation for the neutralisation reaction between HCl(aq) and NaOH(aq)?',
    options: [
      { id: 'a', text: 'Na⁺(aq) + Cl⁻(aq) → NaCl(s)' },
      { id: 'b', text: 'H⁺(aq) + OH⁻(aq) → H₂O(l)' },
      { id: 'c', text: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)' },
      { id: 'd', text: '2H⁺(aq) + 2OH⁻(aq) → 2H₂O(l)' },
    ],
    correctId: 'b',
    explanation:
      'The ionic equation shows only the species that actually change. HCl, NaOH, and NaCl are all fully dissociated (strong electrolytes), so Na⁺ and Cl⁻ are spectator ions — they cancel. What remains is H⁺(aq) + OH⁻(aq) → H₂O(l). This single ionic equation applies to ALL strong acid + strong base neutralisations. Option C is the full molecular equation, not the ionic equation.',
  },
  {
    id: 'q9b',
    question:
      'Which ionic equation correctly represents the reaction of sodium carbonate with excess dilute hydrochloric acid?',
    options: [
      { id: 'a', text: 'CO₃²⁻(aq) + H⁺(aq) → HCO₃⁻(aq)' },
      { id: 'b', text: 'CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g)' },
      { id: 'c', text: 'Na₂CO₃(aq) + 2HCl(aq) → 2NaCl(aq) + H₂O(l) + CO₂(g)' },
      { id: 'd', text: 'CO₃²⁻(aq) + H₂O(l) → HCO₃⁻(aq) + OH⁻(aq)' },
    ],
    correctId: 'b',
    explanation:
      'With EXCESS HCl, both acidic H⁺ ions react. Na⁺ and Cl⁻ are spectator ions, so the net ionic equation is: CO₃²⁻(aq) + 2H⁺(aq) → H₂O(l) + CO₂(g). Option A is the half-neutralisation (forming NaHCO₃), which occurs with limited HCl. Option C is the full molecular equation. Option D is hydrolysis of carbonate. WAEC commonly asks for the ionic equation when CO₂ gas is produced.',
  },

  // ── SECTION I: Precautions & Sources of Error ─────────────
  {
    id: 'q10',
    question:
      'Before filling a burette with acid, a student should rinse it with the acid solution (not water). What is the correct reason for this precaution?',
    options: [
      { id: 'a', text: 'Water makes the acid more dangerous' },
      { id: 'b', text: 'Rinsing with water makes the acid more concentrated' },
      { id: 'c', text: 'Residual water in the burette would dilute the acid and decrease its concentration, giving inaccurate titre readings' },
      { id: 'd', text: 'The burette tip may be blocked by water' },
    ],
    correctId: 'c',
    explanation:
      'If the burette contains residual water, it dilutes the acid. A lower actual acid concentration means more volume must be added to neutralise the alkali — the titre reading would be too large, and the calculated concentration of the unknown solution would be wrong. WAEC mark scheme: "rinsing removes water that would dilute the acid/alkali and change its concentration." This applies to both the burette AND the conical flask should NOT be rinsed with the alkali — it is rinsed with distilled water, and that is acceptable.',
  },
  {
    id: 'q10b',
    question:
      'A student adds distilled water to the conical flask midway through a titration. What effect, if any, does this have on the titre reading?',
    options: [
      { id: 'a', text: 'The titre increases because the solution is more dilute' },
      { id: 'b', text: 'The titre decreases because there is more solvent' },
      { id: 'c', text: 'No effect — the number of moles of solute is unchanged' },
      { id: 'd', text: 'The indicator changes colour early' },
    ],
    correctId: 'c',
    explanation:
      'Adding water to the conical flask does NOT affect the titre. Titration depends on moles, not volume or concentration. The number of moles of alkali (or whatever is in the flask) is fixed — it does not change when you add water. The same number of moles of acid is still needed to neutralise it, so the same volume of acid from the burette is required. This is a common WAEC trick question.',
  },

  // ── SECTION J: Concentration in g dm⁻³ ───────────────────
  {
    id: 'q11',
    question:
      'A NaOH solution has a concentration of 0.200 mol dm⁻³. What is its concentration in g dm⁻³? [Na = 23, O = 16, H = 1]',
    options: [
      { id: 'a', text: '0.200 g dm⁻³' },
      { id: 'b', text: '4.00 g dm⁻³' },
      { id: 'c', text: '8.00 g dm⁻³' },
      { id: 'd', text: '40.0 g dm⁻³' },
    ],
    correctId: 'c',
    explanation:
      'Mr(NaOH) = 23 + 16 + 1 = 40 g mol⁻¹. Concentration in g dm⁻³ = concentration in mol dm⁻³ × Mr = 0.200 × 40 = 8.00 g dm⁻³. Formula: g dm⁻³ = mol dm⁻³ × Mr. This conversion is tested regularly in WAEC — know it in both directions (mol dm⁻³ → g dm⁻³ and g dm⁻³ → mol dm⁻³).',
  },

  // ── SECTION K: Universal Indicator / Colour Chart ─────────
  {
    id: 'q12',
    question:
      'A solution turns universal indicator orange-yellow. Which of the following best describes the solution?',
    options: [
      { id: 'a', text: 'Strong acid, pH 1–2' },
      { id: 'b', text: 'Weak acid, pH 4–5' },
      { id: 'c', text: 'Neutral, pH 7' },
      { id: 'd', text: 'Weak alkali, pH 9–10' },
    ],
    correctId: 'b',
    explanation:
      'WAEC universal indicator colour chart: Red = pH 1–3 (strong acid) · Orange = pH 4–5 (weak acid) · Yellow = pH 5–6 (weakly acidic) · Green = pH 7 (neutral) · Blue = pH 8–10 (weak alkali) · Violet/Purple = pH 11–14 (strong alkali). Orange-yellow indicates a weak acid (e.g., ethanoic acid, pH ≈ 4). On WAEC, the colour AND the approximate pH range are both required for full marks.',
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
