/**
 * KisanSetu Dynamic Mandi Capacity & Load Balancing Engine
 * Provides transparent, explainable operational telemetry calculations without black-box ML.
 */

export const APMC_ENGINE_CONSTANTS = {
  AVG_PROCESSING_TIME_MINS: 8, // Average time for gate verification + weighbridge + quality sample
  DEFAULT_SLOT_CAPACITY: 5,   // Configurable max concurrent arrivals per 30-min window
  CONGESTION_THRESHOLDS: {
    HIGH_CAPACITY_PERCENT: 85,
    HIGH_WAIT_MINS: 45,
    MODERATE_CAPACITY_PERCENT: 70,
    MODERATE_WAIT_MINS: 25
  }
};

/**
 * 1. Explainable Wait-Time Estimation Formula
 * Calculates realistic waiting minutes based on active queue depth and available counters.
 * Formula: EstWait = (Farmers Ahead * Avg Processing Time) / Active Counters
 */
export function calculateEstimatedWaitMinutes(farmersAhead = 0, activeCounters = 4, avgTimeMins = APMC_ENGINE_CONSTANTS.AVG_PROCESSING_TIME_MINS) {
  const safeAhead = Math.max(0, Number(farmersAhead) || 0);
  const safeCounters = Math.max(1, Number(activeCounters) || 1);
  
  if (safeAhead === 0) return 4; // Baseline buffer for immediate gate entry
  
  const estimated = Math.round((safeAhead * avgTimeMins) / safeCounters);
  return Math.max(5, estimated);
}

/**
 * 2. Dynamic Mandi Yard Congestion State Evaluator
 * Evaluates real-time congestion category based on capacity utilization and wait times.
 */
export function evaluateMandiCongestionState({
  queueCount = 0,
  capacityPercent = 50,
  estWaitMinutes = 15,
  activeCounters = 4
}) {
  const { HIGH_CAPACITY_PERCENT, HIGH_WAIT_MINS, MODERATE_CAPACITY_PERCENT, MODERATE_WAIT_MINS } = APMC_ENGINE_CONSTANTS.CONGESTION_THRESHOLDS;
  
  const isHighCapacity = capacityPercent >= HIGH_CAPACITY_PERCENT;
  const isHighWait = estWaitMinutes >= HIGH_WAIT_MINS;
  const isCountersStrained = activeCounters <= 2 && queueCount >= 15;

  if (isHighCapacity || isHighWait || isCountersStrained) {
    return {
      status: 'CONGESTED',
      severity: 'HIGH',
      badgeText: 'CONGESTED YARD',
      color: 'rose',
      reason: `Heavy yard load (${capacityPercent}% capacity, ~${estWaitMinutes}m wait). Consider nearby yard.`
    };
  }

  if (capacityPercent >= MODERATE_CAPACITY_PERCENT || estWaitMinutes >= MODERATE_WAIT_MINS) {
    return {
      status: 'MODERATE',
      severity: 'MEDIUM',
      badgeText: 'MODERATE LOAD',
      color: 'amber',
      reason: `Moderate truck inflow (${capacityPercent}% capacity, ~${estWaitMinutes}m wait).`
    };
  }

  return {
    status: 'OPTIMAL',
    severity: 'LOW',
    badgeText: 'NORMAL LOAD',
    color: 'emerald',
    reason: `Clear queue flow (${capacityPercent}% capacity, ~${estWaitMinutes}m wait).`
  };
}

/**
 * 3. Dynamic Mandi Load Balancing & Recommendation Algorithm
 * Multi-criteria ranking engine to balance truck influx across regional procurement centres.
 * 
 * Formula:
 * Score = (WaitTime * 0.35) + (Capacity% * 0.35) - (AvailableSlots * 0.5) - (ActiveCounters * 2.0) + (Distance * 0.25)
 * Lower score represents higher operational readiness / best recommendation.
 */
export function rankAndRecommendCentres(centresList = []) {
  if (!centresList || centresList.length === 0) return [];

  const scored = centresList.map(c => {
    const queueCount = Number(c.queueCount || c.totalActive || 0);
    const activeCounters = Number(c.activeCounters || c.active_counters || 4);
    const distanceKm = Number(c.distanceKm || c.distance_km || 15);
    const availableSlots = Number(c.availableSlots || 8);
    const capacityPercent = Number(c.capacityPercent || 50);

    const calculatedWait = c.estWaitMinutes != null 
      ? Number(c.estWaitMinutes) 
      : calculateEstimatedWaitMinutes(queueCount, activeCounters);

    // Multi-factor load score
    const loadScore = Number((
      (calculatedWait * 0.35) +
      (capacityPercent * 0.35) -
      (availableSlots * 0.5) -
      (activeCounters * 2.0) +
      (distanceKm * 0.25)
    ).toFixed(2));

    const congestionState = evaluateMandiCongestionState({
      queueCount,
      capacityPercent,
      estWaitMinutes: calculatedWait,
      activeCounters
    });

    return {
      ...c,
      queueCount,
      activeCounters,
      distanceKm,
      availableSlots,
      capacityPercent,
      estWaitMinutes: calculatedWait,
      loadScore,
      congestionState
    };
  });

  // Sort ascending by score (lowest score = highest efficiency & recommended)
  scored.sort((a, b) => a.loadScore - b.loadScore);

  return scored;
}
