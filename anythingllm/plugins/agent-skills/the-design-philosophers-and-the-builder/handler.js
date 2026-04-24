const STATE = {
  S0: "S0_INTAKE",
  S1: "S1_PROBLEM_EXAMINATION",
  S1A: "S1A_SCOPED_IDEAL_MODEL",
  S2: "S2_STRUCTURAL_DESIGN",
  S3: "S3_PRE_BUILD_VALIDATION_ARCHITECTURE",
  S4: "S4_PRE_BUILD_CORRECTNESS_SPECIFICATION",
  S4A: "S4A_PRE_BUILD_OPERATIONAL_RESILIENCE_SPECIFICATION",
  S5: "S5_PRE_BUILD_AUSTERITY_REVIEW",
  S6: "S6_BUILD_READY",
  S6A: "S6A_BUILDER_SLICE_PLANNING",
  S7: "S7_IMPLEMENTATION",
  S8: "S8_POST_BUILD_REDUCTION_REVIEW",
  S9: "S9_POST_BUILD_EMPIRICAL_REVIEW",
  S10: "S10_POST_BUILD_CORRECTNESS_REVIEW",
  S11: "S11_POST_BUILD_OPERATIONAL_RESILIENCE_REVIEW",
  S12: "S12_ADMISSION_DECISION",
  S13: "S13_ACCEPTED",
  S14: "S14_REWORK",
  S15: "S15_EXPLORATORY",
};

const ACTION = {
  RUN_SOCRATES: "run_socrates",
  RUN_PLATO: "run_plato",
  RUN_ARISTOTLE: "run_aristotle",
  RUN_BACON_PREBUILD: "run_bacon_prebuild",
  RUN_HOARE_PREBUILD: "run_hoare_prebuild",
  RUN_EPICTETUS_PREBUILD: "run_epictetus_prebuild",
  RUN_DIOGENES_PREBUILD: "run_diogenes_prebuild",
  CHECK_BUILD_PACKAGE: "check_build_package",
  RUN_BUILDER_SLICE_PLANNING: "run_builder_slice_planning",
  RUN_BUILDER_IMPLEMENTATION: "run_builder_implementation",
  RUN_DIOGENES_POSTBUILD: "run_diogenes_postbuild",
  RUN_BACON_POSTBUILD: "run_bacon_postbuild",
  RUN_HOARE_POSTBUILD: "run_hoare_postbuild",
  RUN_EPICTETUS_POSTBUILD: "run_epictetus_postbuild",
  MAKE_ADMISSION_DECISION: "make_admission_decision",
  ACCEPT_FEATURE: "accept_feature",
  REQUIRE_POSTMORTEM: "require_postmortem",
  ALLOW_PROTOTYPE: "allow_prototype",
  MARK_EXPLORATORY_ONLY: "mark_exploratory_only",
  RETURN_TO_SOCRATES: "return_to_socrates",
  RETURN_TO_PLATO: "return_to_plato",
  RETURN_TO_ARISTOTLE: "return_to_aristotle",
  RETURN_TO_BACON_PREBUILD: "return_to_bacon_prebuild",
  RETURN_TO_HOARE_PREBUILD: "return_to_hoare_prebuild",
  RETURN_TO_EPICTETUS_PREBUILD: "return_to_epictetus_prebuild",
  RETURN_TO_BUILDER: "return_to_builder",
  RETURN_TO_SLICE_PLANNING: "return_to_slice_planning",
};

function transition(nextState, actions = [], guard = null) {
  return { nextState, actions, guard };
}

