import util from 'util';
import excelAsJson from 'excel-as-json';

const convertExcel = excelAsJson.processFile;
const convert = util.promisify(convertExcel);

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

  // if (newTown === undefined || newTown === '') return previous;

  if (arrAdresses === undefined) {
    return {
      ...previous,
      [newTown]: {
        town: newTown,
        serviceCenters: [newAddress],
      },
    };
  }

  arrAdresses.serviceCenters.push(newAddress);

  return previous;
}

/* Функция содает массив обектов с городами
  [
    {
      "town": "Львов",
      "servicesCenters": ["ул. Европейская, 10", "ул. Житомирская 17"],
    }
  ]
 */
function makeFinishStructure(objCities) {
  return Object.keys(objCities).map((key) => objCities[key]);
}

/* Need structure JSON files
  [
    {
      "town": "Бердичев",
      "servicesCenters": ["ул. Европейская, 10", "ул. Житомирская 17"]
    },
  ]
 */
export default async function convertCities(input, output, options) {
  const run = async () => {
    try {
      const arrCities = await convert(input, null, options); /* return :array */
      const objectCities = arrCities
        .filter((value) => value.town !== (undefined || ''))
        .reduce(reducerCO, {});
      return makeFinishStructure(objectCities);
    } catch (error) {
      throw new Error(error);
    }
  };

  const result = await run();
  return result;
}
