import { mCExecutinTreeGenerator } from "./mCExecutinTreeGenerator";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { Interpreter } from "./Intrerpreter";
import * as Path from "path";
import { throwReturn } from "./common";
import { TNode } from "./ExecutionTree";

export const processFile = (input: string, output: "" | string, interpret: boolean, forceOverwrite?: boolean) => {
  if (!existsSync(input))
    throw new Error(`invalid input, file doesn't exists: ${input}`);

  const ext = Path.extname(input).slice(1).toLowerCase();

  const tree =
    // todo: validace json ?
    (ext === "json") && JSON.parse(readFileSync(input).toString()) as TNode
    || (ext === "mc") && mCExecutinTreeGenerator.run(input)
    || throwReturn(`invalid file extension ${ext}`)
    ;

  if ((ext !== "json") && output
    && (!existsSync(output) || forceOverwrite))
    writeFileSync(output, JSON.stringify(tree, undefined, 2));

  if (interpret)
    new Interpreter(tree).start();
};

