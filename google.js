import fs from "fs";
import { google } from "googleapis";
import { createReport } from "docx-templates";
import { readFileSync } from "fs";

const credentials = JSON.parse(readFileSync("./credentials.json", "utf8"));
const template = fs.readFileSync("Vorlage_Ergebnisse.docx");

const spreadsheetId = "1Jv9JvuZbE85kw25jQriFkXMee1uExBPf-oDobmwAJbA";

const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  credentials: credentials,
});

const client = await auth.getClient();

const sheets = google.sheets({
  version: "v4",
  auth: client,
});

const metadata = await sheets.spreadsheets.get({
  auth,
  spreadsheetId,
});

// read data from the spreadsheet, get table names
const tableNames = await sheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  // range: "Master!A1:A",
  // the hole row 1 from A to the end of the row
  range: "Master!1:1",
  majorDimension: "ROWS",
});

const tableNamesData = tableNames.data.values[0];

// // rename tableNames from example Wurs-K to WursK
const formattedTableNames = tableNamesData.map((name) =>
  name.replace(/-/g, "").replace(/ /g, "")
);

const renamingTable = {
  HaseÜberaktivität: "HaseHYP",
  HaseLabilität: "HaseLAB",
  HaseReagibilität: "HaseREAL",
  HaseDesorgnisiertheit: "HaseDesorganisiertheit",
  HaseImpulsivität: "HaseIMP",
  GAD7: "GAD",
  MiniSPIN: "SPIN",
  AQK: "AQ",
  MDQA: "MDQ1",
  MDQB: "MDQ2",
  BSLscore: "BSLsumme",
  BSLprozentrang: "BSLprozent",
};

const renamedFormattedTableNames = formattedTableNames.map((name) => {
  if (renamingTable[name]) {
    return renamingTable[name];
  }
  return name;
});

const columnNr1 = await sheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  range: "Master!A:A",
  majorDimension: "COLUMNS",
});

const code = "code2"; // replace with the code you want to search for

const rowOfCode =
  columnNr1.data.values[0].findIndex((value) => value === code) + 1;

// get date from row 2 till the end of the row
const tableData = await sheets.spreadsheets.values.get({
  auth,
  spreadsheetId,
  range: `Master!${rowOfCode}:${rowOfCode}`, // this will get all rows from 2 to the end of the row
  majorDimension: "ROWS",
});

const tableDataValues = tableData.data.values[0];

// join the table names and table data
const table = renamedFormattedTableNames.map((name, index) => ({
  name: name,
  value: tableDataValues[index],
}));

// transdform table to different format
// from {name: "name1", value: "value1"} to {name1: "value1"}
const transformedTable = table.reduce((acc, { name, value }) => {
  acc[name] = value;
  return acc;
}, {});

// // create report

const buffer = await createReport({
  template,
  data: transformedTable,
  cmdDelimiter: ["{{", "}}"],
});

fs.writeFileSync("report.docx", buffer);
