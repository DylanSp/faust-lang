import { Option } from "fp-ts/lib/Option";
import { Newtype } from "newtype-ts";
import { VariantOf, fields, variantModule } from "variant";

export type Identifier = Newtype<{ readonly Identifier: unique symbol }, string>;

const noFields = fields<Record<string, never>>();

export const TopLevelDeclaration = variantModule({
  typeDeclaration: noFields,
  functionDeclaration: fields<{ name: Identifier }>(),
  // TODO - anything else?
});
export type TopLevelDeclaration = VariantOf<typeof TopLevelDeclaration>;

export const Expression = variantModule({
  intLiteral: fields<{ value: bigint }>(),
  fpLiteral: fields<{ value: number }>(),
  boolLiteral: fields<{ value: boolean }>(),
  identifier: fields<{ name: Identifier }>(), // TODO - rename to "variableRef" or similar?
  // TODO - operations, function calls, field accesses, match expressions, etc.
});
export type Expression = VariantOf<typeof Expression>;

export const Statement = variantModule({
  statementExpression: fields<{ expression: Expression }>(),
  variableDeclaration: fields<{ name: Identifier; value: Expression }>(),
  variableAssignment: fields<{ name: Identifier; value: Expression }>(),
  ifStatement: fields<{ condition: Expression; thenBlock: Block; elseBlock: Block }>(),
  returnStatement: fields<{ returnedValue: Option<Expression> }>(),
  // TODO - loop statements, etc.
});
export type Statement = VariantOf<typeof Statement>;

export type Block = Array<Statement>;
