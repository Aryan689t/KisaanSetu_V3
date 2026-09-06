/**
 * Official Government Specifications for Paddy Quality Inspection (DoCA / MSP / FAQ Standard)
 */
export const PADDY_QUALITY_SPECIFICATIONS = [
  {
    id: 'moisturePercent',
    name: 'Moisture Content',
    unit: '%',
    maxLimit: 17.0,
    defaultValue: 14.5,
    description: 'Permissible moisture limit for MSP procurement (≤ 17.0%)'
  },
  {
    id: 'foreignMatter',
    name: 'Foreign Matter',
    subtext: 'Inorganic / Dust & Organic / Chaff',
    unit: '%',
    maxLimit: 2.0,
    defaultValue: 1.2,
    breakdown: 'Inorganic: 0.4% | Organic: 0.8%',
    description: 'Inorganic (dust, stones ≤ 0.5%) & Organic (chaff, straw ≤ 1.5%)'
  },
  {
    id: 'damagedGrains',
    name: 'Damaged & Discoloured Grains',
    subtext: 'Heat damaged, discoloured & sprouted',
    unit: '%',
    maxLimit: 3.0,
    defaultValue: 0.8,
    description: 'Damaged / discoloured / sprouted kernels (≤ 3.0%)'
  },
  {
    id: 'immatureGrains',
    name: 'Shrivelled & Immature Grains',
    subtext: 'Shrunken, immature & underdeveloped',
    unit: '%',
    maxLimit: 3.0,
    defaultValue: 1.1,
    description: 'Immature, shrunken and non-developed kernels (≤ 3.0%)'
  },
  {
    id: 'admixture',
    name: 'Admixture (Lower Varieties)',
    subtext: 'Presence of inferior/lower-grade crop varieties',
    unit: '%',
    maxLimit: 5.0,
    defaultValue: 0.5,
    description: 'Admixture of lower or inferior paddy varieties (≤ 5.0%)'
  },
  {
    id: 'weevilledGrains',
    name: 'Weevilled Grains',
    subtext: 'Insect-bored / insect-damaged grains',
    unit: '%',
    maxLimit: 1.0,
    defaultValue: 0.2,
    description: 'Insect-bored or weevil-damaged grains (≤ 1.0%)'
  }
];

/**
 * Validates a quality readings object against official limits.
 */
export function validateQualityParameters(readings = {}) {
  const evaluated = PADDY_QUALITY_SPECIFICATIONS.map(spec => {
    const rawVal = readings[spec.id];
    const val = rawVal != null && rawVal !== '' ? Number(rawVal) : spec.defaultValue;
    const isNumeric = !isNaN(val) && val >= 0;
    const isPass = isNumeric && val <= spec.maxLimit;

    return {
      ...spec,
      value: val,
      isPass,
      exceededBy: isPass ? 0 : Number((val - spec.maxLimit).toFixed(1))
    };
  });

  const failing = evaluated.filter(e => !e.isPass);
  const allPassed = failing.length === 0;

  return {
    evaluated,
    failing,
    allPassed
  };
}
