import cors from 'cors';
import fs from 'fs';
import util from 'util';
import multer from 'multer';
import convertCities from '../module/convertCities';
import isXlsx from '../module/isXlsx';
import partsFile from '../module/partsFile';

const CONFIG = {
  baseDir: './dist',
  fileLimit: 12,
  port: '8083'
};

const dstPath = `${CONFIG.baseDir}`;
const upload = multer().array('avatar', CONFIG.fileLimit);
const writeFilePromisify =  util.promisify(fs.writeFile);

if(!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);

export default function(app, db) {
  // set default cors: no-cors
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
        res.send({err: `Limit of file from 1 to ${CONFIG.fileLimit}`})
        return
      }
    
      const tryFile = isXlsx(req.files, '.xlsx');
      
      if (tryFile['err']) {
        res.send(tryFile);
        return;
      }
      
      const result = req.files.map(async file => {
        const originalname = file.originalname;
        const buf = Buffer.from(file.buffer, 'ascii');
        const { _nameFile, _extFile } = partsFile(originalname);
        const pathFile = `${CONFIG.baseDir}/${originalname}`;
        const jsonFile = `${dstPath}/${_nameFile}.json`;
        
        async function run () {
          let cities = []

          await writeFilePromisify(pathFile, buf);
          
          try {
            cities = await convertCities(pathFile, jsonFile, OPTIONS_ROW);
          } catch (error) {
            res.send({err: `${error}`});
            throw new Error(error);
          }

          return [_nameFile, cities];
        };

        return await run();
      })

      Promise.all([...result])
        .then((data) => {
          const id = Date.now();

          db.push([id, data]);
          res.send(String(id));
          // res.send(`<div><a href="http://localhost:${CONFIG.port}/xlsx/download/${id}">Download zip</a></div>`);
        })
        .catch(err => {console.log('catch', err)})  
    })
  })
};
