const db = require("../models");
// const Jimp = require("jimp");
const fs = require("fs");
const exportexcel = db.exportexcel;
const Op = db.Sequelize.Op;
const Survey = db.survey;
const SurveyForm = db.surveyForm;
const SurveyDetails = db.surveyDetails;
const SurveyImages = db.surveyImages;
const { convert } = require('html-to-text');

const Excel = require('exceljs')
const { v4: uuidv4 } = require("uuid")
const { QueryTypes } = require('sequelize');
const { count } = require("console");


module.exports = {
    export: async(id, survey_code) => {
        // console.log(`Data==========>${survey_code}`)

        const Detailname = await db.sequelize.query(`SELECT username,position FROM db_users INNER JOIN db_survey ON db_survey.user_code = db_users.code WHERE db_survey.id = ${id}`, { type: QueryTypes.SELECT });

        const Servayform = await SurveyForm.findAll().then((Servayform) => {
            return Servayform;
        })
        const Dataimage = await SurveyImages.findAll({ where: { survey_code: survey_code } }).then((Dataimage) => {
            return Dataimage;
        });
        const Serveydetail = await SurveyDetails.findAll({ where: { survey_code: survey_code } }).then((Serveydetail) => {
            return Serveydetail;
        })
        const datenow = new Date().toISOString().slice(0, 10);
        return new Promise((resolve, reject) => {
                // console.log(`Detail ===> ${Dataimage}`)
                const Countimage = `${Dataimage.length}`;
                Survey.findAll({
                        where: { id: id },
                    })
                    .then((data) => {
                        let workbook = new Excel.Workbook()
                        let wsdetail = workbook.addWorksheet('รายละเอียดการประเมิน')
                            //count line
                        const detail = `${data[0].details}`;
                        var lines = (detail).split("</p>");
                        var stronglines = (detail).split("</strong>");
                        const linep = lines.length;
                        const linestrong = stronglines.length;
                        const countmerge = 11 + parseInt(linep) + parseInt(linestrong);
                        const noteproject = 8;
                        const countnote = parseInt(countmerge) + parseInt(noteproject)+ parseInt(Countimage);
                        console.log(countnote)
                        wsdetail.mergeCells('A1:B3');
                        wsdetail.mergeCells('A4:G4');
                        wsdetail.mergeCells('A5:B5');
                        wsdetail.mergeCells('A6:B6');
                        wsdetail.mergeCells('C1:C2');
                        wsdetail.mergeCells('C5:G5');
                        wsdetail.mergeCells('D1:E2');
                        wsdetail.mergeCells('D3:E3');
                        wsdetail.mergeCells('C6:D6');
                        wsdetail.mergeCells('F6:G6');
                        wsdetail.mergeCells('A7:G7');
                        wsdetail.mergeCells('A8:G8');
                        wsdetail.mergeCells(`A${parseInt(countmerge)+1}:G${parseInt(countmerge)+1}`);
                        wsdetail.mergeCells(`A${parseInt(countmerge)+2+parseInt(Countimage)}:G${parseInt(countmerge)+2+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countmerge)+3+parseInt(Countimage)}:B${parseInt(countmerge)+3+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`C${parseInt(countmerge)+3+parseInt(Countimage)}:D${parseInt(countmerge)+3+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`F${parseInt(countmerge)+3+parseInt(Countimage)}:G${parseInt(countmerge)+3+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countmerge)+4+parseInt(Countimage)}:B${parseInt(countnote)+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`C${parseInt(countmerge)+4+parseInt(Countimage)}:G${parseInt(countnote)+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+1+parseInt(Countimage)}:G${parseInt(countnote)+1+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+2+parseInt(Countimage)}:C${parseInt(countnote)+2+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`E${parseInt(countnote)+2+parseInt(Countimage)}:G${parseInt(countnote)+2+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+3+parseInt(Countimage)}:C${parseInt(countnote)+3+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`E${parseInt(countnote)+3+parseInt(Countimage)}:G${parseInt(countnote)+8+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+5+parseInt(Countimage)}:C${parseInt(countnote)+5+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+6+parseInt(Countimage)}:C${parseInt(countnote)+6+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+7+parseInt(Countimage)}:C${parseInt(countnote)+7+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A${parseInt(countnote)+8+parseInt(Countimage)}:C${parseInt(countnote)+8+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`D${parseInt(countnote)+2+parseInt(Countimage)}:D${parseInt(countnote)+8+parseInt(Countimage)}`);
                        wsdetail.mergeCells(`A9:G${countmerge}`);
                        //STYLE HEADER
                        //B1-B3
                        //style line
                        ['A4:G4'].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        [`D${parseInt(countnote)+2+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: 'ffffff' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                                left: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        [`A${parseInt(countmerge)+2+parseInt(Countimage)}:G${parseInt(countmerge)+2+parseInt(Countimage)}`,].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: 'ffffff' } },
                                right: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        ['B1', 'B2', 'B3', 'C1', 'C3', 'E1', 'E3', 'F1', 'F2', 'F3', 'G1', 'G2', 'G3', 'A5', 'C5', 'A6', 'C6', 'E6', 'F6', 'A7', 'A8', 'A9',
                            `A${parseInt(countmerge)+1}:G${parseInt(countmerge)+1}`, `A${parseInt(countmerge)+3+parseInt(Countimage)}:B${parseInt(countmerge)+3+parseInt(Countimage)}`,
                            `C${parseInt(countmerge)+3+parseInt(Countimage)}:D${parseInt(countmerge)+3+parseInt(Countimage)}`, `F${parseInt(countmerge)+3+parseInt(Countimage)}:G${parseInt(countmerge)+3+parseInt(Countimage)}`, `A${parseInt(countmerge)+4+parseInt(Countimage)}:B${parseInt(countnote)+parseInt(Countimage)}`,
                            `C${parseInt(countmerge)+4}:G${parseInt(countnote)}`, , `E${parseInt(countmerge)+3+parseInt(Countimage)}`,`C${parseInt(countmerge)+4+parseInt(Countimage)}`
                        ].map(key => {
                            wsdetail.getCell(key).border = {
                                right: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        [`A${parseInt(countnote)+2+parseInt(Countimage)}:C${parseInt(countnote)+2+parseInt(Countimage)}`, `E${parseInt(countnote)+2+parseInt(Countimage)}:G${parseInt(countnote)+2+parseInt(Countimage)}`, `E${parseInt(countnote)+3+parseInt(Countimage)}:G${parseInt(countnote)+3+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: '000000' } },
                                left: { style: 'thin', color: { argb: '000000' } },
                                right: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        [`A${parseInt(countnote)+8+parseInt(Countimage)}:C${parseInt(countnote)+8+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: 'ffffff' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        [`A${parseInt(countnote)+7+parseInt(Countimage)}:C${parseInt(countnote)+7+parseInt(Countimage)}`, `A${parseInt(countnote)+6+parseInt(Countimage)}:C${parseInt(countnote)+6+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: 'ffffff' } },
                            };
                        });
                        [`A${parseInt(countnote)+4+parseInt(Countimage)}`, `B${parseInt(countnote)+4+parseInt(Countimage)}`, `C${parseInt(countnote)+4+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).border = {
                                top: { style: 'thin', color: { argb: 'ffffff' } },
                                bottom: { style: 'thin', color: { argb: 'ffffff' } },
                                left: { style: 'thin', color: { argb: 'ffffff' } },
                            };
                        });
                        //style color
                        ['F1', 'F2', 'F3', 'A5', 'A6', 'E6', 'A8', `A${parseInt(countmerge)+1}`, `A${parseInt(countmerge)+3+parseInt(Countimage)}`, `E${parseInt(countmerge)+3+parseInt(Countimage)}`, `A${parseInt(countmerge)+4+parseInt(Countimage)}`, `A${parseInt(countnote)+2+parseInt(Countimage)}`, `E${parseInt(countnote)+2+parseInt(Countimage)}`].map(key => {
                            wsdetail.getCell(key).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '9bc2e6' }
                            };
                        });
                        //style front
                        ['C1', 'C3', 'A5', 'A6', 'E6', `A${parseInt(countmerge)+3+parseInt(Countimage)}`, `E${parseInt(countmerge)+3+parseInt(Countimage)}`, `A${parseInt(countmerge)+4+parseInt(Countimage)}:B${parseInt(countmerge)+6+parseInt(Countimage)}`, `A${parseInt(countnote)+2+parseInt(Countimage)}`, `F${parseInt(countnote)+2+parseInt(Countimage)}`,
                            'D1:E2', 'D3:E3', 'G1', 'G2', 'G3', 'C5:G5', 'C6:D6', 'F6:G6', `C${parseInt(countmerge)+3+parseInt(Countimage)}`, `F${parseInt(countmerge)+3+parseInt(Countimage)}`, `A${parseInt(countnote)+4+parseInt(Countimage)}`, `A${parseInt(countnote)+5+parseInt(Countimage)}`, `A${parseInt(countnote)+6+parseInt(Countimage)}`, `E${parseInt(countnote)+7+parseInt(Countimage)}`, `C${parseInt(countmerge)+4+parseInt(Countimage)}`,
                            `A${parseInt(countmerge)+1}`, `A9:A9`
                        ].map(key => {
                            wsdetail.getCell(key).alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            }
                            wsdetail.getCell(key).font = {
                                name: 'TH SarabunPSK',
                                size: 16,
                                bold: true
                            };
                        });

                        var imageId1 = workbook.addImage({
                            filename: './files/Picture1.png',
                            extension: 'png'
                        });
                        wsdetail.addImage(imageId1, {
                            tl: { col: 0.25, row: 0.9 },
                            ext: { width: 100, height: 50 }
                        });

                        //SET width height SHEET1
                        wsdetail.getColumn('B').width = 11;
                        wsdetail.getColumn('C').width = 20;
                        wsdetail.getColumn('D').width = 45;
                        wsdetail.getColumn('F').width = 16;
                        wsdetail.getColumn('G').width = 20;
                        wsdetail.getRow(`${parseInt(countmerge)+1}`).height = 28;
                        for (var i = 1; i <= 8; i++) {
                            wsdetail.getRow(i).height = 28;
                        }
                        const converdetail = convert(detail, {
                            selectors: [{ selector: 'p', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } }]
                        });

                        //HEADER SHEET1
                        wsdetail.getCell('C1').value = 'ชื่อเอกสาร : ';
                        wsdetail.getCell('C3').value = 'รหัสเอกสาร : ';
                        wsdetail.getCell('F1').value = 'ฉบับที่';
                        wsdetail.getCell('F2').value = 'วันที่มีผลบังคับใช้';
                        wsdetail.getCell('F3').value = 'หมายเลขหน้า';
                        wsdetail.getCell('A5').value = 'บริษัท';
                        wsdetail.getCell('A6').value = 'Project Name';
                        wsdetail.getCell('E6').value = 'วันที่';
                        wsdetail.getCell('A8').value = 'รายละเอียดของงาน';
                        wsdetail.getCell(`A${parseInt(countmerge)+1}`).value = 'ลักษณะแบบ';
                        // console.log(Countimage)
                        if (Countimage != 0) {
                            for (i = 0; i < Countimage; i++) {
                                var Imagedetail = `${Dataimage[i].images}`;
                                var Detailimages = Imagedetail.split(';base64,').pop();
                                fs.writeFile(`Detailimage${[i]}.png`, Detailimages, { encoding: 'base64' }, function(err) {
                                    console.log('File created');
                                });
                                var Detailimage64 = workbook.addImage({
                                    filename: `Detailimage${[i]}.png`,
                                    extension: 'png'
                                });
                                wsdetail.addImage(Detailimage64, {
                                    tl: `C${parseInt(countmerge)+parseInt([i+1])+1}:C${parseInt(countmerge)+parseInt([i+1])+1}`,
                                    ext: { width: 160, height: 150 }
                                });
                                // wsdetail.getCell(`A${parseInt(countmerge)+parseInt([i+1])+1}:A${parseInt(countmerge)+parseInt([i+1])+1}`).alignment = {
                                //     vertical: 'middle', horizontal: 'center'
                                // }
                                wsdetail.getCell(`A${parseInt(countmerge)+parseInt([i+1])+1}:A${parseInt(countmerge)+parseInt([i+1])+1}`).border = {
                                    right: { style: 'thin', color: { argb: '000000' } },
                                    bottom: { style: 'thin', color: { argb: 'ffffff' } },
                                }
                                wsdetail.mergeCells(`A${parseInt(countmerge)+parseInt([i])+2}:G${parseInt(countmerge)+parseInt([i])+2}`);
                                wsdetail.getRow(`${parseInt(countmerge)+parseInt([i+1])+2}`).height = 180;
                                // if (i == '0') {
                                //     wsdetail.addImage(Detailimage64, {
                                //         tl: `A${parseInt(countmerge)+1}:A${parseInt(countmerge)+1}`,
                                //         ext: { width: 160, height: 150 }
                                //     });
                                // } else {
                                //     wsdetail.addImage(Detailimage64, {
                                //         tl: `D${parseInt(countmerge)+1}:D${parseInt(countmerge)+1}`,
                                //         ext: { width: 160, height: 150 }
                                //     });
                                // }
                            }
                        } else {
                            // wsdetail.getCell(`A${parseInt(countmerge)+2}:G${parseInt(countmerge)+2}`).value = '';
                        }

                        wsdetail.getCell(`A${parseInt(countmerge)+3+parseInt(Countimage)}`).value = 'วันที่ดำเนินการ';
                        wsdetail.getCell(`E${parseInt(countmerge)+3+parseInt(Countimage)}`).value = 'จำนวนคนที่ใช้';
                        wsdetail.getCell(`E${parseInt(countmerge)+3+parseInt(Countimage)}`).font = { name: 'TH SarabunPSK', size: 12, bold: true };
                        wsdetail.getCell(`A${parseInt(countmerge)+4+parseInt(Countimage)}`).value = 'หมายเหตุ';
                        wsdetail.getCell(`A${parseInt(countnote)+2+parseInt(Countimage)}`).value = 'ผู้ดำเนินการ';
                        wsdetail.getCell(`F${parseInt(countnote)+2+parseInt(Countimage)}`).value = 'ผู้ตรวจสอบ';
                        wsdetail.getCell('D1:E2').value = `${Servayform[0].form_name}`;
                        wsdetail.getCell('D3:E3').value = `${Servayform[0].form_code}`;
                        wsdetail.getCell('G1').value = `${Servayform[0].no}`;
                        wsdetail.getCell('G2').value = `${Servayform[0].effective_date}`;
                        wsdetail.getCell('G3').value = `1/2`;
                        wsdetail.getCell('C5:G5').value = `${data[0].company_name}`;
                        wsdetail.getCell('C6:D6').value = `${data[0].title}`;
                        wsdetail.getCell('F6:G6').value = `${datenow}`;
                        wsdetail.getCell('A9:A9').value = `${converdetail}`;
                        wsdetail.getCell('A9:A9').alignment = { vertical: 'middle', wrapText: true };
                        wsdetail.getCell(`C${parseInt(countmerge)+3+parseInt(Countimage)}`).value = `….........................${data[0].issue_date}.........................วัน`;
                        wsdetail.getCell(`F${parseInt(countmerge)+3+parseInt(Countimage)}`).value = `…..................${data[0].number_users}.........................คน`;
                        wsdetail.getCell(`C${parseInt(countmerge)+4+parseInt(Countimage)}`).value = `${data[0].remark}`;
                        wsdetail.getCell(`C${parseInt(countmerge)+4+parseInt(Countimage)}`).alignment = { vertical: 'middle', wrapText: true };
                        var base64String = `${data[0].operator_signed}`;
                        var base64Image = base64String.split(';base64,').pop();
                        fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function(err) {
                            // console.log('File created');
                        });
                        var imageIdbase64 = workbook.addImage({
                            filename: 'image.png',
                            extension: 'png'
                        });
                        wsdetail.addImage(imageIdbase64, {
                            tl: `A${parseInt(countnote)+3+parseInt(Countimage)}:C${parseInt(countnote)+3+parseInt(Countimage)}`,
                            ext: { width: 100, height: 30 }
                        });
                        wsdetail.getCell(`A${parseInt(countnote)+4+parseInt(Countimage)}`).value = `ลงชื่อ`;
                        wsdetail.getCell(`A${parseInt(countnote)+4+parseInt(Countimage)}`).alignment = { vertical: 'middle', horizontal: 'right', wrapText: true };
                        wsdetail.getCell(`A${parseInt(countnote)+5+parseInt(Countimage)}`).value = `(… ${data[0].operator_name} …)`;
                        wsdetail.getCell(`A${parseInt(countnote)+5+parseInt(Countimage)}`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        wsdetail.getCell(`A${parseInt(countnote)+6+parseInt(Countimage)}`).value = `ตำแหน่ง: ${data[0].operator_position}`;
                        wsdetail.getCell(`A${parseInt(countnote)+6+parseInt(Countimage)}`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        wsdetail.getCell(`A${parseInt(countnote)+7+parseInt(Countimage)}`).value = `วันที่……${datenow}………`;
                        wsdetail.getCell(`A${parseInt(countnote)+7+parseInt(Countimage)}`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        //END
                        var base64String = `${data[0].operator_signed}`;
                        var base64Image = base64String.split(';base64,').pop();
                        fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function(err) {
                            // console.log('File created');
                        });
                        var imageIdbase64 = workbook.addImage({
                            filename: 'image.png',
                            extension: 'png'
                        });
                        wsdetail.getCell(`E${parseInt(countnote)+7+parseInt(Countimage)}`).value = `ลงชื่อ …${data[0].inspactor_signed}…….\r\n(…${data[0].inspactor_name}….)\r\nตำแหน่ง: …${data[0].inspactor_position}……\r\nวันที่……${datenow}………`;
                        wsdetail.getCell(`E${parseInt(countnote)+7+parseInt(Countimage)}`).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        //END SHEET1







                        //START SHEET2
                        let wsequipment = workbook.addWorksheet('รายการอุปกรณ์');
                        const numberproduct = 30;
                        wsequipment.mergeCells('A1:B3');
                        wsequipment.mergeCells('C1:C2');
                        wsequipment.mergeCells('D1:I2');
                        wsequipment.mergeCells('D3:I3');
                        wsequipment.mergeCells('A4:K4');
                        wsequipment.mergeCells('A5:B5');
                        wsequipment.mergeCells('C5:K5');
                        wsequipment.mergeCells('A6:B6');
                        wsequipment.mergeCells('C6:G6');
                        wsequipment.mergeCells('H6:I6');
                        wsequipment.mergeCells('J6:K6');
                        wsequipment.mergeCells('A7:K7');
                        wsequipment.mergeCells('A8:A9');
                        wsequipment.mergeCells('B8:B9');
                        wsequipment.mergeCells('C8:D9');
                        wsequipment.mergeCells('E8:E9');
                        wsequipment.mergeCells('F8:F9');
                        wsequipment.mergeCells('G8:G9');
                        wsequipment.mergeCells('H8:I8');
                        wsequipment.mergeCells('J8:K9');
                        //ENDHEADER
                        //style line
                        ['A4', 'A7'].map(key => {
                            wsequipment.getCell(key).border = {
                                top: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        ['A1', 'C1', 'C3', 'D1', 'D3', 'J1', 'J2', 'J3', 'K1', 'K2', 'K3', 'A5', 'C5', 'A6', 'C6', 'H6', 'J6', 'A8', 'B8', 'C8', 'E8', 'F8', 'G8', 'H8', 'E8', 'H9', 'I9', 'J8'].map(key => {
                            wsequipment.getCell(key).border = {
                                right: { style: 'thin', color: { argb: '000000' } },
                                bottom: { style: 'thin', color: { argb: '000000' } },
                            };
                        });
                        for (var i = 10; i <= numberproduct; i++) {
                            wsequipment.mergeCells(`C${i}:D${i}`);
                            wsequipment.mergeCells(`J${i}:K${i}`);
                            [`C${i}:D${i}`, `J${i}:K${i}`, `A${i}`, `B${i}`, `E${i}`, `F${i}`, `G${i}`, `H${i}`, `I${i}`].map(key => {
                                wsequipment.getCell(key).border = {
                                    right: { style: 'thin', color: { argb: '000000' } },
                                    bottom: { style: 'thin', color: { argb: '000000' } },
                                };
                            });
                        }
                        //style color
                        ['J1', 'J2', 'J3', 'A5', 'A6', 'H6', 'A8', 'B8', 'C8', 'E8', 'F8', 'G8', 'H8', 'H9', 'I9', 'J8'].map(key => {
                            wsequipment.getCell(key).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: '9bc2e6' }
                            };
                        });
                        //style front
                        ['C1', 'C3', 'A5', 'A6', 'H6', 'D1', 'D3', 'K1', 'K2', 'K3', 'C5', 'C6', 'A8', 'B8', 'C8', 'E8', 'F8', 'G8', 'H8', 'H9', 'I9', 'J8', 'J6'].map(key => {
                            wsequipment.getCell(key).alignment = {
                                vertical: 'middle',
                                horizontal: 'center'
                            }
                            wsequipment.getCell(key).font = {
                                name: 'TH SarabunPSK',
                                size: 16,
                                bold: true
                            };
                        });
                        wsequipment.getCell('A2:B2').alignment = { vertical: 'middle', horizontal: 'center' };
                        wsequipment.getCell('D1:E2').alignment = { vertical: 'middle', horizontal: 'center' };
                        //image
                        var imageId1 = workbook.addImage({
                            filename: './files/Picture1.png',
                            extension: 'png'
                        });
                        wsequipment.addImage(imageId1, {
                            tl: { col: 0.25, row: 0.9 },
                            ext: { width: 100, height: 50 }
                        });

                        //SET width height SHEET2
                        wsequipment.getColumn('B').width = 10;
                        wsequipment.getColumn('C').width = 15;
                        wsequipment.getColumn('D').width = 30;
                        wsequipment.getColumn('J').width = 17;
                        wsequipment.getColumn('K').width = 22;
                        for (var i = 1; i <= 4; i++) {
                            wsequipment.getRow(i).height = 28;
                        }
                        for (var i = 5; i <= 47; i++) {
                            wsequipment.getRow(i).height = 25;
                        }
                        //HEADERSHEEH2
                        wsequipment.getCell('C1').value = 'ชื่อเอกสาร : ';
                        wsequipment.getCell('C3').value = 'รหัสเอกสาร : ';
                        wsequipment.getCell('J1').value = 'ฉบับที่';
                        wsequipment.getCell('J2').value = 'วันที่มีผลบังคับใช้';
                        wsequipment.getCell('J3').value = 'หมายเลขหน้า';
                        wsequipment.getCell('A5').value = 'บริษัท';
                        wsequipment.getCell('A6').value = 'Project Name';
                        wsequipment.getCell('H6').value = 'วันที่';
                        wsequipment.getCell('D1').value = `${Servayform[0].form_name}`;
                        wsequipment.getCell('D3').value = `${Servayform[0].form_code}`;
                        wsequipment.getCell('K1').value = `${Servayform[0].no}`;
                        wsequipment.getCell('K2').value = `${Servayform[0].effective_date}`;
                        wsequipment.getCell('K3').value = `2/2`;
                        wsequipment.getCell('C5').value = `บริษัท เงินติดล้อ จำกัด (มหาชน)`;
                        wsequipment.getCell('C6').value = `เพิ่ม Requirement`;
                        wsequipment.getCell('J6').value = `${datenow}`;
                        wsequipment.getCell('A8').value = 'ลำดับ';
                        wsequipment.getCell('B8').value = 'รหัสสินค้า';
                        wsequipment.getCell('C8').value = 'รายการสินค้า';
                        wsequipment.getCell('E8').value = 'จำนวน';
                        wsequipment.getCell('F8').value = 'หน่วย';
                        wsequipment.getCell('G8').value = 'คงเหลือ';
                        wsequipment.getCell('H8').value = 'stock OSD';
                        wsequipment.getCell('H9').value = 'มี';
                        wsequipment.getCell('I9').value = 'ไม่มี';
                        wsequipment.getCell('J8').value = 'หมายเหตุ';

                        a = 10;
                        for (var i = 0; i < Serveydetail.length; i++) {
                            [`A${a}`, `B${a}`, `C${a}`, `E${a}`, `F${a}`, `G${a}`, `H${a}`, `I${a}`, `J${a}`].map(key => {
                                wsequipment.getCell(key).alignment = {
                                    vertical: 'middle',
                                    horizontal: 'center'
                                }
                                wsequipment.getCell(key).font = {
                                    name: 'TH SarabunPSK',
                                    size: 16,
                                    bold: true
                                };
                            });
                            wsequipment.getCell(`A${a}`).value = `${i+1}`;
                            wsequipment.getCell(`B${a}`).value = `${Serveydetail[i].product_code}`;
                            wsequipment.getCell(`C${a}`).value = `${Serveydetail[i].product_name}`;
                            wsequipment.getCell(`E${a}`).value = `${Serveydetail[i].quantity}`;
                            wsequipment.getCell(`F${a}`).value = `${Serveydetail[i].unit}`;
                            wsequipment.getCell(`G${a}`).value = `${Serveydetail[i].balance}`;
                            if (Serveydetail[i].stock_status == 1) {
                                wsequipment.getCell(`H${a}`).value = `มี`;
                            } else {
                                wsequipment.getCell(`I${a}`).value = `ไม่มี`;
                            }
                            wsequipment.getCell(`J${a}`).value = `${Serveydetail[i].remark}`;
                            a++;
                        }
                        const excelId = uuidv4();
                        console.log(excelId)
                        workbook.xlsx.writeFile(`./files/${excelId}.xlsx`)
                            .then(function() {
                                resolve(excelId)
                            });

                    });
            })
            .catch((err) => {
                resolve(err);
            });
    }
};