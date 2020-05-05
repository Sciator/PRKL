import yargs from "yargs";
import chalk from "chalk";
import { processFile } from "./processFile";

export const runCli = () =>
  yargs
    .command(
      "* [file] [output]",
      "compile/interpret given .mC/JSON file",
      builder => builder
        .positional("file", { describe: "file to intepret/compile", type: "string", alias: "in" })
        .positional("output", {
          describe: "output compilated json file (no file created if not specified)", type: "string",
          alias: "out", default: "",
        })
        .demandOption("file")
        .option("interpret", { alias: "i", boolean: true })
        .option("force", {
          alias: "f", boolean: true,
          describe: "forces overwriting output file when already exists",
        })
      ,
      (async args => {
        const input = args.file as string;
        const output = args.output as string;
        const forceOverwrite = args.force || false;

        const intepret = args.interpret || !output || false;

        try {
          processFile(input, output, intepret, forceOverwrite);
          console.info(chalk.green(`Done !`));
        } catch (e) {
          console.error(chalk.redBright(e.message));
        }
      }))
    .argv
  ;
