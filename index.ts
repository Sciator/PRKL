import { mCExecutinTreeGenerator } from "./mCExecutinTreeGenerator";
import { writeFile } from "fs";
import { promisify } from "util";
import { Interpreter } from "./Intrerpreter";


(async () => {
  const tree = mCExecutinTreeGenerator.run();

  await promisify(writeFile)("./output.json", JSON.stringify(tree, undefined, 2));

  new Interpreter(tree).start();
})();


