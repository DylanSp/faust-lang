import { Option } from "fp-ts/lib/Option";
import { Newtype } from "newtype-ts";
import { VariantOf, fields, variantModule } from "variant";

export type Identifier = Newtype<{ readonly Identifier: unique symbol }, string>;

const noFields = fields<Record<string, never>>();

export const TopLevelDeclaration = variantModule({
  typeDeclaration: noFields,
  functionDeclaration: fields<{ name: Identifier }>(), // TODO - other fields
  // TODO - anything else?
});
export type TopLevelDeclaration = VariantOf<typeof TopLevelDeclaration>;

export const Expression = variantModule({
  intLiteral: fields<{ value: bigint }>(),
  fpLiteral: fields<{ value: number }>(),
  boolLiteral: fields<{ value: boolean }>(),
  // TODO - string literal, depending on how I end up designing that?
  identifier: fields<{ name: Identifier }>(), // TODO - rename to "variableRef" or similar?
  // TODO - unary operations, binary operations, function calls, field accesses, match expressions
  // NOTE - no lambdas (no higher-order functions) currently
});
export type Expression = VariantOf<typeof Expression>;

export const Statement = variantModule({
  statementExpression: fields<{ expression: Expression }>(),
  variableDeclaration: fields<{ name: Identifier; value: Expression }>(),
  variableAssignment: fields<{ name: Identifier; value: Expression }>(),
  ifStatement: fields<{ condition: Expression; thenBlock: Block; elseBlock: Option<Block> }>(),
  returnStatement: fields<{ returnedValue: Option<Expression> }>(),
  whileLoop: fields<{ condition: Expression; body: Block }>(),
  doWhileLoop: fields<{ condition: Expression; body: Block }>(),
  forLoop: fields<{ initializer: Expression; condition: Expression; increment: Expression; body: Block }>,
  // TODO - struct field setting
});
export type Statement = VariantOf<typeof Statement>;

export type Block = Array<Statement>;
