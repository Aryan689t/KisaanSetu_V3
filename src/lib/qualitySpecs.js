/**
 * Official Government Specifications for Paddy Quality Inspection (DoCA / MSP)
 */
export const PADDY_QUALITY_SPECIFICATIONS = [
  {
    id: 'moisturePercent',
    name: 'Moisture Content',
    unit: '%',
    maxLimit: 17.0,
    defaultValue: 14.2,
    description: 'Permissible moisture limit for MSP procurement (≤ 17.0%)'
  },
  {
    id: 'foreignMatter',
    name: 'Foreign Matter',
    unit: '%',
    maxLimit: 2.0,
    defaultValue: 1.2,
    description: 'Inorganic (dust, stones) and organic foreign matter (≤ 2.0%)'
  },
  {
    id: 'damagedGrains',
    name: 'Damaged, Discolored, Sprouted & Weevilled Grains',
    unit: '%',
    maxLimit: 5.0,
    defaultValue: 2.4,
    description: 'Damaged / sprouted / weevilled grains (≤ 5.0%, damaged ≤ 3.0%)'
  },
  {
    id: 'chalkyGrains',
    name: 'Chalky Grains',
    unit: '%',
    maxLimit: 5.0,
    defaultValue: 3.0,
    description: 'Chalky and milky white grains (≤ 5.0%)'
  },
  {
    id: 'admixture',
    name: 'Admixture of Lower Varieties',
    unit: '%',
    maxLimit: 10.0,
    defaultValue: 4.0,
    description: 'Admixture of lower / inferior varieties (≤ 10.0%)'
  },
  {
    id: 'immatureGrains',
    name: 'Immature, Shrunken & Shrivelled Grains',
    unit: '%',
    maxLimit: 3.0,
    defaultValue: 1.5,
    description: 'Immature, shrunken and non-developed grains (≤ 3.0%)'
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
