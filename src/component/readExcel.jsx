import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './readExcel.css';
import '@fontsource/noto-sans-lao';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';

const ReadExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const fileInputRef = useRef(null);
  const [showUpload, setShowUpload] = useState(true);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file) => {
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
        "number", "billNumber", "cod", "Cod",
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };
  console.log(isDragging);

  return (
    <div>
      <Header />
      <div className={`table-container ${isDragging ? 'dragging' : ''}`}
       onDrop={handleDrop}
       onDragOver={handleDragOver}
       onDragEnter={handleDragEnter}
       onDragLeave={handleDragLeave}
      >
        {isDragging && <div className="drag-text">Please drop file Excel</div>}
        {showUpload && (
          <UploadSection
            onClick={handleButtonClick}
            fileInputRef={fileInputRef}
            onFileUpload={(e) => handleFileUpload(e.target.files[0])}
          />
        )}
        {showSendMessage && (
          <SendMessageSection
            headers={headers}
            data={data}
            onClick={handleButtonClick}
            fileInputRef={fileInputRef}
            onFileUpload={(e) => handleFileUpload(e.target.files[0])}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

const Header = () => (
  <header className="header">
    <nav>
      <div className="logo">
        <img src="./" alt="Logo" />
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
);

const UploadSection = ({ onClick, fileInputRef, onFileUpload,}) => (
  <div
    className= 'upload '
  >
    <h1>Send Message</h1>
    <h2>Please select a file to send a message to the customer</h2>
    <button className="upload-btn" onClick={onClick}>
    Select Excel Files <br /> ( .xls, .xlsx )<FontAwesomeIcon icon={faUpload} />
    </button>
    <h4>drop Excel file here</h4>
    <input
      type="file"
      accept=".xlsx, .xls"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={onFileUpload}
    />
  </div>
);

const SendMessageSection = ({ headers, data, onClick, fileInputRef, onFileUpload }) => (
  <div className="content">
    <div className="show-table">
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
    <div className="send-message">
      <div className="send-head">
        <h1>Send Message</h1>
      </div>
      <div className="send-body">
        <div className="icon-circle" onClick={onClick}>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileUpload}
        />
      </div>
      <div className="send-footer">
        <button className="send-btn">
          Send Message <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  </div>
);

const Footer = () => (
  <div className="footer">
    <div className="footer-copy">Send message by using API send message</div>
  </div>
);

export default ReadExcel;