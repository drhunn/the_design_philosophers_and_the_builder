/-
The Design Philosophers and the Builder
State machine proof model.

This proves a formal model of the current transition rules.
It does not prove Python, JavaScript, TOML parsing, GitHub, filesystem,
or AnythingLLM runtime behavior.
-/

namespace TheDesignPhilosophers

inductive State where
  | S0 | S1 | S1A | S2 | S3 | S4 | S4A | S5 | S6 | S6B | S6C
  | S7 | S7A | S7B | S7C | S7D | S8 | S9 | S10 | S11 | S12 | S13 | S14 | S15
  deriving DecidableEq, Repr

inductive Event where
  | newRequest | requestIsVague | problemIsClear | prototypeOnly
  | idealModelComplete | newContradictionFound
  | architectureComplete | designGapFound | productConstraintMissing
  | validationObligationsKnown | validationGapFound
  | correctnessObligationsKnown | correctnessGapFound
  | operationalObligationsKnown | operationalGapFound
  | austerityReviewComplete | excessComplexityFound
  | buildPackageComplete | buildPackageIncomplete
  | featureWorktreeWorkflowComplete | featureWorktreeWorkflowFailed
  | featureInventoryMismatch | branchWorktreeMismatch
  | validationMappingFailed | correctnessMappingFailed | operationalMappingFailed
  | taskSlicePlanComplete | taskSlicePlanFailed | noRemainingTaskSlices
  | taskSliceComplete | allTaskSlicesComplete | taskSliceFailed
  | securityReviewComplete | securityReviewFailed
  | patchPlanComplete | patchPlanFailed
  | patchTaskPlanComplete | patchTaskPlanFailed | noRemainingPatchTasks
  | patchTaskComplete | allPatchTasksComplete | patchTaskFailed
  | reductionReviewComplete
  | empiricalReviewPassed | empiricalReviewFailed
  | correctnessReviewPassed | correctnessReviewFailed
  | operationsReviewPassed | operationsReviewFailed
  | admissionGranted | admissionDenied
  deriving DecidableEq, Repr

inductive Guard where
  | buildPackageComplete
  | featureWorktreeWorkflowComplete
  | taskSlicePlanComplete
  | noRemainingTaskSlices
  | taskDocumentationUpdated
  | allTaskSlicesComplete
  | patchTaskPlanComplete
  | noRemainingPatchTasks
  | patchTaskDocumentationUpdated
  | allPatchTasksComplete
  | empiricalReviewPassed
  | correctnessReviewPassed
  | operationsReviewPassed
  | admissionGranted
  deriving DecidableEq, Repr

open State
open Event

structure Transition where
  toState : State
  guard : Option Guard
  deriving Repr

