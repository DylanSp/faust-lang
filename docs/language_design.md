# Faust Language Design

## Type System

- 64-bit integers - `int64`
- double-precision floating-point - `fp64`
- Booleans - `bool`
- Strings - `str`. These are required to be ASCII (for ease of implementation), but are treated as an opaque type within Faust, without any sort of underlying `char` type.
- Void/unit type - `void`. Used as the return type for functions that don't return a value.
- Tuples
- Structs
- Enums - algebraic data types that can be pattern-matched on. Individual variants can be empty, have anonymous fields, or be structs. See my discussion on [this Github issue](https://github.com/DylanSp/faust-lang/issues/15).
- Fixed-length arrays (always bound-checked)
- **No** null type (use an Optional ADT instead)
- Structs, tuples, enums, and arrays can all be generic, taking some number of type parameters.

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

- No implicit conversions; built-in functions for casting `int64`'s to `fp64`.
- No overloading functions for ease of implementation.
