export default function (NODE_ENV) {
  if (process.env.NODE_ENV !== 'production') return development();
  return production();
}

function production () {
  return {
    PORT: process.env.PORT,
    ...common()
  }
};

function development () {
  return {
    PORT: process.env.PORT_DEV,
    ...common()
  }
};

function common () {
  return {
    DIST_DIR: process.env.DIST_DIR,
    FILE_LIMIT: process.env.FILE_LIMIT,
  }
}
