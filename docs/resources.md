# Resources

## Parsing

### Using Ohm

https://ohmjs.org/editor/

- https://nextjournal.com/dubroy/ohm-parsing-made-easy
- https://ohmjs.org/docs/intro
- https://ohmjs.org/docs/typescript
- https://ohmjs.org/docs/patterns-and-pitfalls

## Prior art for contracts

- [Eiffel](https://www.eiffel.org/) is the giant in this field.
- Joe Duffy's [blog posts about Microsoft's Midori project](http://joeduffyblog.com/2015/11/03/blogging-about-midori/); [The Error Model](http://joeduffyblog.com/2016/02/07/the-error-model/) is the post that goes into detail about their contract-based system.
- Hillel Wayne has several posts about contract-based languages:
  - [Ideas about a modern contract-based language](https://buttondown.email/hillelwayne/archive/six-programming-languages-id-like-to-see/) is a source of inspiration, especially for adding quantifiers and integrating with tooling.
  - [Introduction to Contract Programming](https://www.hillelwayne.com/post/contracts/) summarizes contracts and references existing languages/libraries which use contract-based ideas.
  - [Property Tests + Contracts = Integration Tests](https://www.hillelwayne.com/post/pbt-contracts/) presents some ideas for testing that contracts are followed.

### Demonstrating contract usage

- Midori, as linked above.
- Examples using predicate logic with quantifiers - https://buttondown.email/hillelwayne/archive/predicate-logic-for-programmers-status-report/.

## Implementation

- https://github.com/DylanSp/llvm-bindings-test is a simple test project I created to try out the [llvm-bindings](https://github.com/ApsarasX/llvm-bindings) library.
- Implementing first-class functions/closures:
  - "closure conversion", i.e. https://www.cs.cornell.edu/courses/cs4120/2018sp/lectures/34functional/lec34-sp18.pdf?1524858547
  - https://www.reddit.com/r/ProgrammingLanguages/comments/be2m02/closures_when_variables_are_stored_on_a_stack/
