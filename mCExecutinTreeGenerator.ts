import antlr4 = require("antlr4");
import { InputStream, CommonTokenStream } from "antlr4";
import { mCLexer } from "./parser/mCLexer";
import { mCParser } from "./parser/mCParser";
import { mCListener } from "./parser/mCListener";
import * as fs from "fs";
import { ENodeType, TNode, EOperationType } from "./ExecutionTree";


export class mCExecutinTreeGenerator {
  private static readonly Listener = (class extends mCListener {
    public tree: TNode;

    exitStatement(ctx) {
      ctx.res = ctx.children.map(x => x.res).filter(x => x !== undefined);
      if (ctx.res.length === 1)
        ctx.res = ctx.res[0];
    }

    exitStFor(ctx) {
      const then = ctx.statement().res;
      const node: TNode = {
        type: ENodeType.for,
        then,
      };

      // removing `for` `(` and `)` `statement`
      let c = ctx.children.slice(2, -2);
      const pre = c[0].res;
      c = c.slice(pre ? 2 : 1);
      const cond = c[0].res;
      c = c.slice(cond ? 2 : 1);
      const step = c[0]?.res;
      if (pre) node.pre = pre;
      if (cond) node.cond = cond;
      if (step) node.step = step;
      ctx.res = node;
    }

    exitStIf(ctx) {
      const cond = ctx.expression().res;
      const [then, el] = ctx.statement().map(x => x.res);
      ctx.res = {
        type: ENodeType.if,
        cond,
        then,
      } as TNode;
      if (el)
        ctx.res.el = el;
    }

    exitStDoWhile(ctx) {
      this._exitWhile(ctx, true);
    }

    exitStWhile(ctx) {
      this._exitWhile(ctx);
    }

    _exitWhile(ctx, condAfter?: true) {
      const cond = ctx.expression().res;
      const then = ctx.statement().res;
      ctx.res = {
        type: ENodeType.while,
        cond,
        then,
      } as TNode;
      if (condAfter)
        ctx.res.condAfter = true;
    }

    exitStart(ctx) {
      ctx.res = ctx.children.map(x => x.res).filter(x => x !== undefined);
      if (ctx.res.length === 1)
        ctx.res = ctx.res[0];
      this.tree = ctx.res;
    }

    exitFncCall(ctx) {
      const [{ res: fnc }, , { res: args }] = ctx.children;
      ctx.res = {
        type: ENodeType.operation,
        operation: EOperationType.function,
        args,
        fnc,
      } as TNode;
    }

    exitArguments(ctx) {
      // filtering `,` between arguments
      ctx.res = ctx.children.map(x => x.res).filter(x => x !== undefined);
    }

    exitOpAssignSpecial(ctx) {
      ctx.res = ctx.children[0].symbol.text;
    }

    exitAssign(ctx) {
      const [{ res: target }, , { res: exprMain }] = ctx.children;
      let expr: TNode = exprMain;
      if (ctx.opAssignSpecial()) {
        const op = ctx.opAssignSpecial().res;
        expr = {
          type: ENodeType.operation,
          args: [target, expr],
          operation: op,
        };
      }
      ctx.res = {
        type: ENodeType.assign,
        expr,
        target,
      } as TNode;
    }

    exitExpression(ctx) {
      let node: TNode;
      switch (ctx.children.length) {
        case 1:
          node = ctx.children[0].res;
          break;
        case 2:
          const target = ctx.children[1].res;
          if (ctx.OpInc() || ctx.OpDec())
            node = {
              type: ENodeType.assign,
              target,
              expr: {
                type: ENodeType.operation,
                operation: ctx.OpInc() && EOperationType.Plus || EOperationType.Minus,
                args: [target, { type: ENodeType.constant, value: 1 }],
              },
            };
          else
            node = {
              type: ENodeType.operation,
              operation: ctx.children[0].symbol.text,
              args: [target],
            };
          break;
        case 3:
          const [{ res: arg1 }, { symbol: { text: operation } }, { res: arg2 }] = ctx.children;
          node = {
            type: ENodeType.operation,
            operation,
            args: [arg1, arg2],
          };
          break;
      }
      ctx.res = node;
    }

    exitNumber(ctx) {
      const radix
        = (ctx.NumberPrefHex() && 16)
        || (ctx.NumberPrefBin() && 2)
        || 10
        ;

      ctx.res = {
        type: ENodeType.constant,
        value: Number.parseInt(ctx.Digits()[0].getText(), radix),
      } as TNode;
    }

    visitTerminal(ctx) {
      const typeCode = ctx.symbol.type;
      let text = ctx.getText() as string;
      let node: TNode;
      switch (typeCode) {
        case mCParser.Char:
          // removing ' symbols
          text = text.slice(1, -1);
          node = {
            type: ENodeType.constant,
            value: text.charCodeAt(0),
          };
          break;
        case mCParser.String:
          // todo: parser by měl vracet string a char bez "/'
          // removing " symbols
          text = text.slice(1, -1);
          node = {
            type: ENodeType.constant,
            value: text,
          };
          break;
        case mCParser.Variable:
          node = {
            type: ENodeType.variable,
            name: text,
          };
          break;
        case mCParser.Boolean:
          node = {
            type: ENodeType.constant,
            value: text.toLowerCase() === "true",
          };
          break;

        default: break;
      }
      ctx.res = node;
    }
  });

  // tood: input
  public static run(/* input */) {
    const input = fs.readFileSync("./testing.mC").toString();
    const chars = new InputStream(input);
    const lexer = new mCLexer(chars);
    const tokens = new CommonTokenStream(lexer as any);
    const parser = new mCParser(tokens);
    (parser as any).buildParseTrees = true;
    const tree = parser.start();

    const listener = new mCExecutinTreeGenerator.Listener();
    (antlr4 as any).tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
    return listener.tree;
  }
}


