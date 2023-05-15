# Faust Language Design

## Primitive types

- 64-bit integers - `int64`
- double-precision floating-point - `fp64`
- Booleans - `bool`
- Strings - `str`. These are required to be ASCII (for ease of implementation), but are treated as an opaque type within Faust, without any sort of underlying `char` type.
- Tuples
- Structs
- Algebraic data types (that can be pattern-matched on)
- Fixed-length arrays (always bound-checked)
- **No** null type (use an Optional ADT instead)

## Syntax

- Requires semicolons for ease of implementation.
- Allows statements (not purely expression-based) for ease of writing Faust programs to test with.
- Types are always explicit in variable and function definitions, and written after variable name, i.e. `let len: i64`.
- Variables have to be initialized on declaration, i.e. no standalone `let x;` statements.
- `for` loops have several requirements for ease of implementation:
  - They _must_ have a variable declaration in their first clause.
  - They _must_ have an expression in their second clause for use as a condition.
  - They _must_ have either an expression (i.e. `i++`) or a variable assignment (i.e. `i = i + 2`) in their third clause.

## Type system

- No implicit conversions - built-in functions cast `int64`'s to `double`.
- No overloading functions for ease of implementation.
