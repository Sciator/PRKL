import { mCExecutinTreeGenerator } from "./mCExecutinTreeGenerator";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { Interpreter } from "./Intrerpreter";
import * as Path from "path";
import { throwReturn } from "./common";
import { TNode } from "./ExecutionTree";
import { validate } from "jsonschema";
import * as treeSchema from "./mCTree.schema.json";

export const processFile = (input: string, output: "" | string, interpret: boolean, forceOverwrite?: boolean) => {
  if (!existsSync(input))
    throw new Error(`invalid input, file doesn't exists: ${input}`);


  const ext = Path.extname(input).slice(1).toLowerCase();

  const tree =
    // todo: validace json ?
    (ext === "json") && readJsonTreeFile(input)
    || (ext === "mc") && mCExecutinTreeGenerator.run(input)
    || throwReturn(`invalid file extension ${ext}`)
    ;

  if ((ext !== "json") && output
    && (!existsSync(output) || forceOverwrite))
    writeFileSync(output, JSON.stringify(tree, undefined, 2));

  if (interpret)
    new Interpreter(tree).start();
};


const readJsonTreeFile = (file: string): TNode => {
  const json = JSON.parse(readFileSync(file).toString());
  const validationRes = validate(json, treeSchema);

  if (validationRes.errors.length){
    throw new Error(`Error reading json file ${file} \n${validationRes.errors.join("\n")}`);
  }

  return json as TNode;
};
