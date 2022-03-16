const express = require("express");
const server = express();
const Promise = require('bluebird');
const { v4: uuidv4 } = require("uuid");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const JSZip = require("jszip");
const bahttext =require("bahttext");
const pdf =   Promise.promisifyAll(require('html-pdf'));
const pdfToZip =  Promise.promisify(require('html-pdf').create);
const htmlToPdf = require("html-pdf-node");
const xlsx = require("xlsx");
const ejs = require("ejs");
const { ConsoleMessage } = require("puppeteer");
const zipFolder = require("zip-folder");
const rimraf = require("rimraf");
const schedule = require('node-schedule');

server.use("/files", express.static(__dirname +'/files'));

const billingService = require("../services/services.billing");
const billingSubService = require("../services/services.billingSub");
const invoiceService = require("../services/services.invoice");
const uploadLogService = require("../services/services.uploadLog");

schedule.scheduleJob('00 21 14 * * 0-6', async function(){
    console.log('-------------------- Check Import --------------------');
    const logList = await uploadLogService.findByDate(new Date().toISOString().slice(0, 10))
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
    // console.log(logList);
    logList.forEach(log => {
      console.log(log)
      if(log.file_type_id == '1'){
        
      }else if(log.file_type_id == '2'){
  
      }
    });
    // console.log("--------------------------------");
    // for(var i = 0; i < logList.length; i++) {
    //   console.log(logList[i]);
    // }
  });