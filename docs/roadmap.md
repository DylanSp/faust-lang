# Faust development roadmap

## Stage 1 - Basic language implementation, with interpreter

### Definite goals

- Design basic language syntax/semantics.
- Implement lexer/parser, probably with parser generator (I'm considering https://ohmjs.org/, https://nearley.js.org/, and https://github.com/EoinDavey/tsPEG).
- Implement type system with typechecker - this should definitely include primitive types, structs, algebraic data types w/ pattern matching, tuples.
- Implement interpreter to run Faust programs.
  - This will require a _small_ number of native functions - probably `print()`, `printLine()`, and `readLine()` for I/O, and _possibly_ `parseInt()` and `parseFloat()`.
- Testing strategy - focus on running end-to-end tests on a small corpus of sample Faust programs (both valid and invalid).

### Definite non-goals

- Anything contract-related.

### Possible goals

- The following features will require additional syntax - I'd prefer to hold off on implementing these immediately to keep complexity down, but it would be good to make sure that they can be incorporated into Faust's grammar.
  - Methods on structs, traits/typeclasses/interfaces.
  - Visibility restrictions on struct fields (and possibly methods).
  - Module system.

### Questions to answer

- How do I want to handle strings in Faust?
  - Option 1 - include characters as a primitive type, strings are effectively an array of characters. This maps to C semantics fairly well, which will simplify the compiled implementation, but I don't know if I want to expose characters as a separate type in Faust.
  - Option 2 - include strings as a primitive type, but restrict them to ASCII only. This would allow using basic `libc` functions in the compiled implementation without needing to expose characters as a Faust type.
  - Option 3 - full Unicode support (presumably via UTF-8). This allows the most flexibility, but it also complicates implementation.
- How do I want to handle mutability/immutability of variables, and if mutability is allowed, handling references?
  - I'm sort of inclined to start with an approach of everything being immutable, function arguments are copied (passed by value, effectively), for the sake of simplicity. This might make writing example programs more difficult, though.

## Stage 2 - Compiled implementation using LLVM

### Definite goals

- code generation using LLVM API
- convenience script that takes name of executable to output and single(/list?) of Faust files to compile, then:
  - builds compiler (calls `tsc`)
  - runs compiler (`node dist/main.js`) to compile Faust to LLVM IR
  - runs `llc` to compile LLVM IR to assembly
  - runs `gcc` to compile and link assembly to generate executable.
  - (I may want to put intermediate results in a `faust_build` directory or something, and add that to this project's `.gitignore`)
- project README should describe requirements to run compiler (limited to Ubuntu-based linux distros; need `build-essential` and requirements from https://github.com/ApsarasX/llvm-bindings#install-on-ubuntu)
- automated tests in CI for comparing output of interpreter and compiler implementations of Faust, ensuring they produce the same result on valid Faust programs in test corpus. (These should pass at this stage, but may want to be non-required in subsequent stages, so I can try out implementations in interpreter before adding them to the compiler)

### Definite non-goals

- Adding anything additional to the Faust language itself.

## Stage 3 - Adding basic contract features to interpreted implementation

### Definite goals

- Prototype contract-based features on interpreted implementation only.
- Preconditions and postconditions on functions.
- Inline assertions.
- Labeled predicates - probably implemented as any function that returns `boolean`.

### Definite non-goals

- Implementing contract-based functionality in compiled implementation.

### Possible goals

- Built-in test harness that allows some level of testing of Faust functions to check whether contracts always hold.
  - Definitely unit tests
  - Possibly auto-generated fuzz tests?

### Questions to answer

- What should happen if a contract fails?
  - by default - probably output the failed contract, the values that caused the failure, and the call stack.
  - If test harness for checking contracts is included - probably need to be able to customize contract failure handler, so running tests doesn't crash the whole test program on the first contract failure.

## Stage 4 - Adding basic contract features to compiled implementation

### Definite goals

- Add support for all features added in stage 3 to the compiled implementation.

### Definite non-goals

- Adding additional contract-based functionality.

## Stage 5 - Augumenting the Faust language

### Definite goals

- If not added in stage 1:
  - Methods on structs, including (Rust-style) constructors.
  - Traits/typeclasses/interfaces.
  - Visibility restrictions on struct fields and methods.
  - Module system.
- Adding contract functionality to new features:
  - Struct invariants, similar to [Eiffel's class invariants](https://www.eiffel.org/doc/eiffel/I2E-_Design_by_Contract_and_Assertions)
    - Public invariants - only checked on calling/returning from public methods, accessing/setting public fields.
    - Private invariants - checked on calling/returning from _all_ methods, accessing/setting _all_ fields.
- Implementing all of this functionality in the interpreted implementation.

### Possible goals

- Adding this functionality to the compiled implementation.

## Stage 6 - Further contract-based functionality

### Possible goals

- Inferring tests based on contracts.
- Built-in fuzz tests for contracts (if not already implemented)
  - see https://www.squarefree.com/2014/02/03/fuzzers-love-assertions/
- Incorporating quantifiers and implication in contracts, to easily quantify over multiple elements, i.e. an `isSorted()` predicate can use `forall i, j in 0..len(list) : i < j implies list[i] <= list[j]`
- "Orthogonal" contracts - postcondition A is only checked if precondition A’ was true
  - This comes from https://buttondown.email/hillelwayne/archive/six-programming-languages-id-like-to-see/; I'm not sure what the motivation/use case is.
- Somehow enforcing that predicate functions in contracts are pure.

### Questions to answer

- Is there an easy way to track purity of functions? Potentially, some primitive functions and operators are marked pure, side-effecting native functions are marked impure, and anything that transitively calls an impure function is impure?
