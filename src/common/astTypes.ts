import { VariantOf, fields, variantModule } from "variant";

const noFields = fields<Record<string, never>>();

export const TopLevelDeclaration = variantModule({
  typeDeclaration: noFields,
  functionDeclaration: fields<{ name: string }>(),
  // TODO - anything else?
});
export type TopLevelDeclaration = VariantOf<typeof TopLevelDeclaration>;

export const Expression = variantModule({
  intLiteral: fields<{ value: bigint }>(),
  fpLiteral: fields<{ value: number }>(),
  boolLiteral: fields<{ value: boolean }>(),
  identifier: fields<{ name: string }>(), // TODO - rename to "variableRef" or similar?
  // TODO - operations, function calls, field accesses, match expressions, etc.
});
export type Expression = VariantOf<typeof Expression>;

export const Statement = variantModule({
  statementExpression: fields<{ expression: Expression }>(),
  ifStatement: fields<{ condition: Expression; thenBlock: Block; elseBlock: Block }>(),
  returnStatement: fields<{ returnedValue?: Expression }>(),
  // TODO - loop statements, variable declaration/assignments, etc.
});
export type Statement = VariantOf<typeof Statement>;

export type Block = Array<Statement>;
