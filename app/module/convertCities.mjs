import fs from 'fs';
import util from 'util';
import excel_as_json from 'excel-as-json';


const convertExcel = excel_as_json.processFile;
const convert = util.promisify(convertExcel);

/* Need structure JSON files
  [
    {
      "town": "Бердичев",
      "servicesCenters": ["ул. Европейская, 10", "ул. Житомирская 17"]
    },
  ]
 */
export default async function convertCities (input, output, options) {
  async function run () {
    const exlsRes = await convert(input, null, options)
    try {
      return exlsRes /* return :array */
    } catch (error) {
      throw new Error(error)
    }
  };
  
  return await run();
};


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
  
  for (const city in objCities) {
    arr.push(objCities[city]);
  };

  return arr;
};
