export default function(file) {
  let result = { nameFile: null, extFile: null };
  const matchFile = file.match(/(.*)(\.\w+)/);

  if (matchFile) {
    result = { nameFile: matchFile[1], extFile: matchFile[2] };

    return result;
  }

  result = { nameFile: matchFile[0], extFile: undefined };

  return result;
}
