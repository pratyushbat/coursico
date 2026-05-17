// .env file configuration
import { config } from "dotenv";
config({ path: "./.env" });
import 'zone.js/node';
import {  v2 } from 'cloudinary';
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import productRoutes from "./backend/routes/productRoute";
// import configDb from 'backend/config/connection';
import mongoose from "mongoose";
const configDb = async () => {
  try {
    const connectionString: string = process.env.DB_URI || "";
    console.log('-------------connectionString---------------')
    console.log(connectionString)
    console.log('-------------process.env.DB_URI---------------')
    console.log(process.env.DB_URI)
    await mongoose.connect(connectionString,{
    dbName: 'myecomdb'
});
    console.log(`Database configurations success 🗳`);
  } catch (error: any) {
    console.log("failed to Database Configurations 😞",error);
  }
};

// The Express app is exported so that it can be used by serverless Functions.

export function app(): express.Express {
  // connecting DB

  const server = express();
  configDb();
  const distFolder = join(process.cwd(), 'dist/coursico/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
    server.use("/api/product", productRoutes);
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));


  //cloudnary configuration for saving profile image on cloud
v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});

/*     server.get('/api/hello', (req, res) => {
    console.log('-------------------------')
    res.send({ message: 'hello from server api hello' })
  }); */


  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });


  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';