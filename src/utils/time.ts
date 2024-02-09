import { N0 } from "../definitions";

let deltaTime = 0;
let frameStart = 0;
let frameEnd = 0;
const msInSec = 1000;

const MAX_SAMPLES = 100;

const deltaTimeSamples = new Array(MAX_SAMPLES).fill(N0);
let deltaTimeSampled = 0;
let deltaTimeSampleIndex = 0;

const idleTimeSamples = new Array(MAX_SAMPLES).fill(N0);
let idleTimeSampled = 0;
let idleTimeSampleIndex = 0;

const workTimeSamples = new Array(MAX_SAMPLES).fill(N0);
let workTimeSampled = 0;
let workTimeSampleIndex = 0;

export const frame = {
  start(): void {
    const frameNow = performance.now();
    const idleTime = frameNow - frameEnd;
    const workTime = frameEnd - frameStart;
    deltaTime = frameNow - frameStart;
    frameStart = frameNow;

    deltaTimeSampled -= deltaTimeSamples[deltaTimeSampleIndex];
    deltaTimeSampled += deltaTime;
    deltaTimeSamples[deltaTimeSampleIndex] = deltaTime;
    if (++deltaTimeSampleIndex >= MAX_SAMPLES) {
      deltaTimeSampleIndex = N0;
    }

    idleTimeSampled -= idleTimeSamples[idleTimeSampleIndex];
    idleTimeSampled += idleTime;
    idleTimeSamples[idleTimeSampleIndex] = idleTime;
    if (++idleTimeSampleIndex >= MAX_SAMPLES) {
      idleTimeSampleIndex = N0;
    }

    workTimeSampled -= workTimeSamples[workTimeSampleIndex];
    workTimeSampled += workTime;
    workTimeSamples[workTimeSampleIndex] = workTime;
    if (++workTimeSampleIndex >= MAX_SAMPLES) {
      workTimeSampleIndex = N0;
    }
  },
  end(): void {
    frameEnd = performance.now();
  },
  get idleTime(): number {
    return idleTimeSampled / MAX_SAMPLES;
  },
  get workTime(): number {
    return workTimeSampled / MAX_SAMPLES;
  },
  get deltaTime(): number {
    return deltaTime;
  },
  get avgDeltaTime(): number {
    return deltaTimeSampled / MAX_SAMPLES;
  },
  get fps(): number {
    // msInSec / workTime / frames
    return (msInSec * MAX_SAMPLES) / deltaTimeSampled;
  },
};
