export const enum ENodeType {
  "constant" = "constant",
  "variable" = "variable",
  "if" = "if",
  "for" = "for",
  "while" = "while",
  "assign" = "assign",
  "operation" = "operation",
}
export const enum EOperationType {
  function = "func",
  Neg = "!",
  Plus = "+",
  Minus = "-",
  Mul = "*",
  Div = "/",
  Mod = "%",
  Eq = "==",
  EqNot = "!=",
  Lt = "<",
  Gt = ">",
  Lte = "<=",
  Gte = ">=",
  BitShiftLeft = "<<",
  BitShiftRight = ">>",
  BitNeg = "~",
  BitAnd = "&",
  BitXor = "^",
  BitOr = "|",
  And = "&&",
  Or = "||",
}

export type TNode = TNodeStatement;

export type TNodeStatement = TNodeExpression | TNodeStIf | TNodeStWhile | TNodeStFor | TNodeStatement[];
export type TNodeStIf = {
  type: ENodeType.if,
  cond: TNodeExpression,
  then: TNodeStatement,
  el?: TNodeStatement,
};
export type TNodeStWhile = {
  type: ENodeType.while,
  cond: TNodeExpression,
  then: TNodeStatement,
  /** is this`do {} while () ?` */
  condAfter?: true,
};
export type TNodeStFor = {
  type: ENodeType.for,
  then: TNodeStatement,
  pre?: TNodeExpression,
  step?: TNodeExpression,
  cond?: TNodeExpression,
};


export type TNodeExpression = TNodeVariable
  | TNodeConstant | TNodeOperation | TNodeExpressionAssign;
export type TNodeVariable = {
  type: ENodeType.variable,
  name: string,
};



export type TNodeExpressionAssign = {
  type: ENodeType.assign,
  target: TNodeVariable,
  expr: TNodeExpression,
};
export type TNodeOperation = {
  type: ENodeType.operation,
  args: TNodeExpression[],
} & ({
  operation: EOperationType.function,
  fnc: TNodeVariable,
} | {
  operation: Exclude<EOperationType, EOperationType.function>,
});

export type TNodeConstant = {
  type: ENodeType.constant,
  value: boolean | string | number,
};
