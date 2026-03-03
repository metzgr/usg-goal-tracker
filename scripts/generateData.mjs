/**
 * generateData.mjs
 *
 * Reads the National Drug Control Strategy from stratml_data/ and writes
 * src/data/*.json files that the frontend already consumes.
 * No frontend code changes required.
 *
 * Usage: node scripts/generateData.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const stratmlDir = resolve(root, "stratml_data");
const dataDir = resolve(root, "src/data");

// ── Load raw StratML data ──────────────────────────────────────────────────
const load = (name) =>
  JSON.parse(readFileSync(resolve(stratmlDir, name), "utf-8"));

const rawPlans = load("StrategicPlan.json");
const rawOrgs = load("Organization.json");
const rawGoals = load("Goal.json");
const rawObjectives = load("Objective.json");
const rawIndicators = load("PerformanceIndicator.json");
const rawMeasurements = load("MeasurementInstance.json");
const rawCategories = load("Category.json");
const rawMedia = load("Media.json");

// ── Build lookup maps ──────────────────────────────────────────────────────
const byId = (arr) => Object.fromEntries(arr.map((x) => [x.id, x]));
const orgById = byId(rawOrgs);
const planById = byId(rawPlans);
const goalById = byId(rawGoals);
const objById = byId(rawObjectives);
const indById = byId(rawIndicators);
const measById = byId(rawMeasurements);
const mediaById = byId(rawMedia);

// ── Target plan: National Drug Control Strategy ────────────────────────────
const PLAN_ID = "recfvMFWPJFzQ9z6G";
const plan = planById[PLAN_ID];
if (!plan) throw new Error("Plan not found: " + PLAN_ID);

// ── Collect related entities ───────────────────────────────────────────────
const planGoalIds = new Set(plan.Goals || []);
const planGoals = rawGoals.filter((g) => planGoalIds.has(g.id));

const planObjIds = new Set();
const planObjs = [];
for (const g of planGoals) {
  for (const oid of g.Objective || []) {
    if (!planObjIds.has(oid)) {
      planObjIds.add(oid);
      if (objById[oid]) planObjs.push(objById[oid]);
    }
  }
}

const planIndIds = new Set();
const planInds = [];
for (const o of planObjs) {
  for (const iid of o.PerformanceIndicator || []) {
    if (!planIndIds.has(iid)) {
      planIndIds.add(iid);
      if (indById[iid]) planInds.push(indById[iid]);
    }
  }
}

const planMeasIds = new Set();
const planMeas = [];
for (const ind of planInds) {
  for (const mid of ind.MeasurementInstance || []) {
    if (!planMeasIds.has(mid)) {
      planMeasIds.add(mid);
      if (measById[mid]) planMeas.push(measById[mid]);
    }
  }
}

// Categories linked to these goals
const planCatIds = new Set();
for (const g of planGoals) {
  for (const cid of g.Category || []) planCatIds.add(cid);
}
const planCats = rawCategories.filter((c) => planCatIds.has(c.id));

// Org
const orgId = (plan.Organization || [])[0];
const org = orgById[orgId] || {};

// ── Helpers ────────────────────────────────────────────────────────────────

function toFiscalYear(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const month = d.getUTCMonth(); // 0-indexed
  return month >= 9 ? d.getUTCFullYear() + 1 : d.getUTCFullYear();
}

function toFiscalQuarter(dateStr) {
  if (!dateStr) return null;
  const month = new Date(dateStr).getUTCMonth();
  if (month >= 9) return 1; // Oct-Dec
  if (month >= 6) return 4; // Jul-Sep
  if (month >= 3) return 3; // Apr-Jun
  return 2; // Jan-Mar
}

function computeStatus(endDate) {
  // Force "Active" since this is the only plan and the frontend defaults to showing Active items
  return "Active";
}

function seededRandom(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 100000;
}

function formatNumber(n) {
  if (n == null || isNaN(n)) return undefined;
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(n);
}

// Sort measurements for an indicator by EndDate ascending
function sortedMeasurements(indicator) {
  const mids = indicator.MeasurementInstance || [];
  return mids
    .map((mid) => measById[mid])
    .filter(Boolean)
    .sort((a, b) => new Date(a.EndDate) - new Date(b.EndDate));
}

function deriveTargetDirection(measurements) {
  if (measurements.length < 2) {
    const tr = measurements[0]?.TargetResult;
    const ar = measurements[0]?.ActualResult;
    if (tr != null && ar != null) return tr > ar ? "Increase" : "Decrease";
    return "Increase";
  }
  const first = measurements[0]?.TargetResult;
  const last = measurements[measurements.length - 1]?.TargetResult;
  if (first == null || last == null) return "Increase";
  if (last > first) return "Increase";
  if (last < first) return "Decrease";
  return "Maintain";
}

function isImproved(current, previous, direction) {
  if (current == null || previous == null) return false;
  if (direction === "Increase") return current > previous;
  if (direction === "Decrease") return current < previous;
  return current === previous; // Maintain
}

// ── Build reverse indexes ──────────────────────────────────────────────────
// objectiveId → indicator[]
const indsByObj = {};
for (const ind of planInds) {
  for (const oid of ind.Objective || []) {
    (indsByObj[oid] = indsByObj[oid] || []).push(ind);
  }
}

// goalId → objective[]
const objsByGoal = {};
for (const obj of planObjs) {
  for (const gid of obj.Goal || []) {
    (objsByGoal[gid] = objsByGoal[gid] || []).push(obj);
  }
}

// indicatorId → sorted measurements
const measByInd = {};
for (const ind of planInds) {
  measByInd[ind.id] = sortedMeasurements(ind);
}

// ── Compute indicator improvement stats for a set of indicators ────────────
function computeIndicatorStats(indicators) {
  let count = 0;
  let improved = 0;
  let prevImproved = 0;

  for (const ind of indicators) {
    const ms = measByInd[ind.id] || [];
    if (ms.length === 0) continue;
    count++;

    const dir = deriveTargetDirection(ms);
    const mostRecent = ms[ms.length - 1];
    const prev = ms.length >= 2 ? ms[ms.length - 2] : null;
    const prevPrev = ms.length >= 3 ? ms[ms.length - 3] : null;

    if (prev && isImproved(mostRecent.ActualResult, prev.ActualResult, dir)) {
      improved++;
    }
    if (prevPrev && prev && isImproved(prev.ActualResult, prevPrev.ActualResult, dir)) {
      prevImproved++;
    }
  }

  return {
    indicatorCount: indicators.length,
    indicatorImprovedCount: improved,
    indicatorImprovedPercent: indicators.length > 0 ? improved / indicators.length : 0,
    previousIndicatorImprovedCount: prevImproved,
  };
}

// ── Get all indicators for a goal ──────────────────────────────────────────
function getAllIndicatorsForGoal(goalId) {
  const objs = objsByGoal[goalId] || [];
  const inds = [];
  const seen = new Set();
  for (const obj of objs) {
    for (const ind of indsByObj[obj.id] || []) {
      if (!seen.has(ind.id)) {
        seen.add(ind.id);
        inds.push(ind);
      }
    }
  }
  return inds;
}

// ── Load existing image.json for artwork mapping ───────────────────────────
const existingImages = JSON.parse(
  readFileSync(resolve(dataDir, "image.json"), "utf-8")
);

// Assign artwork images to the 7 drug strategy goals from available unlinked images
const availableArtwork = [
  "recNw5hnF9HrSRsQb", // pills (good for drug strategy)
  "recGpiVdPQNl5BdaS", // ambulance
  "recJOV69ely3GZoiG", // usa
  "recWhG2fbg2npIAm0", // highway
  "recCGrYtm9rObObnB", // veteran
  "reckc8Nzc8rshhsPH", // hands
  "recKMY7mXEsi14pEz", // hand
];
const goalIds = [...planGoalIds];
const goalImageMap = {};
for (let i = 0; i < goalIds.length; i++) {
  goalImageMap[goalIds[i]] = availableArtwork[i % availableArtwork.length];
}

// Plan-level image: use "pills" for the drug strategy plan
const planImageId = "recNw5hnF9HrSRsQb";

// ── Build output: plan.json ────────────────────────────────────────────────
const allPlanInds = planInds;
const planStats = computeIndicatorStats(allPlanInds);
const allPlanObjIds = planObjs.map((o) => o.id);

const planOut = [
  {
    id: plan.id,
    name: plan.Name,
    status: computeStatus(plan.EndDate),
    org: [orgId],
    startDate: plan.StartDate,
    endDate: plan.EndDate,
    goal: goalIds,
    type: "strategic-plan",
    orgName: [org.Name || ""],
    orgAcronym: [org.Acronym || ""],
    startFiscalYear: toFiscalYear(plan.StartDate),
    endFiscalYear: toFiscalYear(plan.EndDate),
    goalCount: goalIds.length,
    image: [planImageId],
    objectiveCount: planObjs.length,
    ...planStats,
    metricCount: planInds.length,
    objective: allPlanObjIds,
    objectType: "Plan",
    views: seededRandom(plan.id),
  },
];

// ── Build output: goal.json ────────────────────────────────────────────────
const goalOut = planGoals.map((g) => {
  const gObjs = objsByGoal[g.id] || [];
  const gInds = getAllIndicatorsForGoal(g.id);
  const stats = computeIndicatorStats(gInds);

  return {
    id: g.id,
    name: g.Name,
    startDate: g.StartDate,
    endDate: g.EndDate,
    plan: [PLAN_ID],
    image: goalImageMap[g.id] ? [goalImageMap[g.id]] : [],
    sequence: g.SequenceIndicator || 0,
    orgName: [org.Name || ""],
    orgAcronym: [org.Acronym || ""],
    objective: gObjs.map((o) => o.id),
    objectiveCount: gObjs.length,
    startFiscalYear: toFiscalYear(g.StartDate),
    endFiscalYear: toFiscalYear(g.EndDate),
    metricCount: gInds.length,
    ...stats,
    description: g.Description || "",
    org: [orgId],
    objectType: "Goal",
    tag: g.Category || [],
    views: seededRandom(g.id),
    status: computeStatus(g.EndDate),
  };
});

// ── Build output: metric.json ──────────────────────────────────────────────
const metricOut = planInds.map((ind) => {
  const ms = measByInd[ind.id] || [];
  const objId = (ind.Objective || [])[0];
  const obj = objById[objId];
  const goalId = obj ? (obj.Goal || [])[0] : null;
  const goal = goalId ? goalById[goalId] : null;

  const dir = deriveTargetDirection(ms);
  const mostRecent = ms.length > 0 ? ms[ms.length - 1] : null;
  const prev = ms.length >= 2 ? ms[ms.length - 2] : null;

  const mostRecentResult = mostRecent?.ActualResult;
  const mostRecentTarget = mostRecent?.TargetResult;

  const percentProgress =
    mostRecentTarget && mostRecentTarget !== 0
      ? Math.round((mostRecentResult / mostRecentTarget) * 100) / 100
      : null;

  const prevResult = prev?.ActualResult;
  const percentChange =
    prevResult != null && prevResult !== 0
      ? Math.round(((mostRecentResult - prevResult) / Math.abs(prevResult)) * 100) / 100
      : null;

  const improved = prev
    ? isImproved(mostRecentResult, prevResult, dir)
    : false;

  // Result trend
  let resultTrend = "Unchanged";
  if (prev) {
    if (mostRecentResult > prevResult) resultTrend = dir === "Increase" ? "Improved" : "Worsened";
    else if (mostRecentResult < prevResult) resultTrend = dir === "Decrease" ? "Improved" : "Worsened";
  }

  // Previous result trend (prev vs prevPrev)
  const prevPrev = ms.length >= 3 ? ms[ms.length - 3] : null;
  let prevResultTrend = "Unchanged";
  let prevImproved = false;
  if (prevPrev && prev) {
    if (prev.ActualResult > prevPrev.ActualResult) prevResultTrend = dir === "Increase" ? "Improved" : "Worsened";
    else if (prev.ActualResult < prevPrev.ActualResult) prevResultTrend = dir === "Decrease" ? "Improved" : "Worsened";
    prevImproved = isImproved(prev.ActualResult, prevPrev.ActualResult, dir);
  }

  const targetDirectionInsert =
    dir === "Increase" ? "to" : dir === "Decrease" ? "to" : "at";

  // Tags: find categories that include this goal
  const tagIds = [];
  for (const cat of planCats) {
    if (goalId && (cat.Goal || []).includes(goalId)) {
      tagIds.push(cat.id);
    }
  }

  return {
    id: ind.id,
    name: ind.UnitOfMeasurement || "",
    metricMeasurement: (ind.MeasurementInstance || []).filter((mid) =>
      planMeasIds.has(mid)
    ),
    objective: objId ? [objId] : [],
    objectiveName: obj ? [obj.Name] : [],
    goalName: goal ? [goal.Name] : [],
    orgName: [org.Name || ""],
    orgAcronym: [org.Acronym || ""],
    metricMeasurementCount: ms.length,
    endDate: mostRecent?.EndDate || ind.EndDate || null,
    mostRecentResult: mostRecentResult != null ? [mostRecentResult] : [],
    mostRecentTargetResult: mostRecentTarget != null ? [mostRecentTarget] : [],
    mostRecentTargetDirection: [dir],
    mostRecentTargetLevel: [ms.length],
    mostRecentPercentProgress: percentProgress != null ? [percentProgress] : [],
    mostRecentResultTrend: [resultTrend],
    percentChangeResult: percentChange,
    resultTrendIsImproved: improved ? 1 : 0,
    goal: goalId ? [goalId] : [],
    plan: [PLAN_ID],
    org: [orgId],
    mostRecentTargetResultFormatted: formatNumber(mostRecentTarget),
    mostRecentResultFormatted: formatNumber(mostRecentResult),
    targetDirectionStringInsert: targetDirectionInsert,
    tag: tagIds,
    objectType: "Metric",
    startDate: ms.length > 0 ? ms[0].StartDate : null,
    previousResultTrend: [prevResultTrend],
    previousResultTrendIsImproved: prevImproved ? 1 : 0,
    views: seededRandom(ind.id),
  };
});

// ── Build output: metricResult.json ────────────────────────────────────────
const metricResultOut = [];
for (const ind of planInds) {
  const ms = measByInd[ind.id] || [];
  const dir = deriveTargetDirection(ms);
  const objId = (ind.Objective || [])[0];
  const obj = objById[objId];
  const goalId = obj ? (obj.Goal || [])[0] : null;
  const goal = goalId ? goalById[goalId] : null;

  const mostRecentEnd = ms.length > 0 ? ms[ms.length - 1].EndDate : null;
  const prevToMostRecentEnd = ms.length >= 2 ? ms[ms.length - 2].EndDate : null;

  for (let i = 0; i < ms.length; i++) {
    const m = ms[i];
    const prevM = i > 0 ? ms[i - 1] : null;

    const pp =
      m.TargetResult != null && m.TargetResult !== 0
        ? Math.round((m.ActualResult / m.TargetResult) * 100) / 100
        : null;

    let trendImproved = false;
    let resultTrend = null;
    if (prevM) {
      trendImproved = isImproved(m.ActualResult, prevM.ActualResult, dir);
      if (m.ActualResult > prevM.ActualResult) {
        resultTrend = dir === "Increase" ? "Improved" : "Worsened";
      } else if (m.ActualResult < prevM.ActualResult) {
        resultTrend = dir === "Decrease" ? "Improved" : "Worsened";
      }
    }

    metricResultOut.push({
      id: m.id,
      metric: [ind.id],
      targetResult: m.TargetResult ?? null,
      result: m.ActualResult ?? null,
      fiscalQuarter: toFiscalQuarter(m.EndDate),
      fiscalYear: toFiscalYear(m.EndDate),
      targetDirection: dir,
      resultTrend,
      startDate: m.StartDate || null,
      endDate: m.EndDate || null,
      objectiveName: obj ? [obj.Name] : [],
      goalName: goal ? [goal.Name] : [],
      orgAcronym: [org.Acronym || ""],
      metricName: [ind.UnitOfMeasurement || ""],
      mostRecentEndDate: mostRecentEnd ? [mostRecentEnd] : [],
      isMostRecent: i === ms.length - 1 ? 1 : 0,
      targetLevel: i + 1,
      isPreviousToMostRecent: i === ms.length - 2 ? 1 : 0,
      previousToMostRecentEndDate: prevToMostRecentEnd
        ? [prevToMostRecentEnd]
        : [],
      percentProgress: pp != null ? Math.round(pp * 100) : null,
      resultTrendIsImproved: trendImproved ? 1 : 0,
    });
  }
}

// ── Build output: objective.json ───────────────────────────────────────────
const objectiveOut = planObjs.map((obj) => {
  const goalId = (obj.Goal || [])[0];
  const goal = goalId ? goalById[goalId] : null;
  const inds = indsByObj[obj.id] || [];
  const stats = computeIndicatorStats(inds);

  // Metric improvement counts
  let metricImproved = 0;
  const targetDirs = [];
  for (const ind of inds) {
    const ms = measByInd[ind.id] || [];
    const dir = deriveTargetDirection(ms);
    targetDirs.push(dir);
    if (ms.length >= 2) {
      const recent = ms[ms.length - 1];
      const prev = ms[ms.length - 2];
      if (isImproved(recent.ActualResult, prev.ActualResult, dir)) {
        metricImproved++;
      }
    }
  }

  return {
    id: obj.id,
    name: obj.Name,
    sequence: obj.SequenceIndicator || 0,
    orgName: [org.Name || ""],
    orgAcronym: [org.Acronym || ""],
    goal: goalId ? [goalId] : [],
    plan: [PLAN_ID],
    metric: inds.map((i) => i.id),
    goalName: goal ? [goal.Name] : [],
    goalSequence: goal ? [goal.SequenceIndicator || 0] : [],
    metricCount: inds.length,
    metricResultTrendImprovedCount: metricImproved,
    metricResultTrendImprovedPercent:
      inds.length > 0 ? metricImproved / inds.length : 0,
    metricMostRecentTargetDirection: targetDirs,
    ...stats,
    org: [orgId],
    objectType: "Objective",
  };
});

// ── Build output: tag.json ─────────────────────────────────────────────────
const tagOut = planCats.map((cat) => {
  // Find all metrics (indicators) whose goals are in this category's goals
  const catGoalIds = new Set(cat.Goal || []);
  const catMetrics = [];
  for (const ind of planInds) {
    const objId = (ind.Objective || [])[0];
    const obj = objById[objId];
    const gid = obj ? (obj.Goal || [])[0] : null;
    if (gid && catGoalIds.has(gid)) {
      catMetrics.push(ind.id);
    }
  }

  return {
    id: cat.id,
    name: cat.Name,
    type: ["plain-language"],
    metric: catMetrics,
    goal: (cat.Goal || []).filter((gid) => planGoalIds.has(gid)),
  };
});

// ── Update image.json: add goal/plan links for drug strategy ───────────────
const imageOut = existingImages.map((img) => {
  const copy = { ...img };
  // Link images to drug strategy goals
  for (const [gid, iid] of Object.entries(goalImageMap)) {
    if (img.id === iid) {
      copy.goal = [gid];
    }
  }
  // Link pills image to the plan
  if (img.id === planImageId) {
    copy.strategicPlan = [PLAN_ID];
  }
  return copy;
});

// ── Write output files ────────────────────────────────────────────────────
const write = (name, data) => {
  const path = resolve(dataDir, name);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ ${name}: ${Array.isArray(data) ? data.length : 1} records`);
};

console.log("Generating data for: National Drug Control Strategy\n");

write("plan.json", planOut);
write("goal.json", goalOut);
write("metric.json", metricOut);
write("metricResult.json", metricResultOut);
write("objective.json", objectiveOut);
write("tag.json", tagOut);
write("image.json", imageOut);

console.log("\nDone!");
