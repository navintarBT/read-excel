import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './readExcel.css';
import '@fontsource/noto-sans-lao';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPaperPlane,faPlus } from '@fortawesome/free-solid-svg-icons';

const ReadExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const fileInputRef = useRef(null);
  const [showUpload, setShowUpload] = useState(true); 
  const [showSendMessage, setShowSendMessage] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setShowUpload(false); 
    setShowSendMessage(true); 
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headerRow, ...dataRows] = jsonData;
      const propertyNames = [
        "number", "billNumber", "cod", "keepCode",
        "service", "productName", "receiverName",
        "receiverNumber", "location", "sendDate",
        "sendDateSuccess"
      ];
      setHeaders(propertyNames);

      const formattedData = dataRows.map(row => {
        const formattedRow = {};
        propertyNames.forEach((propName, index) => {
          const cellValue = row[index];
          if (index === 9 && typeof cellValue === 'number') {
            const date = XLSX.SSF.parse_date_code(cellValue);
            formattedRow[propName] = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          } else {
            formattedRow[propName] = cellValue !== undefined ? cellValue : '';
          }
        });
        return formattedRow;
      });

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <header className="header">
        <nav>
          <div className="logo">
            <img src="path/to/logo.png" alt="Logo" />
          </div>
          <div className="menu">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className="action">
            <button className="login-btn">Login</button>
            <button className="signup-btn">Sign Up</button>
          </div>
        </nav>
      </header>
      <div className="table-container">
        {/* Upload Section */}
        {showUpload && (
          <div className='upload'>
            <h1>Send Message</h1>
            <h2>Please select a file to send a message to the customer</h2>
            <button className="upload-btn" onClick={handleButtonClick}>Upload <FontAwesomeIcon icon={faUpload} /></button>
            <input
              type="file"
              accept=".xlsx, .xls"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>
        )}
        
        {/* Send Message Section */}
        {showSendMessage && (
          <div className="content">
            <div className='show-table'>
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
                      {headers.map((header, i) => (
                        <td key={i}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='send-message'>
              <div className='send-head'>
                <h1>Send Message</h1>
              </div>
              <div className='send-body'>
                <button className="icon-circle"onClick={handleButtonClick}>
                  <FontAwesomeIcon icon={faPlus}  />
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
            />
              </div>
              <div className='send-footer'>
                <button className='upload-btn'> Send Message <FontAwesomeIcon icon={faPaperPlane} /></button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="footer">
        <div className='footer-copy'>
          Send message by using API send message
        </div>
      </div>
    </div>
  );
};

export default ReadExcel;
