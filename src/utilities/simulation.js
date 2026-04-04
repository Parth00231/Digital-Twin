// Calculate new productivity after adding extra hours
export function calculateNewCodingTime(currentHours, extraHoursPerDay, days = 7) {
  return currentHours + extraHoursPerDay * days;
}

// Calculate improvement percentage
export function calculateImprovement(current, updated) {
  if (current === 0) return 0;
  return (((updated - current) / current) * 100).toFixed(0);
}

// Generate simulation result object
export function runSimulation({
  currentCoding = 5,
  extraHours = 2,
  days = 7,
}) {
  const newCoding = calculateNewCodingTime(
    currentCoding,
    extraHours,
    days
  );

  const improvement = calculateImprovement(
    currentCoding,
    newCoding
  );

  return {
    current: currentCoding,
    projected: newCoding,
    improvement,
  };
}

// OPTIONAL: Multi-factor simulation (future upgrade)
export function advancedSimulation({
  coding = 5,
  youtube = 3,
  sleep = 6,
  extraStudy = 2,
}) {
  const improvedCoding = coding + extraStudy * 7;
  const reducedDistraction = youtube - 1; // assume user cuts 1hr
  const betterEnergy = sleep + 1;

  return {
    coding: improvedCoding,
    distraction: Math.max(reducedDistraction, 0),
    energyScore: Math.min(betterEnergy * 10, 100),
  };
}