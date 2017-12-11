const convertExcel = require('excel-as-json').processFile;
const fs = require('fs');

const SRC = './app/media/all_shops_uk.xlsx';
const DST = './dist/shops.json';

const OPTIONS_ROW = {
  sheet:'1',
  isColOriented: false,
  omitEmtpyFields: true,
};

/* Need structure JSON files
  [
    {
      "town": "Бердичев",
      "servicesCenters": ["ул. Европейская, 10", "ул. Житомирская 17"]
    },
  ]
 */
convertExcel(SRC, DST, OPTIONS_ROW, (err, data) => {
  if (err) console.log(`JSON conversion failure: ${err}`);
  
  const objectCities = data.reduce(reducerCO, {});

  const finishStructure = makeFinishStructure(objectCities);
  
  const resultJSON = JSON.stringify(finishStructure);

  fs.writeFile('./dist/1.json', resultJSON, (err) => {
    if (err) throw err;
    console.log('It\'s saved!');
  });
});

/* Функция создает временную JSON структуру ключ которого город
  {
    "Lviv": {
      "town": "Lviv",
      "serviceCenters": [ "Победы 18", "Стратегическое шосе 5"]
    }
  }
 */
function reducerCO(previous, current) {
  const newTown = current.town;
  const newAddress = current.address;
  const arrAdresses = previous[newTown];

  if ((newTown === undefined || newTown === '')) return previous;

  if (arrAdresses === undefined) {
    previous[newTown] = {
      "town": "",
      "serviceCenters": [],
    };

    previous[newTown].town = newTown;
    previous[newTown].serviceCenters = [newAddress];

    return previous;
  };

  arrAdresses.serviceCenters.push(newAddress);

  return previous;
};

/* Функция содает массив обектов с городами
  [
    {
      "town": "Львов",
      "servicesCenters": ["ул. Европейская, 10", "ул. Житомирская 17"],
    }
  ]
 */
function makeFinishStructure(objCities) {
  const arr = [];
  
  for (city in objCities) {
    arr.push(objCities[city]);
  };

  return arr;
};