const TABLE = {
  [STATE.S0]: {
    new_request: transition(STATE.S1, [ACTION.RUN_SOCRATES]),
  },
  [STATE.S1]: {
    request_is_vague: transition(STATE.S1, [ACTION.RUN_SOCRATES]),
    problem_is_clear: transition(STATE.S1A, [ACTION.RUN_PLATO]),
    prototype_only: transition(STATE.S15, [ACTION.ALLOW_PROTOTYPE, ACTION.MARK_EXPLORATORY_ONLY]),
  },
  [STATE.S1A]: {
    ideal_model_complete: transition(STATE.S2, [ACTION.RUN_ARISTOTLE]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
    excess_complexity_found: transition(STATE.S1A, [ACTION.RUN_PLATO]),
  },
  [STATE.S2]: {
    architecture_complete: transition(STATE.S3, [ACTION.RUN_BACON_PREBUILD]),
    design_gap_found: transition(STATE.S2, [ACTION.RUN_ARISTOTLE]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
  },
  [STATE.S3]: {
    validation_obligations_known: transition(STATE.S4, [ACTION.RUN_HOARE_PREBUILD]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
  },
  [STATE.S4]: {
    correctness_obligations_known: transition(STATE.S4A, [ACTION.RUN_EPICTETUS_PREBUILD]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE]),
    validation_gap_found: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
  },
  [STATE.S4A]: {
    operational_obligations_known: transition(STATE.S5, [ACTION.RUN_DIOGENES_PREBUILD]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE]),
    validation_gap_found: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD]),
    correctness_gap_found: transition(STATE.S4, [ACTION.RETURN_TO_HOARE_PREBUILD]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO]),
  },
  [STATE.S5]: {
    austerity_review_complete: transition(STATE.S6, [ACTION.CHECK_BUILD_PACKAGE]),
    excess_complexity_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO]),
    operational_gap_found: transition(STATE.S4A, [ACTION.RETURN_TO_EPICTETUS_PREBUILD]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
  },
  [STATE.S6]: {
    build_package_complete: transition(STATE.S6A, [ACTION.RUN_BUILDER_SLICE_PLANNING], "build_package_complete"),
    build_package_incomplete: transition(STATE.S14, [ACTION.REQUIRE_POSTMORTEM]),
    prototype_only: transition(STATE.S15, [ACTION.ALLOW_PROTOTYPE, ACTION.MARK_EXPLORATORY_ONLY]),
  },
  [STATE.S6A]: {
    slice_plan_complete: transition(STATE.S7, [ACTION.RUN_BUILDER_IMPLEMENTATION], "slice_plan_complete"),
    slice_plan_failed: transition(STATE.S14, [ACTION.RETURN_TO_SLICE_PLANNING, ACTION.REQUIRE_POSTMORTEM]),
    feature_inventory_mismatch: transition(STATE.S1A, [ACTION.RETURN_TO_PLATO, ACTION.REQUIRE_POSTMORTEM]),
    validation_mapping_failed: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    correctness_mapping_failed: transition(STATE.S4, [ACTION.RETURN_TO_HOARE_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    operational_mapping_failed: transition(STATE.S4A, [ACTION.RETURN_TO_EPICTETUS_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S7]: {
    implementation_complete: transition(STATE.S8, [ACTION.RUN_DIOGENES_POSTBUILD]),
    slice_failed: transition(STATE.S14, [ACTION.RETURN_TO_BUILDER, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE, ACTION.REQUIRE_POSTMORTEM]),
    validation_gap_found: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    correctness_gap_found: transition(STATE.S4, [ACTION.RETURN_TO_HOARE_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    operational_gap_found: transition(STATE.S4A, [ACTION.RETURN_TO_EPICTETUS_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S8]: {
    reduction_review_complete: transition(STATE.S9, [ACTION.RUN_BACON_POSTBUILD]),
    excess_complexity_found: transition(STATE.S14, [ACTION.RETURN_TO_BUILDER, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S9]: {
    empirical_review_passed: transition(STATE.S10, [ACTION.RUN_HOARE_POSTBUILD], "empirical_review_passed"),
    empirical_review_failed: transition(STATE.S14, [ACTION.RETURN_TO_BUILDER, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S10]: {
    correctness_review_passed: transition(STATE.S11, [ACTION.RUN_EPICTETUS_POSTBUILD], "correctness_review_passed"),
    correctness_review_failed: transition(STATE.S14, [ACTION.RETURN_TO_BUILDER, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S4, [ACTION.RETURN_TO_HOARE_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S11]: {
    operations_review_passed: transition(STATE.S12, [ACTION.MAKE_ADMISSION_DECISION], "operations_review_passed"),
    operations_review_failed: transition(STATE.S14, [ACTION.RETURN_TO_BUILDER, ACTION.REQUIRE_POSTMORTEM]),
    design_gap_found: transition(STATE.S2, [ACTION.RETURN_TO_ARISTOTLE, ACTION.REQUIRE_POSTMORTEM]),
    validation_gap_found: transition(STATE.S3, [ACTION.RETURN_TO_BACON_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
    correctness_gap_found: transition(STATE.S4, [ACTION.RETURN_TO_HOARE_PREBUILD, ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S12]: {
    admission_granted: transition(STATE.S13, [ACTION.ACCEPT_FEATURE], "admission_granted"),
    admission_denied: transition(STATE.S14, [ACTION.REQUIRE_POSTMORTEM]),
  },
  [STATE.S13]: {},
  [STATE.S14]: {
    new_contradiction_found: transition(STATE.S1, [ACTION.RUN_SOCRATES]),
    product_constraint_missing: transition(STATE.S1A, [ACTION.RUN_PLATO]),
    design_gap_found: transition(STATE.S2, [ACTION.RUN_ARISTOTLE]),
    validation_gap_found: transition(STATE.S3, [ACTION.RUN_BACON_PREBUILD]),
    correctness_gap_found: transition(STATE.S4, [ACTION.RUN_HOARE_PREBUILD]),
    operational_gap_found: transition(STATE.S4A, [ACTION.RUN_EPICTETUS_PREBUILD]),
    excess_complexity_found: transition(STATE.S5, [ACTION.RUN_DIOGENES_PREBUILD]),
    slice_plan_failed: transition(STATE.S6A, [ACTION.RUN_BUILDER_SLICE_PLANNING]),
    slice_failed: transition(STATE.S7, [ACTION.RUN_BUILDER_IMPLEMENTATION]),
  },
  [STATE.S15]: {
    architecture_complete: transition(STATE.S2, [ACTION.RUN_ARISTOTLE]),
    implementation_complete: transition(STATE.S8, [ACTION.RUN_DIOGENES_POSTBUILD]),
    new_contradiction_found: transition(STATE.S1, [ACTION.RETURN_TO_SOCRATES]),
  },
};

function parseContext(contextJson) {
  if (!contextJson) return {};
  if (typeof contextJson === "object") return contextJson;
  try {
    return JSON.parse(contextJson);
  } catch (_err) {
    return {};
  }
}

function availableEvents(state) {
  return Object.keys(TABLE[state] || {}).sort();
}

function dispatch(state, event, context = {}) {
  const transitions = TABLE[state];
  if (!transitions) {
    return { ok: false, error: `No transitions defined for state: ${state}` };
  }
  const t = transitions[event];
  if (!t) {
    return {
      ok: false,
      error: `Invalid event '${event}' in state '${state}'.`,
      allowed_events: availableEvents(state),
    };
  }
  if (t.guard && context[t.guard] !== true) {
    return {
      ok: false,
      error: `Required context flag not satisfied: ${t.guard}`,
      required_context_flag: t.guard,
    };
  }
  return {
    ok: true,
    from_state: state,
    event,
    to_state: t.nextState,
    actions: t.actions,
    timestamp: new Date().toISOString(),
  };
}

function handoffTemplate() {
  return `artifact_id = ""
state = ""
agent = ""
emitted_event = ""
next_state = ""

[bounded_input]
references = []
summary = ""

[scope_boundary]
summary = ""
allowed = []
forbidden = []

[findings]
summary = ""

[decisions]
summary = ""
items = []

[assumptions]
items = []

[unresolved_issues]
items = []
blocking = false

[markdown_links]
reports = []
rationale = []
postmortems = []
`;
}

function describe() {
  return {
    name: "The Design Philosophers and the Builder",
    purpose: "A bounded Mealy-style workflow for designing software from scratch without agent drift, user drift, silent scope expansion, or lump-build implementation.",
    chain: [
      "Socrates bounds the real problem",
      "Plato defines the scoped ideal and hard product constraints",
      "Aristotle derives structure",
      "Bacon defines proof",
      "Hoare defines correctness",
      "Epictetus defines failure discipline",
      "Diogenes cuts excess",
      "Builder 1986 slices and implements incrementally",
      "Post-build Diogenes, Bacon, Hoare, and Epictetus verify the result",
      "Parent admits only if the state machine held",
    ],
  };
}

function routingGuidance(userInput = "") {
  return {
    user_input: userInput,
    guidance: [
      "If it changes the real problem, route to Socrates.",
      "If it changes ideal form, value, platform, deployment, integration, trust model, data ownership, scale, or v1 boundary, route to Plato.",
      "If it changes structure, route to Aristotle.",
      "If it changes evidence or validation, route to Bacon.",
      "If it changes invariants or correctness, route to Hoare.",
      "If it changes failure behavior or operational tolerance, route to Epictetus.",
      "If it adds complexity without traceable value, route to Diogenes.",
      "If it changes implementation inside an approved slice, route to Builder.",
    ],
    note: "This function provides routing guidance only. The calling agent must classify against the current bounded artifact.",
  };
}

function builderConstraint() {
  return {
    constraint: "Builder is not allowed to build the whole design as a lump.",
    required_behavior: [
      "slice it",
      "cost it",
      "order it",
      "implement incrementally",
      "validate each slice against Bacon",
      "check each slice against Hoare",
      "preserve operational obligations from Epictetus",
      "respect Diogenes' cuts",
      "route backward when a slice exposes a bounded-artifact failure",
    ],
  };
}

function happyPath() {
  return [
    "new_request",
    "problem_is_clear",
    "ideal_model_complete",
    "architecture_complete",
    "validation_obligations_known",
    "correctness_obligations_known",
    "operational_obligations_known",
    "austerity_review_complete",
    "build_package_complete",
    "slice_plan_complete",
    "implementation_complete",
    "reduction_review_complete",
    "empirical_review_passed",
    "correctness_review_passed",
    "operations_review_passed",
    "admission_granted",
  ];
}

module.exports.runtime = {
  handler: async function ({ operation, state, event, context_json, user_input }) {
    const op = operation || "describe";
    const context = parseContext(context_json);

    if (op === "describe") return JSON.stringify(describe(), null, 2);
    if (op === "available_events") return JSON.stringify({ state, available_events: availableEvents(state) }, null, 2);
    if (op === "dispatch") return JSON.stringify(dispatch(state, event, context), null, 2);
    if (op === "happy_path") return JSON.stringify({ events: happyPath() }, null, 2);
    if (op === "handoff_template") return handoffTemplate();
    if (op === "routing_guidance") return JSON.stringify(routingGuidance(user_input), null, 2);
    if (op === "builder_constraint") return JSON.stringify(builderConstraint(), null, 2);

    return JSON.stringify({ ok: false, error: `Unknown operation: ${op}` }, null, 2);
  },
};