def transition : State -> Event -> Option Transition
  | S0, newRequest => some { toState := S1, guard := none }

  | S1, requestIsVague => some { toState := S1, guard := none }
  | S1, problemIsClear => some { toState := S1A, guard := none }
  | S1, prototypeOnly => some { toState := S15, guard := none }

  | S1A, idealModelComplete => some { toState := S2, guard := none }
  | S1A, newContradictionFound => some { toState := S1, guard := none }

  | S2, architectureComplete => some { toState := S3, guard := none }
  | S2, designGapFound => some { toState := S2, guard := none }
  | S2, productConstraintMissing => some { toState := S1A, guard := none }

  | S3, validationObligationsKnown => some { toState := S4, guard := none }
  | S3, designGapFound => some { toState := S2, guard := none }
  | S3, productConstraintMissing => some { toState := S1A, guard := none }

  | S4, correctnessObligationsKnown => some { toState := S4A, guard := none }
  | S4, designGapFound => some { toState := S2, guard := none }
  | S4, validationGapFound => some { toState := S3, guard := none }

  | S4A, operationalObligationsKnown => some { toState := S5, guard := none }
  | S4A, designGapFound => some { toState := S2, guard := none }
  | S4A, validationGapFound => some { toState := S3, guard := none }
  | S4A, correctnessGapFound => some { toState := S4, guard := none }
  | S4A, productConstraintMissing => some { toState := S1A, guard := none }

  | S5, austerityReviewComplete => some { toState := S6, guard := none }
  | S5, excessComplexityFound => some { toState := S2, guard := none }
  | S5, operationalGapFound => some { toState := S4A, guard := none }

  | S6, buildPackageComplete => some { toState := S6B, guard := some Guard.buildPackageComplete }
  | S6, buildPackageIncomplete => some { toState := S14, guard := none }

  | S6B, featureWorktreeWorkflowComplete => some { toState := S6C, guard := some Guard.featureWorktreeWorkflowComplete }
  | S6B, featureWorktreeWorkflowFailed => some { toState := S14, guard := none }
  | S6B, featureInventoryMismatch => some { toState := S1A, guard := none }
  | S6B, branchWorktreeMismatch => some { toState := S6B, guard := none }
  | S6B, validationMappingFailed => some { toState := S3, guard := none }
  | S6B, correctnessMappingFailed => some { toState := S4, guard := none }
  | S6B, operationalMappingFailed => some { toState := S4A, guard := none }

  | S6C, taskSlicePlanComplete => some { toState := S7, guard := some Guard.taskSlicePlanComplete }
  | S6C, taskSlicePlanFailed => some { toState := S14, guard := none }
  | S6C, noRemainingTaskSlices => some { toState := S7A, guard := some Guard.noRemainingTaskSlices }
  | S6C, branchWorktreeMismatch => some { toState := S6B, guard := none }
  | S6C, validationMappingFailed => some { toState := S3, guard := none }
  | S6C, correctnessMappingFailed => some { toState := S4, guard := none }
  | S6C, operationalMappingFailed => some { toState := S4A, guard := none }

  | S7, taskSliceComplete => some { toState := S6C, guard := some Guard.taskDocumentationUpdated }
  | S7, allTaskSlicesComplete => some { toState := S7A, guard := some Guard.allTaskSlicesComplete }
  | S7, taskSliceFailed => some { toState := S14, guard := none }
  | S7, designGapFound => some { toState := S2, guard := none }
  | S7, validationGapFound => some { toState := S3, guard := none }
  | S7, correctnessGapFound => some { toState := S4, guard := none }
  | S7, operationalGapFound => some { toState := S4A, guard := none }
  | S7, branchWorktreeMismatch => some { toState := S6B, guard := none }

  | S7A, securityReviewComplete => some { toState := S7B, guard := none }
  | S7A, securityReviewFailed => some { toState := S14, guard := none }
  | S7A, designGapFound => some { toState := S2, guard := none }

  | S7B, patchPlanComplete => some { toState := S7C, guard := none }
  | S7B, patchPlanFailed => some { toState := S14, guard := none }

  | S7C, patchTaskPlanComplete => some { toState := S7D, guard := some Guard.patchTaskPlanComplete }
  | S7C, patchTaskPlanFailed => some { toState := S14, guard := none }
  | S7C, noRemainingPatchTasks => some { toState := S8, guard := some Guard.noRemainingPatchTasks }
  | S7C, branchWorktreeMismatch => some { toState := S6B, guard := none }

  | S7D, patchTaskComplete => some { toState := S7C, guard := some Guard.patchTaskDocumentationUpdated }
  | S7D, allPatchTasksComplete => some { toState := S8, guard := some Guard.allPatchTasksComplete }
  | S7D, patchTaskFailed => some { toState := S14, guard := none }
  | S7D, validationGapFound => some { toState := S3, guard := none }
  | S7D, correctnessGapFound => some { toState := S4, guard := none }
  | S7D, operationalGapFound => some { toState := S4A, guard := none }
  | S7D, branchWorktreeMismatch => some { toState := S6B, guard := none }

  | S8, reductionReviewComplete => some { toState := S9, guard := none }
  | S8, excessComplexityFound => some { toState := S14, guard := none }

  | S9, empiricalReviewPassed => some { toState := S10, guard := some Guard.empiricalReviewPassed }
  | S9, empiricalReviewFailed => some { toState := S14, guard := none }

  | S10, correctnessReviewPassed => some { toState := S11, guard := some Guard.correctnessReviewPassed }
  | S10, correctnessReviewFailed => some { toState := S14, guard := none }

  | S11, operationsReviewPassed => some { toState := S12, guard := some Guard.operationsReviewPassed }
  | S11, operationsReviewFailed => some { toState := S14, guard := none }

  | S12, admissionGranted => some { toState := S13, guard := some Guard.admissionGranted }
  | S12, admissionDenied => some { toState := S14, guard := none }

  | S14, newContradictionFound => some { toState := S1, guard := none }
  | S14, productConstraintMissing => some { toState := S1A, guard := none }
  | S14, designGapFound => some { toState := S2, guard := none }
  | S14, validationGapFound => some { toState := S3, guard := none }
  | S14, correctnessGapFound => some { toState := S4, guard := none }
  | S14, operationalGapFound => some { toState := S4A, guard := none }
  | S14, excessComplexityFound => some { toState := S5, guard := none }
  | S14, featureWorktreeWorkflowFailed => some { toState := S6B, guard := none }
  | S14, taskSlicePlanFailed => some { toState := S6C, guard := none }
  | S14, taskSliceFailed => some { toState := S7, guard := none }
  | S14, securityReviewFailed => some { toState := S7A, guard := none }
  | S14, patchPlanFailed => some { toState := S7B, guard := none }
  | S14, patchTaskPlanFailed => some { toState := S7C, guard := none }
  | S14, patchTaskFailed => some { toState := S7D, guard := none }

  | S15, newContradictionFound => some { toState := S1, guard := none }

  | _, _ => none

