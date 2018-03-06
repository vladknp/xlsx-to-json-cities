## App for generage static JSON structur

```
["pizza_cafe",
  [
    {
    "town":"Киев",
    "serviceCenters":["пр. Победы 57", "ул. Солнечная 122а"]
    },{
    "town":"Харьков",
    "serviceCenters":["ул. Большая 5"]
    },{
    "town":"Тернополь",
    "serviceCenters":["ул. Памятная 10"]
    }
  ]
]
```

#### For start project need `node version 8`

* Clone repo `git@github.com:vladknp/xlsx-to-json-cities.git`
* Change directori `cd xlsx-to-json-cities`
* Install packages `npm install`
* Run project: prod `npm start` or dev `npm run dev`

### OR

Your can use package `npx`.

* Install npx packages `npm install global npx` or `yarn add global npx`
* Install dependencies and devdependencies `npx -p node@8 yarn` or `npx -p node@8 npm install`

* Run project: prod `npx -p node@8 yarn start` or dev `npx -p node@8 yarn dev`

### Needed structure of xlsx files

| town      | address            |
| --------- | ------------------ |
| Киев      | пр. Победы 57      |
| Харьков   | ул. Большая 5      |
| Киев      | ул. Солнечная 122а |
| Тернополь | ул. Памятная 10    |

Warnint: necessarily keys: `town` and `address`

```

```
