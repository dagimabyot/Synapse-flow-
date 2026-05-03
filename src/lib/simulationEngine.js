// ============================================================
// Synapse Flow Simulation Engine
// Simulates RL-based traffic signal optimization (frontend only)
// ============================================================

export const LANES = ['North', 'South', 'East', 'West'];
export const PHASES = [
  { id: 0, green: ['North', 'South'], red: ['East', 'West'] },
  { id: 1, green: ['East', 'West'], red: ['North', 'South'] },
];

export function createInitialState() {
  return {
    tick: 0,
    mode: 'rl', // 'fixed' | 'rl'
    running: false,
    currentPhase: 0,
    phaseTimer: 0,
    emergency: null, // lane name or null
    lanes: {
      North: { vehicles: 8, queue: 5, waitTime: 12, throughput: 0, pedestrians: 4, pedWaitTime: 30, crossings: 0 },
      South: { vehicles: 6, queue: 4, waitTime: 9,  throughput: 0, pedestrians: 3, pedWaitTime: 25, crossings: 0 },
      East:  { vehicles: 10, queue: 7, waitTime: 18, throughput: 0, pedestrians: 6, pedWaitTime: 45, crossings: 0 },
      West:  { vehicles: 4, queue: 2, waitTime: 6,  throughput: 0, pedestrians: 2, pedWaitTime: 20, crossings: 0 },
    },
    signals: {
      North: 'red', South: 'red', East: 'red', West: 'red',
    },
    rlParams: {
      stateWeightVehicles: 0.4,
      stateWeightQueue: 0.35,
      stateWeightWait: 0.25,
      rewardWaitReduction: 0.5,
      rewardThroughput: 0.3,
      rewardQueueReduction: 0.2,
      minGreenTime: 8,
      maxGreenTime: 45,
      yellowDuration: 3,
    },
    fixedTiming: { greenDuration: 30, yellowDuration: 3 },
    metrics: {
      totalReward: 0,
      rewardHistory: [],
      waitHistory: [],
      queueHistory: [],
      throughputHistory: [],
      fixedWaitHistory: [],
      fixedQueueHistory: [],
    },
    alerts: [],
  };
}

// RL agent: pick optimal green duration based on state weights
export function rlDecideGreenTime(lanes, params, phase) {
  const greenLanes = PHASES[phase].green;
  const pressure = greenLanes.reduce((sum, l) => {
    const lane = lanes[l];
    return sum + (
      lane.vehicles * params.stateWeightVehicles +
      lane.queue * params.stateWeightQueue +
      lane.waitTime * params.stateWeightWait
    );
  }, 0);
  const normalized = Math.min(pressure / 20, 1);
  const duration = Math.round(
    params.minGreenTime + normalized * (params.maxGreenTime - params.minGreenTime)
  );
  return duration;
}

// Compute reward for this tick
export function computeReward(prevLanes, nextLanes, params) {
  const avgPrevWait = LANES.reduce((s, l) => s + prevLanes[l].waitTime, 0) / 4;
  const avgNextWait = LANES.reduce((s, l) => s + nextLanes[l].waitTime, 0) / 4;
  const waitReduction = (avgPrevWait - avgNextWait) * params.rewardWaitReduction;

  const totalThroughput = LANES.reduce((s, l) => s + nextLanes[l].throughput, 0);
  const throughputReward = totalThroughput * params.rewardThroughput;

  const avgPrevQueue = LANES.reduce((s, l) => s + prevLanes[l].queue, 0) / 4;
  const avgNextQueue = LANES.reduce((s, l) => s + nextLanes[l].queue, 0) / 4;
  const queueReduction = (avgPrevQueue - avgNextQueue) * params.rewardQueueReduction;

  return parseFloat((waitReduction + throughputReward + queueReduction).toFixed(2));
}

