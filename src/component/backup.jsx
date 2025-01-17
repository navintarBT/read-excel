import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './readExcel.css';
import '@fontsource/noto-sans-lao';

const ReadExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headerRow, ...dataRows] = jsonData;
      setHeaders(headerRow);
      setData(dataRows.map(row => {
        return headerRow.map((_, colIndex) => {
          const cellValue = row[colIndex];
          if (colIndex === 9 && typeof cellValue === 'number') { // Check if the column index is 9 and the value is a number
            const date = XLSX.SSF.parse_date_code(cellValue);
            return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          }
          return cellValue !== undefined ? cellValue : '';
        });
      }));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
            {console.log(row)}

              {row.map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReadExcel;