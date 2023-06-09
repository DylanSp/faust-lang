# Faust Language Design

## Primitive types

- 64-bit integers - `int64`
- double-precision floating-point - `double`/`fp64`
- Booleans
- Strings (see [Roadmap stage 1](https://github.com/DylanSp/faust-lang/blob/main/docs/roadmap.md#questions-to-answer) for options on how to implement)
- Tuples
- Structs
- Algebraic data types (that can be pattern-matched on)
- Fixed-length arrays (always bound-checked)

## Syntax

- Requires semicolons for ease of implementation.
- Allows statements (not purely expression-based) for ease of writing Faust programs to test with.
- Types are always explicit in variable and function definitions, and written after variable name, i.e. `let len: i64`.

## Type system

- No implicit conversions - built-in functions cast `int64`'s to `double`.
- No overloading functions for ease of implementation.
