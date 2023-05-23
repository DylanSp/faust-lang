import { Option } from "fp-ts/lib/Option";
import { Newtype, iso } from "newtype-ts";
import { TypeNames, Variant, VariantOf, fields, pass, typedVariant, variantList, variantModule } from "variant";

// identifies names of variables and functions
export type ValueIdentifier = Newtype<{ readonly Identifier: unique symbol }, string>;
export const valueIdentifierIso = iso<ValueIdentifier>();

// identifies names of Faust types
export type TypeIdentifier = Newtype<{ readonly TypeIdentifier: unique symbol }, string>;
export const typeIdentifierIso = iso<TypeIdentifier>();

export const TopLevelDeclaration = variantModule({
  typeDeclaration: fields<{ name: TypeIdentifier }>(), // TODO - fields
  functionDeclaration: fields<{ name: ValueIdentifier }>(), // TODO - other fields
  // TODO - anything else?
});
export type TopLevelDeclaration = VariantOf<typeof TopLevelDeclaration>;

export const UnaryOperation = variantList(["LogicalNot", "ArithmeticNegation"]);
export type UnaryOperation = VariantOf<typeof UnaryOperation>;

const ArithmeticBinaryOperation = variantList(["Addition", "Subtraction", "Multiplication", "Division"]);
const LogicalBinaryOperation = variantList(["And", "Or"]);
const RelationalBinaryOperation = variantList([
  "Equal",
  "NotEqual",
  "LessThan",
  "LessThanOrEqual",
  "GreaterThan",
  "GreaterThanOrEqual",
]);
export const BinaryOperation = {
  ...ArithmeticBinaryOperation,
  ...LogicalBinaryOperation,
  ...RelationalBinaryOperation,
};
export type BinaryOperation = VariantOf<typeof BinaryOperation>;

// need to use type-first approach to allow a recursive variant;
// see https://paarthenon.github.io/variant/docs/use/advanced-creation#typedvariantt
export type Expression =
  | Variant<"IntLiteral", { value: bigint }>
  | Variant<"FpLiteral", { value: number }>
  | Variant<"BoolLiteral", { value: boolean }>
  | Variant<"StringLiteral", { value: string }>
  | Variant<"VariableRef", { name: ValueIdentifier }>
  | Variant<"UnaryOperation", { operation: UnaryOperation; operand: Expression }>
  | Variant<"BinaryOperation", { operation: BinaryOperation; leftOperand: Expression; rightOperand: Expression }>;
export const Expression = typedVariant<Expression>({
  IntLiteral: pass,
  FpLiteral: pass,
  BoolLiteral: pass,
  StringLiteral: pass,
  VariableRef: pass,
  UnaryOperation: pass,
  BinaryOperation: pass,
});
// TODO - function calls, field accesses, match expressions
// NOTE - no lambdas (no higher-order functions) currently

// statements with no syntactic sugar, that can't be simplified further
export const UnsugaredStatement = variantModule({
  statementExpression: fields<{ expression: Expression }>(),
  variableDeclaration: fields<{ name: ValueIdentifier; faustType: TypeIdentifier; value: Expression }>(),
  variableAssignment: fields<{ name: ValueIdentifier; value: Expression }>(),
  ifStatement: fields<{ condition: Expression; thenBlock: Block; elseBlock: Option<Block> }>(),
  returnStatement: fields<{ returnedValue: Option<Expression> }>(),
  whileLoop: fields<{ condition: Expression; body: Block }>(),
  // TODO - struct field setting
});

// use full type definition so I can pull out specific types for use in the forLoop type definition
// see https://paarthenon.github.io/variant/docs/articles/that-type/
export type UnsugaredStatement<T extends TypeNames<typeof UnsugaredStatement> = undefined> = VariantOf<
  typeof UnsugaredStatement,
  T
>;

// statements with syntactic sugar, that can be simplified to UnsugaredStatements
export const SugaredStatement = variantModule({
  doWhileLoop: fields<{ condition: Expression; body: Block }>(),
  forLoop: fields<{
    initializer: UnsugaredStatement<"variableDeclaration">;
    condition: Expression;
    // to figure out what type increment is, use if (isOfType(forLoopStatement.increment, Expression))
    increment: Expression | UnsugaredStatement<"variableAssignment">;
    body: Block;
  }>(),
});
export type SugaredStatement = VariantOf<typeof SugaredStatement>;

export const Statement = {
  ...UnsugaredStatement,
  ...SugaredStatement,
};
export type Statement = VariantOf<typeof Statement>;

export type Block = Array<Statement>;
