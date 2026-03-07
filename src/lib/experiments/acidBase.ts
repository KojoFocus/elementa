import type { ExperimentData } from '@/types';

export const acidBaseExperiment: ExperimentData = {
  meta: {
    id: 'acid-base-indicator',
    title: 'Acid-Base Indicator Testing',
    subtitle: 'Discover the chemistry of pH using natural indicators',
    subject: 'chemistry',
    difficulty: 'beginner',
    duration: 30,
    description:
      'In this experiment you will test several common solutions using a natural indicator (hibiscus/red cabbage extract) to classify them as acids, bases, or neutral substances. You will observe dramatic colour changes and relate them to the pH scale.',
    objectives: [
      'Understand what an acid-base indicator is and how it works',
      'Observe colour changes when an indicator reacts with acids and bases',
      'Classify unknown solutions using pH colour charts',
      'Record systematic observations and draw evidence-based conclusions',
    ],
  },

  safetyItems: [
    {
      id: 'handwash',
      title: 'Wash Your Hands',
      description: 'Scrub hands with soap and water for at least 20 seconds before handling any lab materials.',
      icon: 'HandMetal',
      animationKey: 'handwash',
    },
    {
      id: 'gloves',
      title: 'Put On Gloves',
      description: 'Wear nitrile or latex gloves to protect your skin from chemical contact.',
      icon: 'Shield',
      animationKey: 'gloves',
    },
    {
      id: 'goggles',
      title: 'Wear Safety Goggles',
      description: 'Always protect your eyes. Goggles must be on before opening any solution.',
      icon: 'Eye',
      animationKey: 'goggles',
    },
  ],

  tools: [
    {
      id: 'beaker',
      name: 'Glass Beaker (250 ml)',
      description: 'Used to hold and mix solutions during the experiment.',
      icon: 'FlaskConical',
      required: true,
    },
    {
      id: 'test-tube',
      name: 'Test Tubes (x6)',
      description: 'Individual tubes for testing each solution separately.',
      icon: 'TestTube',
      required: true,
    },
    {
      id: 'dropper',
      name: 'Dropper / Pipette',
      description: 'Transfers exact drops of indicator into each test tube.',
      icon: 'Pipette',
      required: true,
    },
    {
      id: 'stirring-rod',
      name: 'Glass Stirring Rod',
      description: 'Stirs the solution to ensure the indicator mixes evenly.',
      icon: 'Minus',
      required: true,
    },
    {
      id: 'indicator-solution',
      name: 'Hibiscus Indicator',
      description: 'Natural red/purple indicator extracted from hibiscus flowers.',
      icon: 'Droplets',
      required: true,
    },
    {
      id: 'acid-solution',
      name: 'Acidic Solutions (lemon juice, vinegar)',
      description: 'Common household acids used as test samples.',
      icon: 'FlaskRound',
      required: true,
    },
    {
      id: 'base-solution',
      name: 'Basic Solutions (baking soda, soap water)',
      description: 'Common household bases used as test samples.',
      icon: 'FlaskRound',
      required: true,
    },
    {
      id: 'neutral-solution',
      name: 'Neutral Solution (distilled water)',
      description: 'Reference solution with a pH of 7.',
      icon: 'Droplet',
      required: true,
    },
    {
      id: 'pH-paper',
      name: 'Universal pH Paper',
      description: 'Colour-coded paper strips for confirming pH readings.',
      icon: 'StretchHorizontal',
      required: false,
    },
    {
      id: 'safety-goggles',
      name: 'Safety Goggles',
      description: 'Eye protection — must be worn at all times in the lab.',
      icon: 'Eye',
      required: true,
    },
    {
      id: 'lab-gloves',
      name: 'Lab Gloves',
      description: 'Nitrile gloves to protect skin from chemical exposure.',
      icon: 'Shield',
      required: true,
    },
  ],

  steps: [
    {
      id: 1,
      title: 'Prepare the Indicator',
      instruction: 'Add 5 ml of hibiscus indicator solution to a clean beaker.',
      detail:
        'The hibiscus indicator contains anthocyanin pigments that change colour depending on the pH of the surrounding solution. The natural resting colour is deep red-purple.',
      toolsRequired: ['beaker', 'indicator-solution', 'dropper'],
      animation: 'pourIndicator',
      expectedObservation: 'The indicator solution appears deep red-purple in the beaker.',
      colorChange: { from: '#6b21a8', to: '#6b21a8', label: 'Deep red-purple' },
      duration: 3,
    },
    {
      id: 2,
      title: 'Label Your Test Tubes',
      instruction: 'Place 6 test tubes in a rack and label them: Lemon Juice, Vinegar, Distilled Water, Milk, Baking Soda Solution, and Soap Water.',
      detail:
        'Proper labelling prevents confusion between samples and ensures your observations are recorded accurately. Each test tube will receive one solution.',
      toolsRequired: ['test-tube'],
      animation: 'labelTubes',
      expectedObservation: 'Six clearly labelled test tubes are ready for use.',
      duration: 2,
    },
    {
      id: 3,
      title: 'Add Solutions to Test Tubes',
      instruction: 'Using the dropper, add 10 drops of each solution into its respective test tube.',
      detail:
        'Keep the dropper clean between solutions or use separate droppers to avoid contamination. Contamination can give misleading results.',
      toolsRequired: ['test-tube', 'dropper', 'acid-solution', 'base-solution', 'neutral-solution'],
      animation: 'addSolutions',
      expectedObservation: 'Each test tube contains a small amount of its respective colourless or slightly coloured solution.',
      duration: 4,
    },
    {
      id: 4,
      title: 'Add Indicator to Each Tube',
      instruction: 'Add 3 drops of hibiscus indicator to each test tube using the dropper.',
      detail:
        'Use exactly 3 drops in every tube so results are comparable. Hold the dropper vertically for consistent drop size.',
      toolsRequired: ['dropper', 'indicator-solution', 'test-tube'],
      animation: 'addIndicator',
      expectedObservation: 'Each test tube now has a small quantity of the red-purple indicator mixed with the sample solution.',
      colorChange: { from: '#6b21a8', to: '#6b21a8', label: 'Red-purple before reaction' },
      duration: 4,
    },
    {
      id: 5,
      title: 'Stir Each Solution',
      instruction: 'Use the stirring rod to gently mix the indicator into each test tube. Rinse the rod between tubes.',
      detail:
        'Thorough mixing ensures the indicator contacts the solution completely, giving the most accurate colour result. Rinsing prevents cross-contamination.',
      toolsRequired: ['stirring-rod', 'test-tube'],
      animation: 'stirSolutions',
      expectedObservation: 'The indicator begins to disperse evenly through each solution. Colour changes become visible.',
      duration: 4,
    },
    {
      id: 6,
      title: 'Observe the Colour Changes',
      instruction: 'Hold each test tube up to the light and record the colour of each solution.',
      detail:
        'Acids (lemon juice, vinegar) will turn the indicator pink/red. Bases (baking soda, soap) will turn it green/yellow. Neutral water will remain purple.',
      toolsRequired: ['test-tube'],
      animation: 'observeColors',
      expectedObservation:
        'Lemon juice & vinegar → bright pink/red; Distilled water → purple; Milk → pale pink; Baking soda → green; Soap water → yellow-green.',
      colorChange: { from: '#6b21a8', to: '#ec4899', label: 'Pink/Red = Acid' },
      duration: 5,
    },
    {
      id: 7,
      title: 'Confirm with pH Paper',
      instruction: 'Dip a strip of universal pH paper into each solution and match the colour to the pH scale chart.',
      detail:
        'pH paper provides a numerical confirmation of your indicator results. Compare your indicator colour observations with the pH values to check for consistency.',
      toolsRequired: ['pH-paper', 'test-tube'],
      animation: 'pHPaperTest',
      expectedObservation:
        'Acids show pH 2–5 (red-orange on pH strip); water shows pH 7 (green); bases show pH 8–11 (blue-purple on pH strip).',
      colorChange: { from: '#22c55e', to: '#3b82f6', label: 'Green=Neutral, Blue=Base' },
      duration: 4,
    },
  ],

  quizQuestions: [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'What colour does hibiscus indicator turn in an acidic solution?',
      options: [
        { id: 'a', text: 'Blue or green' },
        { id: 'b', text: 'Yellow or orange' },
        { id: 'c', text: 'Pink or red' },
        { id: 'd', text: 'It stays purple' },
      ],
      correctOptionId: 'c',
      explanation:
        'Acids cause anthocyanin pigments in the hibiscus indicator to shift toward the pink/red end of the spectrum. This happens because the pigment gains a proton (H⁺) in acidic conditions.',
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which of the following household items is a BASE?',
      options: [
        { id: 'a', text: 'Lemon juice' },
        { id: 'b', text: 'Vinegar' },
        { id: 'c', text: 'Baking soda solution' },
        { id: 'd', text: 'Cola drink' },
      ],
      correctOptionId: 'c',
      explanation:
        'Baking soda (sodium bicarbonate) dissolved in water creates an alkaline (basic) solution with a pH above 7. The others — lemon juice, vinegar, and cola — are all acidic.',
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'What is the pH of a neutral solution such as distilled water?',
      options: [
        { id: 'a', text: '0' },
        { id: 'b', text: '5' },
        { id: 'c', text: '7' },
        { id: 'd', text: '14' },
      ],
      correctOptionId: 'c',
      explanation:
        'The pH scale runs from 0 (most acidic) to 14 (most basic/alkaline). A pH of 7 is exactly neutral — neither acidic nor basic. Pure water at 25 °C has a pH of 7.',
    },
    {
      id: 4,
      type: 'true-false',
      question: 'A solution with a pH of 2 is MORE acidic than a solution with a pH of 5.',
      options: [
        { id: 'a', text: 'True' },
        { id: 'b', text: 'False' },
      ],
      correctOptionId: 'a',
      explanation:
        'True. The pH scale is logarithmic, so each whole number step represents a 10× change in acidity. pH 2 is 1,000 times more acidic than pH 5. Lower pH = higher acidity.',
    },
    {
      id: 5,
      type: 'multiple-choice',
      question: 'Why is it important to rinse the stirring rod between test tubes?',
      options: [
        { id: 'a', text: 'To cool down the rod before the next use' },
        { id: 'b', text: 'To prevent cross-contamination of solutions' },
        { id: 'c', text: 'To add extra water to the next solution' },
        { id: 'd', text: 'It is not important — you can skip it' },
      ],
      correctOptionId: 'b',
      explanation:
        'Cross-contamination occurs when traces of one solution are transferred to another via the stirring rod. This can alter the pH of the next test tube and give inaccurate results, making it a critical step for experimental validity.',
    },
  ],
};
