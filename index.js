import { createReport } from 'docx-templates';
import fs from 'fs';

const template = fs.readFileSync('Vorlage_Ergebnisse.docx');



//load xlsx file 

import xlsx from 'xlsx';
const workbook = xlsx.readFile('data.xlsx');


const worksheet = workbook.Sheets['MASTER'];

const tableNames = xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0];

//
// Compare tableNames with JSON from tableNames to ensure even tables without data are included. Replace empty values with null
const allTables = tableNames.map(name => {
    const tableData = xlsx.utils.sheet_to_json(worksheet, { header: 1, range: name });
    if (tableData.length === 0) {
        return { [name]: null }; // Return null for empty tables
    }
    return { [name]: tableData };
}
);

// log all variables to console without  ... 59 more items
console.log('Table Names:', tableNames);
console.log('All Tables:', allTables);
// Log the entire allTables object without truncation
console.log(JSON.stringify(allTables, null, 2)); // Pretty print the object with indentation
// Log each table's data
allTables.forEach(table => {
    const tableName = Object.keys(table)[0];
    console.log(`Table: ${tableName}`, table[tableName]);
});
// Log the entire allTables object without truncation
console.log('All Tables:', allTables);





// //get row with code "xyz123" in column 'Code'
// const codeToFind = 'dia05318';
// const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
// const rowWithCode = data.find(row => row[0] === codeToFind);

// const  jsonData = rowWithCode.reduce((acc, value, index) => {
//     acc[tableNames[index]] = value;
//     return acc;
// }
// , {});

// // rename tableNames from example Wurs-K to WursK 
// const formattedTableNames = tableNames.map(name => name.replace(/-/g, '').replace(/ /g, ''));


// // create jsonData with formattedTableNames
// const formattedJsonData = rowWithCode.reduce((acc, value, index) => {
//     acc[formattedTableNames[index]] = value;
//     return acc;
// }, {});



// // object to rename 

// const renameObject = {
    
//     HaseÜberaktivität: 'HaseHYP',
//     HaseLabilität: 'HaseLAB',
//     HaseReagibilität: 'HaseREAL',
//     HaseDesorgnisiertheit: 'HaseDesorganisiertheit',
//     HaseImpulsivität: 'HaseIMP',
//     GAD7: 'GAD',
//     MiniSPIN: 'SPIN',
//     AQK: 'AQ',
// }
    
    
// // rename keys in formattedJsonData using renameObject
// Object.keys(renameObject).forEach(key => {
//     if (formattedJsonData[key] !== undefined) {
//         formattedJsonData[renameObject[key]] = formattedJsonData[key];
//         delete formattedJsonData[key];
//     }
// });
    







// // create report 

// const buffer = await createReport({
//     template,
//     data: formattedJsonData,
//     cmdDelimiter: ['{{', '}}'],
//   });
  
//   fs.writeFileSync('report.docx', buffer)

