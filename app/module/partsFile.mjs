export default function (file) {
  let result = {_nameFile: null, _extFile: null};
  const matchFile = file.match(/(.*)(\.\w+)/);

  if (matchFile) {
    result = {_nameFile: matchFile[1], _extFile: matchFile[2]};
    
    return result;
  }

  result = {_nameFile: matchFile[0], _extFile: undefined};
  
  return result;
};
