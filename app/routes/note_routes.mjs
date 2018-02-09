import cors from 'cors';
import fs from 'fs';
import util from 'util';
import multer from 'multer';
import convertCities from '../module/convertCities';

const upload = multer().array('avatar', 1);

const CONFIG = {
  baseDir: './dist',
}

const writeFilePromisify =  util.promisify(fs.writeFile);

export default function(app, db) {
  // set default cors: no-cors
  app.use(cors());

  // Получение всех записей
  app.post('/xlsx/upload', (req, res) => {
    const OPTIONS_ROW = {
      sheet:'1',
      isColOriented: false,
      omitEmtpyFields: true,
    }
    
    upload(req, res, (err) => {
      if (err) {
        res.send({err: 'Limit of foto 2'})
        return
      }
    
      const result = req.files.map(async file => {
        const buf = Buffer.from(file.buffer, 'ascii');
        const dstPath = `${CONFIG.baseDir}`;
        const pathFile = `${CONFIG.baseDir}/${file.originalname}`;
        const nameFile = new String(file.originalname).replace(/(\.xlsx$)/, '');
        const jsonFile = `${dstPath}/${nameFile}.json`;

        if(!fs.existsSync(dstPath)) fs.mkdirSync(dstPath);
        
        async function run () {
          await writeFilePromisify(pathFile, buf)

          return [nameFile, await convertCities(pathFile, jsonFile, OPTIONS_ROW)];
        };

        return await run()
      })

      Promise.all([...result])
        .then((data) => {

          res.send('<div><a href="#">Download zip</a></div>');
          console.log('response finish')
        })
        .catch(err => {console.log(err)})  
    })
  })
};
