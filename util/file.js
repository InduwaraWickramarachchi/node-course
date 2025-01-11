import { unlink } from "fs";

export function deleteFileHelper(filePath) {
  unlink(filePath, (err) => {
    if (err) {
      throw err;
    }
  });
}
