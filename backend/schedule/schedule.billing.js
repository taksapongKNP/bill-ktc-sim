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

const billingController = require("../controllers/controller.billing");

schedule.scheduleJob('00 52 15 * * *', async function(){
    console.log('-------------------- Check Import --------------------');
    await billingController.exportStatementToPatch();
    await billingController.exportInvoiceToPatch();


    
    // const logList = await uploadLogService.findByDate(new Date().toISOString().slice(0, 10))
    // .then((data) => {
    //   return data;
    // })
    // .catch((err) => { 
    //   console.log(err);
    //   res.status(500).send(err);
    // });
    // // console.log(logList);
    // logList.forEach(log => {
    //   console.log(log)
    //   if(log.file_type_id == '1'){
        
    //   }else if(log.file_type_id == '2'){
  
    //   }
    // });
    // console.log("--------------------------------");
    // for(var i = 0; i < logList.length; i++) {
    //   console.log(logList[i]);
    // }
  });