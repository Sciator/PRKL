import {
  TNode, TNodeExpression, TNodeVariable, ENodeType,
  EOperationType, TNodeStFor, TNodeStWhile, TNodeExpressionAssign, TNodeConstant, TNodeStIf, TNodeOperation
} from "./ExecutionTree";
import { readIntSync, formatString } from "./common";
import { isBoolean } from "util";

export class Interpreter {

  private evalFor(node: TNodeStFor) {
    let res: any;
    for (this.eval(node.pre);
      node.cond ? this.eval(node.cond) : true;
      this.eval(node.step)) {
      res = this.eval(node.then);
    }
    return res;
  }

  private evalWhile(node: TNodeStWhile) {
    let res: any;
    if (!node.condAfter)
      while (this.eval(node.cond)) {
        res = this.eval(node.then);
      }
    else
      do {
        res = this.eval(node.then);
      } while (this.eval(node.cond));
    return res;
  }

  private evalIf(node: TNodeStIf) {
    const res = this.eval(node.cond);
    if (res)
      return this.eval(node.then);
    return this.eval(node.el);
  }

  private evalAssign(node: TNodeExpressionAssign) {
    const exprRes = this.eval(node.expr);
    this.context[node.target.name] = exprRes;
    return exprRes;
  }

  private evalConstant(node: TNodeConstant) {
    if (typeof node.value === "string")
      return unescape(node.value).split("\\n").join("\n");
    if (typeof node.value === "boolean")
      return node.value && 1 || 0;
    return node.value;
  }

  private evalVariable(node: TNodeVariable): number | ((...args: TNodeExpression[]) => number) {
    return this.context[node.name] || 0;
  }

  private evalOperation(node: TNodeOperation) {
    if (node.operation === EOperationType.function) {
      const fnc = this.evalVariable(node.fnc);
      if (typeof fnc !== "function")
        throw new Error(`given argument is not function name:${JSON.stringify(node.fnc)}`);
      // function will eval arguments by itself
      return fnc(...node.args);
    } else {
      const fnc = getFucntionFromOperator(node.operation);
      const res = fnc(...node.args.map(x => this.eval(x)));
      return isBoolean(res) ? res && 1 || 0 : res;
    }
  }

  private eval(node: TNode): any {
    if (!node)
      return;
    if (Array.isArray(node)) {
      return node.map(x => this.eval(x));
    } else
      switch (node.type) {
        case ENodeType.assign:
          return this.evalAssign(node);
        case ENodeType.constant:
          return this.evalConstant(node);
        case ENodeType.for:
          return this.evalFor(node);
        case ENodeType.if:
          return this.evalIf(node);
        case ENodeType.operation:
          return this.evalOperation(node);
        case ENodeType.variable:
          return this.evalVariable(node);
        case ENodeType.while:
          return this.evalWhile(node);
        default:
          throw Error(`invalid node type ${(node || {} as any).type}`);
      }
  }

  private readonly context = {
    print: (strËxpr: TNodeExpression, ...otherArgs: TNodeExpression[]) => {
      const otherArgsRes = this.eval(otherArgs);
      const str = this.eval(strËxpr);
      const fomrated = formatString(str, otherArgsRes);
      process.stdout.write(fomrated);
    },
    scan: (varName: TNodeVariable) => {
      return this.eval({
        type: ENodeType.assign,
        expr: {
          type: ENodeType.operation,
          operation: EOperationType.function,
          args: [],
          fnc: {
            type: ENodeType.variable,
            name: "$scan",
          },
        },
        target: varName,
      });
    },
    $scan: () => {
      return readIntSync();
    },
  };

  public start() {
    return this.eval(this.tree);
  }

  private readonly tree: TNode;
  constructor(tree: TNode) {
    this.tree = tree;
  }
}


const getFucntionFromOperator = (operator: Exclude<EOperationType, EOperationType.function>):
  ((...args: number[]) => (number | boolean)) => {
  switch (operator) {
    case EOperationType.Plus: return (...args: number[]) => args[0] + (args[1] || 0);
    case EOperationType.Minus: return (...args: number[]) =>
      args.length === 1 ? - args[0] : args[0] - args[1];
    case EOperationType.Mul: return (...args: number[]) => args[0] * args[1];
    case EOperationType.Div: return (...args: number[]) => args[0] / args[1];
    case EOperationType.Mod: return (...args: number[]) => args[0] % args[1];
    case EOperationType.Eq: return (...args: number[]) => args[0] === args[1];
    case EOperationType.EqNot: return (...args: number[]) => args[0] !== args[1];
    case EOperationType.Lt: return (...args: number[]) => args[0] < args[1];
    case EOperationType.Gt: return (...args: number[]) => args[0] > args[1];
    case EOperationType.Lte: return (...args: number[]) => args[0] <= args[1];
    case EOperationType.Gte: return (...args: number[]) => args[0] >= args[1];
    case EOperationType.And: return (...args: number[]) => args[0] && args[1];
    case EOperationType.Or: return (...args: number[]) => args[0] || args[1];
    // tslint:disable: no-bitwise
    case EOperationType.BitShiftLeft: return (...args: number[]) => args[0] << args[1];
    case EOperationType.BitShiftRight: return (...args: number[]) => args[0] >> args[1];
    case EOperationType.BitAnd: return (...args: number[]) => args[0] & args[1];
    case EOperationType.BitXor: return (...args: number[]) => args[0] ^ args[1];
    case EOperationType.BitOr: return (...args: number[]) => args[0] | args[1];
    // tslint:enable: no-bitwise
    case EOperationType.Neg: return (...args: number[]) => !args[0];

    default:
      throw new Error(`operator not recognized '${operator}'`);
  }
};
