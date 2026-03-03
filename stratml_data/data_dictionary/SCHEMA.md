# StratML Data Dictionary Schema

StratML (Strategy Markup Language) is an international data standard (ANSI/AIIM 21:2009, ISO 17469-1) for organizing information in strategic plans and performance reports. It defines a hierarchical XML schema that enables machine-readable expression of strategic goals, objectives, and performance metrics.

This data dictionary base describes the **structure of the StratML schema itself** — what elements exist, how they nest, and what data types they use.

## Hierarchy Levels (L1–L9)

The schema is organized into 9 nesting levels, where higher numbers represent broader/more complex container elements and lower numbers represent atomic fields.

```
L9  PerformancePlanOrReport, StrategicPlan
 └─ L8  StrategicPlanCore
     └─ L7  Goal
         └─ L6  Objective
             └─ L5  PerformanceIndicator
                 └─ L4  Organization, Administration, MeasurementInstance
                     └─ L3  Stakeholder, SWOT, Division, Subdivision,
                     │       AdministrativeInformation, ActualResult, TargetResult
                         └─ L2  Mission, Vision, Values, Category, Descriptor,
                         │       MeasurementInstance, Submitter, PointOfContact,
                         │       ManagementChallenge, Relationship, Role, Person, Avatar, ...
                             └─ L1  Name, Description, Identifier, StartDate, EndDate,
                                     SequenceIndicator, Acronym, WebAddress, UnitOfMeasurement,
                                     MeasurementDimension, OtherInformation, Keyness, ...
```

### Level Descriptions

| Level | Purpose | Examples |
|-------|---------|----------|
| **L9** | Top-level document containers | `StrategicPlan`, `PerformancePlanOrReport` |
| **L8** | Core structural grouping | `StrategicPlanCore` — groups Mission, Vision, Values, Goals, Objectives, Stakeholders |
| **L7** | Broad intended results | `Goal` — spans multiple performance cycles |
| **L6** | Measurable targets | `Objective` — single cycle, measured against indicators |
| **L5** | Measurement constructs | `PerformanceIndicator` — dimension, unit, target/actual results |
| **L4** | Organizational/temporal entities | `Organization`, `Administration`, `MeasurementInstance` |
| **L3** | Composite sub-elements | `Stakeholder`, `SWOT`, `Division`, `Subdivision`, `ActualResult`, `TargetResult` |
| **L2** | Descriptive components | `Mission`, `Vision`, `Category`, `Descriptor`, `Relationship`, `Person` |
| **L1** | Atomic fields (leaf nodes) | `Name`, `Description`, `StartDate`, `EndDate`, `Identifier`, `Acronym`, `Keyness` |

## Key Elements

### StrategicPlan (L9)
The root document element. Contains a `StrategicPlanCore` and optional `AdministrativeInformation`.

### PerformancePlanOrReport (L9)
A document that identifies inputs/processes required to accomplish objectives and establishes metrics for measuring progress within a single budget cycle.

### Goal (L7)
A relatively broad statement of intended results to be achieved over more than one resource allocation and performance measurement cycle. Contains child `Objective` elements.

### Objective (L6)
A target level of results expressed in measurable units within a single resource allocation and performance execution cycle. Contains child `PerformanceIndicator` elements.

### PerformanceIndicator (L5)
A measurement specification including dimension, unit of measurement, and measurement instances with target and actual results. Tracks inputs, outputs, processes, and outcomes.

### MeasurementInstance (L4 / L2)
A measurement at a point in time. Contains `ActualResult` and `TargetResult` with associated dates.

### Organization (L4)
The legal or logical entity to which the plan or report applies. Can contain `Division` and `Subdivision` children.

## Types System

The data dictionary also defines a type system for StratML attributes:

| Type Level | Purpose | Examples |
|------------|---------|----------|
| **Type L1** | Primitive/derived XML types | `string`, `date`, `decimal`, `ID` |
| **Type L2** | Restricted types | `EmptyStringType` |
| **Type L3** | Enumerated/complex types | `StakeholderTypeType`, `ValueChainStageType`, `PerformanceIndicatorTypeType`, `RelationshipTypeType` |

### Notable Enumerations

- **Keyness** (L1): Designates the importance of a performance indicator for top-level monitoring
- **MeasurementDimension** (L1): The aspect of reality being measured
- **StakeholderTypeType** (Type L3): Individual person, organization, or generic group
- **PerformanceIndicatorTypeType** (Type L3): Classifies the type of performance indicator
- **RelationshipTypeType** (Type L3): Categorizes conceptual associations between elements

## Attributes

Named attributes attached to specific elements:

| Attribute | Attached To | Purpose |
|-----------|-------------|---------|
| `@StakeholderTypeType` | `Stakeholder` | Individual, organization, or group |
| `@ValueChainStage` | `PerformanceIndicator` | Position in value chain |
| `@RelationshipType` | `Relationship` | Type of conceptual association |
| `@Type` | `PerformancePlanOrReport` | Document type classification |
| `@PerformanceIndicatorType` | `PerformanceIndicator` | Indicator classification |

## Sources

The schema draws from three XML namespaces:

| Source | Description |
|--------|-------------|
| `stratml` | Core StratML namespace |
| `stratmlext` | StratML extensions |
| `xsd` | XML Schema Definition built-in types |

## Relationship to the USPerformance Base

The companion **StratML USPerformance** base is an _instance_ of this schema populated with actual U.S. federal government strategic plans and performance data. Its tables map to StratML elements:

| USPerformance Table | StratML Element | Level |
|---------------------|-----------------|-------|
| `StrategicPlan` | StrategicPlan | L9 |
| `PerformancePlanOrReport` | PerformancePlanOrReport | L9 |
| `Goal` | Goal | L7 |
| `Objective` | Objective | L6 |
| `PerformanceIndicator` | PerformanceIndicator | L5 |
| `MeasurementInstance` | MeasurementInstance | L4/L2 |
| `Organization` | Organization | L4 |
| `Division` | Division | L3 |
| `Subdivision` | Subdivision | L3 |
| `Administration` | Administration | L4 |
| `Mission` | Mission | L2 |
| `Category` | Category | L2 |
| `Person` | Person | L2 |
| `Media` | Avatar/File | L2/L1 |
| `Program` | _(extension)_ | — |
