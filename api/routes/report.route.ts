import express from "express";
import fs from "fs";
import { google } from "googleapis";
import { createReport } from "docx-templates";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const report = router.get("/", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Code parameter is required" });
    }

    // Load credentials and template
    const credentials = JSON.parse(
      readFileSync(path.join(__dirname, "../auth/credentials.json"), "utf8")
    );
    const template = fs.readFileSync(
      path.join(__dirname, "../templates/Vorlage_Ergebnisse.docx")
    );

    const spreadsheetId = process.env.GOOGLE_DOC_SHEET_ID || "";

    // Set up Google Sheets API authentication
    const auth = new google.auth.GoogleAuth({
      scopes: [
        process.env.GOOGLE_API_SERVICE ||
          "https://www.googleapis.com/auth/spreadsheets",
      ],
      credentials: credentials,
    });

    const sheets = google.sheets({
      version: "v4",
      auth: auth,
    });

    // Get table names from the first row
    const tableNames = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Master!1:1",
      majorDimension: "ROWS",
    });

    const tableNamesData = tableNames.data.values[0];

    // Format table names
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
      PIDt1: "PIDA",
      PIDt2: "PIDB",
      PIDt3: "PIDC",
      PIDt4: "PIDD",
      PIDt5: "PIDF",
    };

    const renamedFormattedTableNames = formattedTableNames.map((name) => {
      if (renamingTable[name]) {
        return renamingTable[name];
      }
      return name;
    });

    // Find the row with the specified code
    const columnNr1 = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Master!A:A",
      majorDimension: "COLUMNS",
    });

    const rowOfCode =
      columnNr1.data.values[0].findIndex((value) => value === code) + 1;

    if (rowOfCode === 0) {
      return res
        .status(404)
        .json({ error: `Code '${code}' not found in spreadsheet` });
    }

    // Get data for the specified code
    const tableData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `Master!${rowOfCode}:${rowOfCode}`,
      majorDimension: "ROWS",
    });

    const tableDataValues = tableData.data.values[0];

    // Join table names and data
    const table = renamedFormattedTableNames.map((name, index) => ({
      name: name,
      value: tableDataValues[index],
    }));

    // Transform to object format
    const transformedTable = table.reduce((acc, { name, value }) => {
      acc[name] = value;
      return acc;
    }, {});

    // Generate report
    const buffer = await createReport({
      template,
      data: transformedTable,
      cmdDelimiter: ["{{", "}}"],
      failFast: false,
    });

    // Set headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${code}_report.docx"`
    );
    res.setHeader("Content-Length", buffer.length);

    // Send the buffer as response
    res.send(buffer);
  } catch (error) {
    console.error("Error generating report:", error);
    if (Array.isArray(error)) {
      // Template errors
      res
        .status(400)
        .json({ error: "Template processing errors", details: error });
    } else {
      res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  }
});

export default report;
