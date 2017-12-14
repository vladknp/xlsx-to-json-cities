const convertCities = require('./module/convertCities');


const srcPaths = [ './app/media/all_shops_uk', './app/media/all_shops_ru' ];
const dstPath = './dist/';

const OPTIONS_ROW = {
  sheet:'1',
  isColOriented: false,
  omitEmtpyFields: true,
};

convertCities(srcPaths, dstPath, OPTIONS_ROW);

