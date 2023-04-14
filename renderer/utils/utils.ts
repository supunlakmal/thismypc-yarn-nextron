// import fs from "fs";
// import fse from "fs-extra";
import hddSpace from "hdd-space";
// import os from "os";
// import path from "path";

// export function isFile(pathFile: string): boolean {
//   return fs.statSync(pathFile).isFile();
// }

export function fileSize(bytes: number, si: boolean): string {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
}

export function timeStampToDateTimeText(t: Date): string {
  return `${t.getFullYear()}-${t.getMonth()}-${t.getDay()} ${t.getHours()}:${t.getMinutes()}`;
}

// export function fileInfo(pathFile: string): any {
//   const property: any = {};
//   const info = fs.statSync(pathFile);
//   property.sizeText = fileSize(info.size, true);
//   property.birthTime = timeStampToDateTimeText(info.birthtime);
//   property.accessed = timeStampToDateTimeText(info.atime);
//   property.modified = timeStampToDateTimeText(info.mtime);
//   return property;
// }

// export function fileInfoByPath(pathFile: string): any {
//   const info = fs.statSync(pathFile);
//   info.filename = path.basename(pathFile);
//   return info;
// }

export async function getHDDList(): Promise<any> {
  return new Promise((resolve) => {
    hddSpace(
      {
        format: "auto",
      },
      function (info) {
        resolve(info);
      }
    );
  }).then((hDDList) => {
    return hDDList;
  });
}

// export async function readFolder(path: string): Promise<any> {
//   return new Promise((resolve) => {
//     fse.readdir(path, function (err, content) {
//       if (err) {
//         console.log(err);
//         resolve(false);
//       } else {
//         resolve(content);
//       }
//     });
//   }).then((data) => {
//     return data;
//   });
// }

// export async function isThisFile(path: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     fse.ensureFile(path, (err) => {
//       if (err) {
//         resolve(false);
//       } else {
//         resolve(true);
//       }
//     });
//   }).then((result) => {
//     return result;
//   });
// }

// export function getPcInfo(): any {
//   const pcInfo: any = {};
//   pcInfo.totalMemory = fileSize(os.totalmem(), true);
//   pcInfo.useMemory = fileSize(os.totalmem() - os.freemem(), true);
//   return pcInfo;
// }
