import { Option } from "fp-ts/lib/Option";
import { Newtype, iso } from "newtype-ts";
import { TypeNames, Variant, VariantOf, fields, pass, typedVariant, variantList, variantModule } from "variant";

// identifies names of variables and functions
export type ValueIdentifier = Newtype<{ readonly Identifier: unique symbol }, string>;
export const valueIdentifierIso = iso<ValueIdentifier>();

// identifies names of Faust types
export type TypeIdentifier = Newtype<{ readonly TypeIdentifier: unique symbol }, string>;
export const typeIdentifierIso = iso<TypeIdentifier>();
// TODO - does this include field names, or should there be another newtype for those?

type FunctionParameterDeclaration = {
  name: ValueIdentifier;
  type: TypeIdentifier;
};

export const TopLevelDeclaration = variantModule({
  TypeDeclaration: fields<{ name: TypeIdentifier }>(), // TODO - fields
  FunctionDeclaration: fields<{
    name: TypeIdentifier;
    arguments: Array<FunctionParameterDeclaration>;
    returnType: TypeIdentifier;
    body: Block;
  }>(),
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
  | Variant<"BinaryOperation", { operation: BinaryOperation; leftOperand: Expression; rightOperand: Expression }>
  | Variant<"GetStructField", { struct: Expression; fieldName: TypeIdentifier }>
  | Variant<"FunctionCall", { functionName: ValueIdentifier; arguments: Array<Expression> }>;
export const Expression = typedVariant<Expression>({
  IntLiteral: pass,
  FpLiteral: pass,
  BoolLiteral: pass,
  StringLiteral: pass,
  VariableRef: pass,
  UnaryOperation: pass,
  BinaryOperation: pass,
  GetStructField: pass,
  FunctionCall: pass,
});
// NOTE - no lambdas (due to the lack of higher-order functions) currently

// TODO - figure out what this type should actually be; it needs to be able to match variant names and destructure tuples/structs
type Matcher = unknown;

type MatchClause = {
  matcher: Matcher;
  body: Block;
};

// statements with no syntactic sugar, that can't be simplified further
export const UnsugaredStatement = variantModule({
  StatementExpression: fields<{ expression: Expression }>(),
  VariableDeclaration: fields<{ name: ValueIdentifier; faustType: TypeIdentifier; value: Expression }>(),
  VariableAssignment: fields<{ name: ValueIdentifier; value: Expression }>(),
  IfStatement: fields<{ condition: Expression; thenBlock: Block; elseBlock: Option<Block> }>(),
  ReturnStatement: fields<{ returnedValue: Option<Expression> }>(),
  WhileLoop: fields<{ condition: Expression; body: Block }>(),
  SetStructField: fields<{ struct: Expression; fieldName: TypeIdentifier; value: Expression }>(),
  Match: fields<{ argument: Expression; clauses: Array<MatchClause> }>(),
});

// use full type definition so I can pull out specific types for use in the forLoop type definition
// see https://paarthenon.github.io/variant/docs/articles/that-type/
export type UnsugaredStatement<T extends TypeNames<typeof UnsugaredStatement> = undefined> = VariantOf<
  typeof UnsugaredStatement,
  T
>;

// statements with syntactic sugar, that can be simplified to UnsugaredStatements
export const SugaredStatement = variantModule({
  DoWhileLoop: fields<{ condition: Expression; body: Block }>(),
  ForLoop: fields<{
    initializer: UnsugaredStatement<"VariableDeclaration">;
    condition: Expression;
    // to figure out what type increment is, use if (isOfType(forLoopStatement.increment, Expression))
    increment: Expression | UnsugaredStatement<"VariableAssignment">;
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
