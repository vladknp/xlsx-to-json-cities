import cors from 'cors';
import fs from 'fs';
import util from 'util';
import multer from 'multer';
import archiver from 'archiver';
import convertCities from '../module/convertCities';
import isXlsx from '../module/isXlsx';
import partsFile from '../module/partsFile';
import env from '../../config/env';


const ENV = env();

const dstPath = ENV.DIST_DIR;
const upload = multer().array('avatar', ENV.FILE_LIMIT);
const writeFilePromisify =  util.promisify(fs.writeFile);

if(!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);

export default function(app, db) {
  // set default cors: no-cors;
  app.use(cors());

  // Получение всех записей
  app.post('/xlsx/convert', (req, res) => {
    const OPTIONS_ROW = {
      sheet:'1',
      isColOriented: false,
      omitEmtpyFields: true,
    };
    
    upload(req, res, (err) => {
      if (err || req.files.length < 1) {
        res.send({err: `Limit of file from 1 to ${ENV.FILE_LIMIT}`})
        return
      }
    
      const tryFile = isXlsx(req.files, '.xlsx');
      
      if (tryFile['err']) {
        res.send(tryFile);
        return;
      }
      
      const result = req.files.map(async file => {
        const originalname = file.originalname;
        const bufXlsx= Buffer.from(file.buffer, 'ascii');
        const { _nameFile, _extFile } = partsFile(originalname);
        const pathFile = `${ENV.DIST_DIR}/${originalname}`;
        const jsonFile = `${dstPath}/${_nameFile}.json`;
        
        async function run () {
          let cities = []

          await writeFilePromisify(pathFile, bufXlsx);
          
          try {
            cities = await convertCities(pathFile, jsonFile, OPTIONS_ROW);
          } catch (error) {
            res.send({err: `${error}`});
            throw new Error(error);
          }

          return [_nameFile, cities];
        };

        return await run();
      });

      Promise.all([...result])
        .then((data) => {          
          const archive = archiver('zip', {
            zlib: { level: 9 }
          });
          const id = Date.now();
          const options = {
            res: res,
            filename: id
          }
          
          data.map(file => {
            const buf = Buffer.from(JSON.stringify(file));
            const _filename = filename(file);

            archive.append(buf, { name: _filename });
          });
          
          const response = setHeader(options);
          
          archive.pipe(response);
          archive.finalize((err, byte) => {
            if (err) {
              throw new Error('Ошибка')
            } else {
              res.addTrailers({'Content-Length': byte});
              res.end()
            }
          });

          db.push([id, data]);
        })
        .catch(err => {console.log('Error: ', err)});
        
      function setHeader ({res, filename}) {
        res.setHeader("Content-Type", "application/zip");
        res.attachment(`${filename}.zip`);
        return res;
      };
        
      function filename (arr) {
        return arr[0];
      };
    })
  })

  app.get('/xlsx/download/:id', (req, res) => {
    const id = req.params.id;
    const result = db.find(file => String(file[0]) === String(id));

    res.download(`dist/out/${id}`);
  })
};