def guardSatisfied (ctx : Guard -> Bool) : Option Guard -> Bool
  | none => true
  | some g => ctx g

def dispatch (ctx : Guard -> Bool) (s : State) (e : Event) : Option State :=
  match transition s e with
  | none => none
  | some t =>
      if guardSatisfied ctx t.guard then
        some t.toState
      else
        none

def run (ctx : Guard -> Bool) : State -> List Event -> Option State
  | s, [] => some s
  | s, e :: rest =>
      match dispatch ctx s e with
      | none => none
      | some s' => run ctx s' rest

def allGuardsTrue : Guard -> Bool := fun _ => true

def noGuardsTrue : Guard -> Bool := fun _ => false

def happyPath : List Event :=
  [ newRequest,
    problemIsClear,
    idealModelComplete,
    architectureComplete,
    validationObligationsKnown,
    correctnessObligationsKnown,
    operationalObligationsKnown,
    austerityReviewComplete,
    buildPackageComplete,
    featureWorktreeWorkflowComplete,
    taskSlicePlanComplete,
    taskSliceComplete,
    taskSlicePlanComplete,
    allTaskSlicesComplete,
    securityReviewComplete,
    patchPlanComplete,
    patchTaskPlanComplete,
    patchTaskComplete,
    patchTaskPlanComplete,
    allPatchTasksComplete,
    reductionReviewComplete,
    empiricalReviewPassed,
    correctnessReviewPassed,
    operationsReviewPassed,
    admissionGranted ]

theorem happyPath_reaches_accepted :
    run allGuardsTrue S0 happyPath = some S13 := by
  rfl

theorem accepted_is_terminal (ctx : Guard -> Bool) (e : Event) :
    dispatch ctx S13 e = none := by
  cases e <;> rfl

theorem task_complete_transition_is_guarded :
    transition S7 taskSliceComplete =
      some { toState := S6C, guard := some Guard.taskDocumentationUpdated } := by
  rfl

theorem task_complete_rejected_without_documentation :
    dispatch noGuardsTrue S7 taskSliceComplete = none := by
  rfl

theorem task_complete_implies_documentation (ctx : Guard -> Bool) :
    dispatch ctx S7 taskSliceComplete = some S6C ->
    ctx Guard.taskDocumentationUpdated = true := by
  cases h : ctx Guard.taskDocumentationUpdated <;>
    simp [dispatch, transition, guardSatisfied, h]

theorem patch_complete_transition_is_guarded :
    transition S7D patchTaskComplete =
      some { toState := S7C, guard := some Guard.patchTaskDocumentationUpdated } := by
  rfl

theorem patch_complete_rejected_without_documentation :
    dispatch noGuardsTrue S7D patchTaskComplete = none := by
  rfl

theorem patch_complete_implies_documentation (ctx : Guard -> Bool) :
    dispatch ctx S7D patchTaskComplete = some S7C ->
    ctx Guard.patchTaskDocumentationUpdated = true := by
  cases h : ctx Guard.patchTaskDocumentationUpdated <;>
    simp [dispatch, transition, guardSatisfied, h]

theorem no_direct_all_patches_complete_from_patch_planning
    (ctx : Guard -> Bool) :
    dispatch ctx S7B allPatchTasksComplete = none := by
  rfl

theorem patch_task_plan_requires_guard :
    dispatch noGuardsTrue S7C patchTaskPlanComplete = none := by
  rfl

theorem task_slice_plan_requires_guard :
    dispatch noGuardsTrue S6C taskSlicePlanComplete = none := by
  rfl

theorem admission_requires_guard :
    dispatch noGuardsTrue S12 admissionGranted = none := by
  rfl

theorem admission_granted_reaches_accepted :
    dispatch allGuardsTrue S12 admissionGranted = some S13 := by
  rfl

theorem invalid_event_from_initial_state_rejected :
    dispatch allGuardsTrue S0 taskSliceComplete = none := by
  rfl

theorem invalid_event_from_patch_implementation_rejected :
    dispatch allGuardsTrue S7D admissionGranted = none := by
  rfl

end TheDesignPhilosophers
