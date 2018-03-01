import partsFile from '../module/partsFile.mjs';

export default function(files, extfile) {
  const result = [];

  files.forEach((file) => {
    const matchFile = partsFile(file.originalname);

    if (matchFile.extFile !== extfile) {
      result.push({
        [matchFile.nameFile]: `is extention ${
          matchFile.extFile
        }. Needed ${extfile}`,
      });
    }
  });

  if (result.length) {
    return { err: result };
  }

  return { success: true };
}
