function common() {
  return {
    DIST_DIR: process.env.DIST_DIR,
    FILE_LIMIT: process.env.FILE_LIMIT,
  };
}

function production() {
  return {
    PORT: process.env.PORT,
    ...common(),
  };
}

function development() {
  return {
    PORT: process.env.PORT_DEV,
    ...common(),
  };
}

export default function() {
  if (process.env.NODE_ENV !== 'production') return development();
  return production();
}
