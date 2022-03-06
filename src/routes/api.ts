import express, { Request, Response } from 'express';
import { cloneDeep } from 'lodash';
import fs from 'fs';
import sharp from 'sharp';
import { logger } from '../config/winston';
// const fs = require('fs');

const routerAPIs = express.Router();

/* GET users listing. */
routerAPIs.get('/', (_req: Request, res: Response) => {
  res.send('v1 API');
});

routerAPIs.get('/image', (req: Request, res: Response) => {
  const { file, width, height } = req.query;
  const path = `./images/${width}x${height}`;
  const pathOriginalFile = `./images/original/${file}`;
  const pathFile = `${path}/${file}`;

  console.log(req.query);

  if (!fs.existsSync(pathFile)) {
    console.log('not existed');
    fs.mkdirSync(path, { recursive: true });
    const options = JSON.parse('{"position":"left top"}');
    options.width = parseInt(<string>width, 10);
    options.height = parseInt(<string>height, 10);
    sharp(pathOriginalFile).resize(options).toFile(pathFile);
  }
  // file exists
  const data = fs.readFileSync(pathFile);
  res.setHeader('Content-Type', 'application/image');
  res.type('jpg');
  res.send(data);
});

routerAPIs.get('/images', (_req: Request, res: Response) => {
  const json:any = JSON.parse('{}');
  json.status = 'ok';
  json.images = [];

  const imageFolder = './images/original';
  fs.readdirSync(imageFolder).forEach((file) => {
    json.images.push(file);
  });

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(json));
});

routerAPIs.post('/myapi', (req: Request, res: Response) => {
  const reqBody:string = req.body;
  logger.debug(reqBody);

  const tmp:any = JSON.parse('{}');
  const json = cloneDeep(tmp);
  json.status = 'ok';

  res.send(JSON.stringify(json));
});

export default routerAPIs;
