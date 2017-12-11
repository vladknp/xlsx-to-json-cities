const convertCities = require('./module/convertCities');


const paths = [ './app/media/all_shops_uk', './app/media/all_shops_ru' ];
const dstPath = './dist/';

const OPTIONS_ROW = {
  sheet:'1',
  isColOriented: false,
  omitEmtpyFields: true,
};

convertCities(paths, dstPath, OPTIONS_ROW);
