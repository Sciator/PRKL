import * as fs from "fs";

export const readLineSync = () => {
  let rtnval = "";

  const buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);

  for(;;){
      fs.readSync(0, buffer, 0, 1, undefined);   // 0 is fd for stdin
      if(buffer[0] === 10){   // LF \n   return on line feed
          break;
      }else if(buffer[0] !== 13){     // CR \r   skip carriage return
          rtnval += buffer.toString();
      }
  }

  return rtnval;
};


