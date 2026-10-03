# AGL Measurement Unit

A **Measurement Unit** is the smallest explicitly defined quantity used to quantify a service or execution.

`SERVICE → MEASUREMENT UNIT → EXECUTION → EVIDENCE → AGGREGATE → ECONOMIC METRIC`

## Required semantics

A unit has a stable `unit_id`, precise counting rule, quantity, physical/logical unit, measurement method, scope and period, execution references and evidence references.

## ABOS example

`aircraft_verification`

Counting rule: one completed governed aircraft-verification execution that reaches its defined terminal state.

`Volume(T) = number of completed aircraft_verification units in T`

The same unit can support operational, capacity, cost and commercial calculations.

## Economic layer

`cost_per_unit = attributable_cost / measured_volume`

`value_per_unit = attributed_value / measured_volume`

`price_per_unit = charged_amount / measured_volume`

Numerator and denominator MUST have the same defined scope. Calculations MUST be reproducible from source measurements and evidence.

AGL does not determine what a service should cost or what price should be charged. It provides the measurement and evidence basis for those calculations.
