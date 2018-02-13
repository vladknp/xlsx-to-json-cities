import partsFile from '../module/partsFile';

export default function (files, extfile) {
  const result = [];

  files.map(file => {
    const matchFile = partsFile(file.originalname);
    
    if (matchFile._extFile !== extfile) {
      result.push({[matchFile._nameFile] : `is extention ${matchFile._extFile}. Needed ${extfile}`});

      return;
    };
  })

  if (result.length) {
    return {err: result}
  }

  return {success: true}
}
