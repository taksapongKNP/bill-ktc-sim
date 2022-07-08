const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const server = express();


server.use(bodyParser.json());
server.use(morgan("dev"));
server.use(cors());
server.use(fileUpload({
  createParentPath: true
}));

server.use( express.static( "public" ) );
const port = 3000;
const Excel = require("exceljs");
const fs = require("fs");

server.use("/font", express.static(__dirname +'/templates/fonts/'));
server.use("/files", express.static(__dirname +'/files'));
server.use("/download-files", express.static(__dirname +'/download-files'));

server.use("/templates", express.static(__dirname +'/templates/'));
server.use("/templates/images", express.static(__dirname +'/templates/image/'));

server.use("/api/users", require("./routes/rounter.users.js"));
server.use("/api/positions", require("./routes/rounter.positions.js"));
server.use("/api/modules", require("./routes/rounter.modules.js"));
server.use("/api/modulesmap", require("./routes/rounter.modulesMap.js"));
server.use("/api/levels", require("./routes/rounter.levels.js"));
server.use("/api/teams", require("./routes/rounter.teams.js"));
server.use("/api/teamsMap", require("./routes/rounter.teamsMap.js"));
server.use("/api/billing", require("./routes/rounter.billing.js"));

server.get("/api/download/excel/:id", (req, res) => {
  const id = req.params.id;
  const filexcel = `./files/${id}.xlsx`;
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(filexcel).then(function () {
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  });
});

server.get('/getCssTemplate', (req, res) => {
  fs.readFile(`./templates/fonts/thsarabunnew.css`, function (err, data) {
    if (err) throw err
    else {
      res.writeHead(200, { "Content-Type": "text/css" })
      res.end(data)
      // Send the file data to the browser.
    }
  })
});

server.get('/font/:name', (req, res) => {
  const name = req.params.name
  fs.readFile(`./templates/fonts/${name}`, function (err, data) {
    if (err) throw err
    else {
      // res.writeHead(200, { "Content-Type": "text/application/x-font-ttf" })
      res.end(data)
      // Send the file data to the browser.
    }
  })
});



// server.get("/api/download/pdf/:id", (req, res) => {
//   const id = req.params.id;
//   const req = req;
// console.log("select Data : "+id);
//   const filexcel = `./files/${id}.xlsx`;
//   var workbook = new Excel.Workbook();
//   workbook.xlsx.readFile(filexcel).then(function () {
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
//     workbook.xlsx.write(res).then(() => {
//       res.end();
//     });
//   });
// });

server.listen(port, function () {
  console.log(`Server At Port: ${port}`);
});
