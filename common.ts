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



export const isBoolean = (obj: any) => {
  return obj === true || obj === false;
};
