# Random notes for my personal use

## Project structure

- three main subfolders under `src`:
  - `common` - lexing/parsing, typechecking
  - `interpreter`
  - `compiler`

## General implementation

- Explore using https://paarthenon.github.io/variant/docs/intro in my implementation as a way to have effective union types in Typescript?

## Compiled implementation

- Write convenience wrappers around the raw LLVM API - see repetitious code in https://github.com/DylanSp/llvm-bindings-test
  - probably write as a TS class that stores an `llvm.LLVMContext`, an `llvm.Module`, and an `llvm.IRBuilder`, then I can write methods on that class for:
    - Easily getting int64 type, double type.
    - Generating constant int64 and double values.
    - Getting a function type based on its return type and parameter types (shouldn't need to ever get a function type with varargs)
    - Writing a function - takes a function type, function name, and a callback, creates an `llvm.Function`, puts a basic block into it and sets the insert point into it, then calls the callback with the `llvm.Function` to generate the function's code.
    - Generating external function definitions for `libc` functions I need to call.
- Probably compile down to my own IR with basic blocks (check if that's what LLVM Kaleidoscope tutorial suggests to do before calling LLVM API), then call the LLVM API to codegen from this
- Once I add contracts, annotate the basic block graph with extra blocks to track pre/post-conditions
- Potentially do optimizations of my own at this point, issue compile errors if an assertion will always be false?

## Contract syntax

- implication should either be a keyword or a different symbol than `=>`, to avoid confusion with other languages' arrow functions
  - Possible alternate symbol: `~>`?
  - Having an `implies` keyword probably makes the most sense.
- Variable names in pre/post-conditions
  - `requires`/`ensures` blocks probably shouldn't repeat argument names, since that's just repetitious
  - `requires` expressions/blocks should have access to the same variable names as in the function definition
  - `ensures` expressions/blocks - if the function returns more than 1 value (a tuple), potentially require names for the returned values in the function definition, which can be referenced in the `ensures` expressions/blocks
  - Potentially have special variables for arguments passed in, returned value(s), the struct at the time the method was called
    - If everything's immutable, _might_ not need these
    - `args`/`old`/`oldThis` would be good if there's mutability, to be able to refer to original values
    - `returned` would be helpful to allow referring to a single returned value
- pre/post-conditions could either allow a single expression or a general block
  - full blocks would be hard to display in a theoretical Faust IDE
  - Potentially require more complex conditions to be abstracted into a named predicate function, which can be called as an expression
  - Probably want to allow easily listing multiple conditions without a full code block. Example from Midori:

```
public virtual int Read(char[] buffer, int index, int count)
    requires buffer != null
    requires index >= 0
    requires count >= 0
    requires buffer.Length - index >= count
{
    // Implementation
}
```

Potential Faust syntax, allowing a block for `ensures`, using `args` and `returned` structs to capture relevant values:

```
function divMod (x int, y int) -> (div int, mod int)
ensures
{
  args.y * returned.div + returned.mod == args.x
}
def
{
  // implementation
}
```

## Implementing quantifiers

- Potentially have traits/typeclasses/interfaces for quantification - `UniversallyQuantifiable` has an `.all()` method, `ExistentiallyQuantifiable` has an `.any()` method
- Quantifiers could be syntactic sugar, i.e.

```
isSorted(list):
  forall i, j in 0..len(list):
    i < j implies list[l] <= list[j]
```

gets desugared to something like:

```
let indexes = 0..len(list)

// this step can invoke as many crossProduct() calls as necessary to get a list of all possible quantified-over variables
indexTuples = crossProduct(indexes, indexes)

return indexTuples.all((i, j) => i < j implies list[i] <= list[j])
```
