import * as fs from "fs";

/**
 * source https://stackoverflow.com/a/60203932
 */
export const readLineSync = () => {
  let rtnval = "";

  const buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);

  for (; ;) {
    fs.readSync(0, buffer, 0, 1, undefined);   // 0 is fd for stdin
    if (buffer[0] === 10) {   // LF \n   return on line feed
      break;
    } else if (buffer[0] !== 13) {   // CR \r   skip carriage return
      rtnval += buffer.toString();
    }
  }

  return rtnval;
};

export const readIntSync = (): number => {
  let num: number = NaN;
  while (true) {
    const res = readLineSync();
    num = Number.parseInt(res, 10);
    if (Number.isNaN(num))
      console.error("zadaná hodnota není číslo, zkus to znovu");
    else break;
  }
  return num;
};


export const formatString = (str: string, args: number[]): string => {
  const split = str.split(/(%)([0-9]*)([idxXc])/);
  let curI = 0;
  while (curI < split.length && args.length) {
    const curStr = split[curI];
    if (curStr === "%") {
      const padding = Number.parseInt(split[curI + 1], 10) || 0;
      const style = split[curI + 2] as "i" | "d" | "x" | "X" | "c";
      let formatedRes: string;
      const num = args.pop();
      switch (style) {
        case "x":
          formatedRes = num.toString(16);
          break;
        case "X":
          formatedRes = num.toString(16);
          formatedRes = formatedRes.toUpperCase();
          break;
        case "c":
          formatedRes = String.fromCharCode(num);
          break;
        case "d":
        case "i":
          formatedRes = num.toString();
          break;
        default:
          curI++;
          continue;
      }
      formatedRes = formatedRes.padStart(padding, " ");
      split.splice(curI, 3, formatedRes);
    }
    curI++;
  }
  return split.join("");
};


export const isBoolean = (obj: any) => {
  return obj === true || obj === false;
};
