# Faust Language Design

## Primitive types

- 64-bit integers - `int64`
- double-precision floating-point - `double`/`fp64`
- Booleans
- Strings. These are required to be ASCII (for ease of implementation), but are treated as an opaque type within Faust, without any sort of underlying `char` type.
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

## Type system

- No implicit conversions - built-in functions cast `int64`'s to `double`.
- No overloading functions for ease of implementation.
