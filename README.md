# Faust

An experimental programming language for exploring contract-based design. This is also a toy project so I can learn how to implement a simple static type system and use LLVM for compiling a language to native code.

## Branch naming

- The primary branch for each stage of development is named `stages/[stage number]`, i.e. `stages/1`. This is branched off of `main`, and will be merged back into `main` once the work for that stage is complete.
- "Feature" branches are named `stage[stage number]/[feature name]`, i.e. `stage1/ast-types`. These branch off of the primary stage branch, and will be merged back into the stage branch.
