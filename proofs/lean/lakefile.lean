import Lake
open Lake DSL

package the_design_philosophers_proofs where
  -- Keep this proof project dependency-free.

lean_lib TheDesignPhilosophers where
  roots := #[`TheDesignPhilosophers.StateMachine]
