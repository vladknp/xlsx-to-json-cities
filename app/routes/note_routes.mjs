import cors from 'cors';
import fs from 'fs';
import util from 'util';
import multer from 'multer';
import archiver from 'archiver';
import convertCities from '../module/convertCities.mjs';
import isXlsx from '../module/isXlsx.mjs';
import partsFile from '../module/partsFile.mjs';
import env from '../../config/env.mjs';

const ENV = env();

const dstPath = ENV.DIST_DIR;
const upload = multer().array('avatar', ENV.FILE_LIMIT);
const writeFilePromisify = util.promisify(fs.writeFile);

if (!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);

export default function(app, db) {
  // set default cors: no-cors;
  app.use(cors());

  // Получение всех записей
  app.post('/xlsx/convert', (req, res) => {
    const OPTIONS_ROW = {
      sheet: '1',
      isColOriented: false,
      omitEmtpyFields: true,
    };

    function setHeader({ response, name }) {
      response.setHeader('Content-Type', 'application/zip');
      response.attachment(`${name}.zip`);
      return response;
    }

    function filename(arr) {
      return arr[0];
    }

    upload(req, res, (err) => {
      if (err || req.files.length < 1) {
        res.send({ err: `Limit of file from 1 to ${ENV.FILE_LIMIT}` });
        return;
      }

      const tryFile = isXlsx(req.files, '.xlsx');

      if (tryFile.err) {
        res.send(tryFile);
        return;
      }

      const result = req.files.map(async (file) => {
        const { originalname } = file;
        const bufXlsx = Buffer.from(file.buffer, 'ascii');
        const { nameFile } = partsFile(originalname);
        const pathFile = `${ENV.DIST_DIR}/${originalname}`;
        const jsonFile = `${dstPath}/${nameFile}.json`;

        async function run() {
          let cities = [];

          await writeFilePromisify(pathFile, bufXlsx);

          try {
            cities = await convertCities(pathFile, jsonFile, OPTIONS_ROW);
          } catch (error) {
            res.send({ err: `${error}` });
            throw new Error(error);
          }

          return [nameFile, cities];
        }

        const jsonCities = await run();
        return jsonCities;
      });

      Promise.all([...result])
        .then((data) => {
          const archive = archiver('zip', {
            zlib: { level: 9 },
          });
          const id = Date.now();

          data.forEach((file) => {
            const buf = Buffer.from(JSON.stringify(file));
            const name = filename(file);

            archive.append(buf, { name });
          });

          const response = setHeader({ response: res, name: id });

          archive.pipe(response);
          archive.finalize((error, byte) => {
            if (error) {
              throw new Error('Ошибка');
            } else {
              res.addTrailers({ 'Content-Length': byte });
              res.end();
            }
          });

          db.push([id, data]);
        })
        .catch((error) => {
          global.console.log('Error: ', error);
        });
    });
  });

  app.get('/xlsx/download/:id', (req, res) => {
    const { id } = req.params;
    db.find((file) => String(file[0]) === String(id));

    res.download(`dist/out/${id}`);
  });
}