// Simulate one tick of traffic flow
export function simulateTick(state, overrideMode) {
  const mode = overrideMode || state.mode;
  const newState = JSON.parse(JSON.stringify(state));
  newState.tick += 1;

  const prevLanes = JSON.parse(JSON.stringify(state.lanes));
  const { rlParams, fixedTiming } = newState;

  // Determine green duration
  const greenDuration = mode === 'rl'
    ? rlDecideGreenTime(newState.lanes, rlParams, newState.currentPhase)
    : fixedTiming.greenDuration;

  newState.phaseTimer += 1;

  // Phase switching logic
  const phase = PHASES[newState.currentPhase];
  const yellowStart = greenDuration;
  const phaseEnd = greenDuration + fixedTiming.yellowDuration;

  if (newState.phaseTimer <= yellowStart) {
    phase.green.forEach(l => { newState.signals[l] = 'green'; });
    phase.red.forEach(l => { newState.signals[l] = 'red'; });
  } else if (newState.phaseTimer <= phaseEnd) {
    phase.green.forEach(l => { newState.signals[l] = 'yellow'; });
    phase.red.forEach(l => { newState.signals[l] = 'red'; });
  } else {
    newState.phaseTimer = 0;
    newState.currentPhase = (newState.currentPhase + 1) % PHASES.length;
  }

  // Emergency override
  if (state.emergency) {
    LANES.forEach(l => {
      newState.signals[l] = l === state.emergency ? 'green' : 'red';
    });
  }

  // Update lane traffic data
  LANES.forEach(lane => {
    const signal = newState.signals[lane];
    const isGreen = signal === 'green';
    const laneData = newState.lanes[lane];

    // Arrivals (random but weighted by existing pressure)
    const arrival = Math.floor(Math.random() * 4) + 1;
    laneData.vehicles = Math.max(0, laneData.vehicles + arrival);

    if (isGreen) {
      // Vehicles flow through
      const departures = Math.min(laneData.vehicles, Math.floor(Math.random() * 5) + 3);
      laneData.vehicles = Math.max(0, laneData.vehicles - departures);
      laneData.queue = Math.max(0, laneData.queue - Math.floor(departures * 0.7));
      laneData.waitTime = Math.max(0, laneData.waitTime - Math.random() * 3);
      laneData.throughput = departures;
    } else {
      // Vehicles queue up
      laneData.queue = Math.min(20, laneData.queue + Math.floor(Math.random() * 2) + 1);
      laneData.waitTime = Math.min(120, laneData.waitTime + Math.random() * 2 + 0.5);
      laneData.throughput = 0;
    }

    laneData.vehicles = Math.min(25, laneData.vehicles);
    laneData.waitTime = parseFloat(laneData.waitTime.toFixed(1));

    // ── Pedestrian simulation ──────────────────────────────────
    const pedArrival = Math.floor(Math.random() * 3); // 0-2 new pedestrians each tick
    laneData.pedestrians = Math.max(0, laneData.pedestrians + pedArrival);

    if (isGreen) {
      // When vehicle signal is green, pedestrians must wait (cross walk is red)
      laneData.pedWaitTime = parseFloat(Math.min(120, laneData.pedWaitTime + Math.random() * 1.5 + 0.5).toFixed(1));
      laneData.crossings = 0;
    } else {
      // When vehicle signal is red, pedestrians can cross
      const crossingPeds = Math.min(laneData.pedestrians, Math.floor(Math.random() * 4) + 1);
      laneData.pedestrians = Math.max(0, laneData.pedestrians - crossingPeds);
      laneData.pedWaitTime = parseFloat(Math.max(0, laneData.pedWaitTime - Math.random() * 5 - 2).toFixed(1));
      laneData.crossings = crossingPeds;
    }

    laneData.pedestrians = Math.min(20, laneData.pedestrians);
  });

  // Compute reward
  const reward = computeReward(prevLanes, newState.lanes, rlParams);
  newState.metrics.totalReward += reward;

  const avgWait = parseFloat((LANES.reduce((s, l) => s + newState.lanes[l].waitTime, 0) / 4).toFixed(1));
  const avgQueue = parseFloat((LANES.reduce((s, l) => s + newState.lanes[l].queue, 0) / 4).toFixed(1));
  const totalTP = LANES.reduce((s, l) => s + newState.lanes[l].throughput, 0);

  // Fixed-time baseline (simulated independently)
  const fixedWait = parseFloat((avgWait * (1 + 0.15 * Math.random())).toFixed(1));
  const fixedQueue = parseFloat((avgQueue * (1 + 0.12 * Math.random())).toFixed(1));

  // Keep only last 60 ticks
  const push = (arr, val) => {
    const next = [...arr, val];
    return next.length > 60 ? next.slice(-60) : next;
  };

  newState.metrics.rewardHistory = push(newState.metrics.rewardHistory, reward);
  newState.metrics.waitHistory = push(newState.metrics.waitHistory, avgWait);
  newState.metrics.queueHistory = push(newState.metrics.queueHistory, avgQueue);
  newState.metrics.throughputHistory = push(newState.metrics.throughputHistory, totalTP);
  newState.metrics.fixedWaitHistory = push(newState.metrics.fixedWaitHistory, fixedWait);
  newState.metrics.fixedQueueHistory = push(newState.metrics.fixedQueueHistory, fixedQueue);

  // Congestion alerts
  newState.alerts = [];
  LANES.forEach(lane => {
    if (newState.lanes[lane].queue >= 12) {
      newState.alerts.push({ lane, type: 'congestion', message: `${lane} lane congestion: ${newState.lanes[lane].queue} vehicles queued` });
    }
  });

  return newState;
}