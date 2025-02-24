import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './readExcel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPaperPlane, faPlus, faCommentDots, faFileAlt ,faCheck,faEdit, faTrash,faArrowLeft,faBars,faFontAwesome} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp,faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import logo from '../logo/systory_logo_final-1-e1578037567378.png';
import Swal from 'sweetalert2';

const ReadExcel = () => {
  //event page
  const [selectChoice, setSelectChoice] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showPageInitial, setShowPageInitial] = useState(false);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [showSendMessenger, setShowSendMessenger] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showCreatePromptPage, setShowCreatePromptPage] = useState(false);
  const [showListMessage, setShowListMessage] = useState(false);
  const [showListTemplate, setShowListTemplate] = useState(false);
  const [showMessengerTemplateList, setShowMessengerTemplateList] = useState(false);
  const [showMessengerMessageList, setShowMessengerMessageList] = useState(false);

  //state normal
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingShow, setIsDraggingShow] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [messengerToEdit, setMessengerToEdit] = useState(null);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [invalidPhoneNumbers, setInvalidPhoneNumbers] = useState([]);
  const [indexColumn, setIndexColumn] = useState(null);
  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState([]);
  const [optionSend, setOptionSend] = useState(false);
  const [dataPage, setDatapage] = useState(null);
  const [statusTemplate, setStatusTemplate] = useState(false);
  const [statusMessage, setStatusMessage] = useState(false);
  const [addFromMessenger, setAddFromMessenger] = useState(null);
  const [getAmountSend, setGetAmountSend] = useState(parseInt(localStorage.getItem('amountSend'), 10) || 0);
  const today = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem('lastUpdateDate') || '';
  if (lastDate !== today) {
    setGetAmountSend(0);
    localStorage.setItem('amountSend', 0);
    localStorage.setItem('lastUpdateDate', today); 
  }

  const handleFileUpload = (file) => {
    const validExtensions = ['xlsx', 'xls'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File Type',
      text: 'Please upload a Excel file.',
    });
    return;
  }
    const reader = new FileReader();
    if(optionSend == true){
      setShowSendMessage(false);
      if(addFromMessenger == 'addFromMessenger'){
      setShowPageInitial(true)
    }else{
      setShowPageInitial(true)
      }
    }else{
      setShowSendMessage(true);
      setShowPageInitial(false);
    }
    setShowMessengerTemplateList(false);
    setShowMessengerMessageList(false);
    setShowContent(true);
    setShowUpload(false);
    setShowCreateMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setIndexColumn(null)
    setShowSendMessenger(false);
    setShowCreatePromptPage(false)
    setInvalidPhoneNumbers([]);
    setTemplateToEdit(null);
    setMessageToEdit(null);
    setPhoneNumberEmpty([]);
    setPhoneNumberEmpty([]);
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log(jsonData);

      // Loop through rows and cells to check types
      jsonData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          console.log(`Row ${rowIndex + 1}, Column ${colIndex + 1}:`, cell, 'Type:', typeof cell);
        });
      });

      let headerRowIndex = -1;
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row.some((cell) => cell !== undefined && cell !== null && cell !== '')) {
          headerRowIndex = i;
          break;
        }
      }
      if (headerRowIndex === -1) {
        return;
      }
      const headerRow = jsonData[headerRowIndex];
      const dataRows = jsonData.slice(headerRowIndex + 1);
      setHeaders(headerRow);
      const formattedData = dataRows.map((row) => {
        const formattedRow = {};
        headerRow.forEach((header, index) => {
          const cellValue = row[index];
          if (header === 'sendDate' && typeof cellValue === 'number') {
            const date = XLSX.SSF.parse_date_code(cellValue);
            formattedRow[header] = `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
          } else {
            formattedRow[header] = cellValue !== undefined ? cellValue : '';
          }
        });
        return formattedRow;
      });
      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleButtonClick = (e) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    if(e =='addFromMessenger'){
      setAddFromMessenger('addFromMessenger');
    }
  };

  //when click select whatsapp and messenger
  const handleToggleSendMessage = (e) => {
    if(e == true) {
    setStatusMessage(true)
    setStatusTemplate(true)
    }else{
    setStatusMessage(false)
    setStatusTemplate(false)
    }
    setOptionSend(e === true);
    setSelectChoice(false);
    setShowUpload(true);
    setShowPageInitial(false);
    setShowSendMessage(false);
    setShowSendMessenger(false);
    setShowCreateMessage(false);
    setShowCreateTemplate(false);
    setShowCreatePromptPage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowMessengerTemplateList(false);
    setShowMessengerMessageList(false);
  }
//when click create message
  const handleToggleMessage = (e) => {
    if(e == true) {
      setStatusMessage(true);
    }
    setShowMessengerMessageList(false)
    setShowCreateMessage(true);
    setShowSendMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowPageInitial(false);
    setShowSendMessenger(false);
    setShowCreatePromptPage(false)
  };
  const handleTogglePromptPage = () => {
    setShowCreateMessage(false);
    setShowSendMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowPageInitial(false);
    setShowSendMessenger(false);
    setShowCreatePromptPage(true)
  };

  const handleToggleBackHome = (e) => {
    if(e == true) {
    setSelectChoice(true);
    setShowUpload(false);
    setShowPageInitial(false);
    setShowContent(false);
    }else{
    setShowUpload(false);
    setShowPageInitial(false);
    setShowContent(true);
    }
    setShowSendMessenger(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    
  };

  const handleToggleSendWhatsapp = (e) => {
    setShowSendMessenger(true);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowUpload(false)
    setShowContent(true)
    setShowPageInitial(false);
    setDatapage(e)

  };
  const handleToggleBackPageInitial = () => {
    setShowSendMessage(false);
    setShowPageInitial(true);
    setShowContent(true);
    setShowUpload(false);
    setShowCreateMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowSendMessenger(false);
    setDatapage(null)
  }

  const handleToggleTemplate = (e) => {
      if (e == true) {
        setStatusTemplate(true);
      }
    setShowMessengerTemplateList(false)
    setShowSendMessenger(false);
    setShowCreateTemplate(true);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowPageInitial(false);

  };

  const handleToggleSave = (e) => {
    if (e == true) {
    setShowListMessage(false);
    setShowMessengerMessageList(true);
    }else{
    setShowListMessage(true);
    setShowMessengerMessageList(false);
    }

    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
  };

  const handleToggleSaveTemplate = (e) => {
    if (e == true) {
    setShowListTemplate(false);
    setShowMessengerTemplateList(true);
    }else{
    setShowListTemplate(true);
    setShowMessengerTemplateList(false);
    }
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
  };

  const handleToggleSavePage = () => {
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowPageInitial(true);
    setShowCreatePromptPage(false)
  };

  const handleToggleCancel = (e) => {
    if (e == true) {
    setShowSendMessage(false);
    setShowSendMessenger(true);
    }else{
    setShowSendMessage(true);
    setShowSendMessenger(false);
    }
    setShowCreateTemplate(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
  };

  const handleToggleCancelCreatePage = () => {
    setShowSendMessage(false);
    setShowSendMessenger(true);
    setShowCreateTemplate(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowCreatePromptPage(false);
  };

  const handleToggleTemplateList = (status) => {
    setShowCreateTemplate(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowSendMessage(!status);
    setShowListTemplate(status);
  };

  const handleToggleMessageList = (status) => {
    setShowCreateTemplate(false);
    setShowSendMessage(!status);
    setShowCreateMessage(false);
    setShowListTemplate(false);
    setShowListMessage(status);
  };

  const handleToggleMessengerTemplateList = (e) => {
    if (e == true) {
      setShowMessengerTemplateList(false);
      setShowSendMessenger(true);
    }else{
      setShowMessengerTemplateList(true);
      setShowSendMessenger(false);
    }
    setShowCreateTemplate(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowSendMessage(false);
    setShowListTemplate(false);
    setShowPageInitial(false);
  };

  const handleToggleMessengerMessageList = (e) => {
    if (e === true) {
    setShowMessengerMessageList(false);
    setShowSendMessenger(true);
    }else{
    setShowMessengerMessageList(true);
    setShowSendMessenger(false);
    }
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListTemplate(false);
    setShowListMessage(false);
    setShowPageInitial(false);
  };

  const handleEditMessage = (message,status) => {
    if (status === true) {
    setStatusMessage(true)
    }
    setShowMessengerMessageList(false)
    setMessageToEdit(message);
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(true);
    setShowListTemplate(false);
    setShowListMessage(false);
  };

  const handleEditMessenger = (page) => {
    setMessengerToEdit(page);
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListTemplate(false);
    setShowListMessage(false);
    setShowCreatePromptPage(true);
    setShowPageInitial(false);
  };

  const handleEditTemplate = (message,status) => {
    if (status === true) {
    setStatusTemplate(true)
    }
    setShowMessengerTemplateList(false)
    setTemplateToEdit(message);
    setShowCreateTemplate(true);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListTemplate(false);
    setShowListMessage(false);
  };
  //--------------------------------

  const spinnerComponent = (status) => {
    setShowSpinner(status)
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const showSelectChoiceElement = document.querySelector('.select-choice');
    if (showSelectChoiceElement) {
      setIsDragging(false);
      setIsDraggingShow(false)
    } else {
    handleFileUpload(file);
    setIsDragging(false);
    setIsDraggingShow(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const showTableElement = document.querySelector('.show-table');
    const showSelectChoiceElement = document.querySelector('.select-choice');
    if(showSelectChoiceElement){
      setIsDragging(false);
      setIsDraggingShow(false)
    }else{
      if (showTableElement) {
        setIsDraggingShow(true)
      } else {
        setIsDragging(true);
      }
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
      setIsDraggingShow(false)
    }
  };

  const clearToEdit = (e) => {
    if(e== "clear-message"){
    setMessageToEdit(null);
    }else if(e== "clear-template"){
    setTemplateToEdit(null);
    }else if(e== "clear-messenger"){
    setMessengerToEdit(null);
    }
  };

const checkPhoneInvalid = async (ids, indexColumn, emptyIndexes) => {
  let getId = [];
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  const fetchPromises = ids.map(({ id, index }) => {
    var urlencoded = new URLSearchParams();
    urlencoded.append("token", "98o1ib90jhvrmm38");
    urlencoded.append("page", "1");
    urlencoded.append("limit", "10");
    urlencoded.append("status", "all");
    urlencoded.append("sort", "desc");
    urlencoded.append("id", id);
    urlencoded.append("referenceId", "");
    urlencoded.append("from", "");
    urlencoded.append("to", "");
    urlencoded.append("ack", "");
    urlencoded.append("msgId", "");
    urlencoded.append("start_date", "");
    urlencoded.append("end_date", "");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    return fetch("https://api.ultramsg.com/instance108372/messages?" + urlencoded, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.messages[0].status === "invalid") {
          const phoneNumber = result.messages[0].to.replace("85620", "").replace("@c.us", "");
          getId.push({ phoneNumber: phoneNumber, index: index });
        }
      })
      .catch(error => { return error });
  });

  Promise.all(fetchPromises)
    .then(() => {
      setInvalidPhoneNumbers(getId);
      setIndexColumn(indexColumn);
      setPhoneNumberEmpty(emptyIndexes);
    })
    .catch(error => {
      return error;
    });
};

  return (
    <div>
      {showSpinner && 
      <div className="spinner-overlay">
       <div className="spinner d-flex flex-column align-items-center">
        <div className="spinner-border" role="status"></div>
        <span className="loading">Loading...</span>
      </div>
    </div>}
      <Header />
      <div
        className={`table-container ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {isDragging && <div className="drag-text">Please drop Excel file</div>}
        {selectChoice && (
          <SelectChoice
            onClick={handleToggleSendMessage}
          />
        )}
        {showUpload && (
          <UploadSection
            onClick={handleButtonClick}
            fileInputRef={fileInputRef}y
            onFileUpload={(e) => handleFileUpload(e.target.files[0])}
          />
        )}
        {showContent && (<div className="content">
        <div className={`show-table ${isDraggingShow ? 'dragging' : ''}`}>
        {isDraggingShow && <div className="drag-text-table" >Please drop Excel file</div>}
          <table >
            <thead >
              <tr>
                {headers.map((header, index) => (
                  <th key={index} style={{ backgroundColor: isDraggingShow ? " " : "#f2f2f2" }}>{header}</th>
                ))}
              </tr>
          </thead>
          <tbody>
            {data.map((row, index) => {
            let phoneNumber = '';
            if (indexColumn !== null && indexColumn !== undefined && headers[indexColumn]) {
              phoneNumber = row[headers[indexColumn]]?.toString().trim() || '';
            }
            const isEmptyRow = phoneNumberEmpty?.includes(index) || false;
            const isInvalid = invalidPhoneNumbers.some(item => item.phoneNumber === phoneNumber && item.index === index);
            return (
              <tr 
                key={index} 
                className={`${isInvalid ? 'invalid-phone' : ''} ${isEmptyRow ? 'empty-phone' : ''}`}
              >
                {/* {11111} */}
                {headers.map((header, i) => {
                  const cellData = row[header];
                  const displayValue = cellData instanceof Date 
                    ? cellData.toLocaleDateString()  
                    : cellData;
                  return (
                    <td key={i}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          </tbody>
          </table>
        </div>
          {showPageInitial && (
          <PageInitial
          onToggleMessageList={handleToggleMessengerMessageList}
          handleEditMessenger={handleEditMessenger}
          headers={headers}
          data={data}
          checkPhoneInvalid={checkPhoneInvalid}
          SpinnerComponent={spinnerComponent}
          setIndexColumn={setIndexColumn}
          setPhoneNumberEmpty={setPhoneNumberEmpty}
          onToggleMessage={handleTogglePromptPage}
          handleToggleSendWhatsapp={handleToggleSendWhatsapp}
          handleToggleBackHome={handleToggleBackHome}

            />
          )}
          {showSendMessage && (
          <SendMessageSection
          onClick={handleButtonClick}
          fileInputRef={fileInputRef}
          onFileUpload={(e) => handleFileUpload(e.target.files[0])}
          onToggleMessage={handleToggleMessage}
          onToggleTemplate={handleToggleTemplate}
          onToggleTemplateList={handleToggleTemplateList}
          onToggleMessageList={handleToggleMessageList}
          getAmountSend={getAmountSend}
          handleToggleBackHome={handleToggleBackHome}
            />
          )}
          {showSendMessenger && (
          <MessengerDetail
          onClick={handleButtonClick}
          fileInputRef={fileInputRef}
          onFileUpload={(e) => handleFileUpload(e.target.files[0])}
          onToggleMessage={handleToggleMessage}
          onToggleTemplate={handleToggleTemplate}
          onToggleTemplateList={handleToggleMessengerTemplateList}
          onToggleMessageList={handleToggleMessengerMessageList}
          handleToggleBackPageInitial={handleToggleBackPageInitial}
          handleTogglePromptPage={handleTogglePromptPage}
            />
          )}
          {showCreateMessage && 
          <CreateMessageSection 
          onToggleSave ={handleToggleSave} 
          onToggleCancel ={handleToggleCancel}
          statusMessage={statusMessage}
          messageToEdit={messageToEdit}
          clearToEdit={clearToEdit}
          />}
          {showCreateTemplate && 
          <CreateTemplate
          onToggleSave ={handleToggleSaveTemplate} 
          onToggleCancel ={handleToggleCancel} 
          templateToEdit={templateToEdit}
          statusTemplate={statusTemplate}
          clearToEdit={clearToEdit}
          />}
           {showCreatePromptPage && 
          <CreatePromptPage
          onToggleSave ={handleToggleSavePage} 
          onToggleCancel ={handleToggleCancelCreatePage} 
          messengerToEdit={messengerToEdit}
          clearToEdit={clearToEdit}
          dataPage={dataPage}
          />}
           {showListMessage && 
          <MessageList
          onToggleMessageList={handleToggleMessageList}
          onEditMessage={handleEditMessage}
          headers={headers}
          data={data}
          checkPhoneInvalid={checkPhoneInvalid}
          SpinnerComponent={spinnerComponent}
          setIndexColumn={setIndexColumn}
          setGetAmountSend={setGetAmountSend}
          getAmountSend={getAmountSend}
          setPhoneNumberEmpty={setPhoneNumberEmpty}
          onToggleMessage={handleToggleMessage}
          />}

           {showListTemplate && 
          <TemplateList
          onToggleTemplateList={handleToggleTemplateList}
          onEditTemplate={handleEditTemplate}
          headers={headers}
          data={data}
          checkPhoneInvalid={checkPhoneInvalid}
          SpinnerComponent={spinnerComponent}
          setIndexColumn={setIndexColumn}
          setGetAmountSend={setGetAmountSend}
          getAmountSend={getAmountSend}
          setPhoneNumberEmpty={setPhoneNumberEmpty}
          onToggleTemplate={handleToggleTemplate}
          />}
            {showMessengerTemplateList && 
          <MessengerTemplateList
          onToggleTemplateList={handleToggleMessengerTemplateList}
          onEditTemplate={handleEditTemplate}
          headers={headers}
          data={data}
          checkPhoneInvalid={checkPhoneInvalid}
          SpinnerComponent={spinnerComponent}
          setIndexColumn={setIndexColumn}
          setPhoneNumberEmpty={setPhoneNumberEmpty}
          onToggleTemplate={handleToggleTemplate}
          dataPage={dataPage}
          />}
          {showMessengerMessageList && 
          <MessengerMessageList
          onToggleMessageList={handleToggleMessengerMessageList}
          handleEditMessenger={handleEditMessenger}
          headers={headers}
          data={data}
          checkPhoneInvalid={checkPhoneInvalid}
          SpinnerComponent={spinnerComponent}
          setIndexColumn={setIndexColumn}
          setPhoneNumberEmpty={setPhoneNumberEmpty}
          onToggleMessage={handleToggleMessage}
          dataPage={dataPage}
          onEditMessage={handleEditMessage}
          />}
          
        </div>)}
      </div>
      <Footer />
    </div>
  );
};

const Header = () => (
  <header className="header">
    <nav>
      <div className="logo">
        <img src={logo} alt="Logo" />
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
        <FontAwesomeIcon icon={faBars} style={{  height: '25px' }} />
      </div>
    </nav>
  </header>
);

const SelectChoice = ({ onClick }) => (
  <div className='select-choice'>
    <h1>Select For Send</h1>
    <h2>Please select a choice to send a message </h2>
    <div className='messenger-whatsapp'>
    <button className="messenger" onClick={()=>onClick(true)}>
        <FontAwesomeIcon icon={faFacebookMessenger} /> <br />Messenger
    </button>
    <button className="whatsapp" onClick={()=>onClick(false)}>
        <FontAwesomeIcon icon={faWhatsapp} /> <br /> WhatsApp
    </button>
    </div>
  </div>
);

const UploadSection = ({ onClick, fileInputRef, onFileUpload }) => (
  <div className='upload'>
    <h1>Send Message</h1>
    <h2>Please select a file to send a message </h2>
    <button className="upload-btn" onClick={onClick}>
       Select Excel Files <br /> (.xls, .xlsx) <FontAwesomeIcon icon={faUpload} />
    </button>
    <input
      type="file"
      accept=".xlsx, .xls"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={onFileUpload}
    />
    <h4>Please drop excel file here</h4>

  </div>
);

const SendMessageSection = ({onClick, fileInputRef, onFileUpload, onToggleMessage, onToggleTemplate,
  onToggleMessageList,onToggleTemplateList,getAmountSend,handleToggleBackHome }) => (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h2>Send Message</h2>
        <h3>Total messages sent:<label className='amount'> {getAmountSend}</label></h3>
        </div>
      </div>
      <div className="send-body-list">
        <div className="icon-circle" onClick={onClick} data-tooltip="Add new file">
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className="icon-circle" onClick={onToggleMessage} data-tooltip="Add Message">
          <FontAwesomeIcon icon={faCommentDots} />
        </div>
        <div className="icon-circle" onClick={onToggleTemplate} data-tooltip="Add Template">
          <FontAwesomeIcon icon={faFileAlt} />
        </div>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileUpload}
        />
      </div>
      <div className='list-message'>
      <button className="btn-list" onClick={onToggleTemplateList}>
      Template List <FontAwesomeIcon icon={faUpload} /> 
    </button>
    <button className="btn-list" onClick={onToggleMessageList}>
       Message List <FontAwesomeIcon icon={faUpload} />
    </button>
    <button className="send-btn" onClick ={() =>handleToggleBackHome(true)}>
        <FontAwesomeIcon icon={faArrowLeft}  />Cancel
        </button>
      </div>
      <div className="send-footer">
      </div>
    </div>
);

const CreateMessageSection = ({onToggleSave,onToggleCancel,messageToEdit,clearToEdit,statusMessage}) => {
  const [message, setMessage] = useState(messageToEdit ? messageToEdit.message : '');
  const [messageName, setMessageName] = useState(messageToEdit ? messageToEdit.name : '');
  const title = messageToEdit
  ? { header: 'Update Message', button: 'Update Message', title: 'Update your Message'}
  : { header: 'Add Message', button: 'Save Message',title: 'Please create your Message'};
  const handleSave = () => {
    if (!messageName || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: !messageName ? 'Message Name cannot be empty.' : 'Message cannot be empty.',
      });
      return;
    }
    
    let messageData = {
      name: messageName,
      message: message,
    };
    const existingMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const updatedMessages = messageToEdit
      ? existingMessages.map((msg) => (msg.name === messageToEdit.name ? messageData : msg))
      : [...existingMessages, messageData];
  
    try {
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      if(statusMessage){
      onToggleSave(true);
      }else{
      onToggleSave();
      }
      clearToEdit("clear-message");
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Local storage is full. Please clear some space and try again.',
        });
      } 
    }
  };

  const handleCancel = () => {
    if (messageToEdit) {
      if (statusMessage == true) {
        onToggleSave(true);
      } else {
        onToggleSave();
      }
    } else {
      if (statusMessage == true) {
        onToggleCancel(true);
      } else {
        onToggleCancel();
      }
    }
    clearToEdit("clear-message");
  };

  return (
    <div className="send-message">
      <div className="send-head">
        <h2>{title.header}</h2>
      </div>
      <div className="send-body">

        <div className='textarea-container'>
          <h2>{title.title}</h2>

          <div className='message-name'>
            <label>Message Name:</label>
            <input type="text" 
            value={messageName}
            onChange={(e) => setMessageName(e.target.value)}/>
          </div>
          <div className='message-name-content'>
            <label>Message:</label>
          </div>
          <textarea
            className='textarea'
            placeholder="Enter your message here"
            rows="10"
            cols="50"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className='btn-add'>
        <button className='btn-save-add' onClick={handleSave}>{title.button}</button>
        <button className='btn-cancel-add' onClick={handleCancel}>Cancel</button>
      </div>
      </div>
  );
};

const CreateTemplate = ({onToggleSave,onToggleCancel,templateToEdit,clearToEdit,statusTemplate}) => { 
  const [template, setTemplate] = useState(templateToEdit? templateToEdit.template : '');
  const [templateName, setTemplateName] = useState(templateToEdit? templateToEdit.name : '');
  const title = templateToEdit
  ? { header: 'Update Template', button: 'Update Template', title: 'Update your Template'}
  : { header: 'Add Template', button: 'Save Template',title: 'Please create your template'};

const handleSave = () => {
  if (!templateName || !template) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: !templateName ? 'Template Name cannot be empty.' : 'Template cannot be empty.',
    });
    return;
  }
  let templateData = {
    name: templateName,
    template: template,
  };
  const existingMessages = JSON.parse(localStorage.getItem('template')) || [];
  const updatedMessages = templateToEdit
    ? existingMessages.map((msg) => (msg.name === templateToEdit.name ? templateData : msg))
    : [...existingMessages, templateData];

  try {
    localStorage.setItem('template', JSON.stringify(updatedMessages));
    if (statusTemplate === true) {
      onToggleSave(true);
    } else {
      onToggleSave();
    }
    clearToEdit("clear-template");
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Local storage is full. Please clear some space and try again.',
      });
    } 
  }
};

  const handleCancel = () => {
    if (templateToEdit) {
      if (statusTemplate == true) {
        onToggleSave(true);
      } else {
        onToggleSave();
      }
    } else {
      if (statusTemplate == true) {
        onToggleCancel(true);
      } else {
        onToggleCancel();
      }
    }
    clearToEdit("clear-template");
  };
  return(
  <div className="send-message">
  <div className="send-head">
    <h2>{title.header}</h2>
  </div>
  <div className="send-body">
  <div className='textarea-container'>
    <h2>{title.title}</h2>
    <div className='message-name'>
            <label>Template Name:</label>
            <input type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
             />
          </div>
          <div className='message-name-content'>
            <label>Template:</label>
          </div>
    <textarea className='textarea'
    placeholder="Enter your message here"
     rows="10" 
     cols="50"
     value={template}
     onChange={(e) => setTemplate(e.target.value)}
     ></textarea>
    </div>
  </div>
  <div className='btn-add'>
    <button className='btn-save-add' onClick={handleSave}>{title.button}</button>
    <button className='btn-cancel-add'onClick={handleCancel}>Cancel</button>
  </div>
</div>
);
}
const MessageList = ({ onToggleMessageList, onEditMessage,headers,data,SpinnerComponent,
  checkPhoneInvalid,setIndexColumn,getAmountSend,setGetAmountSend,setPhoneNumberEmpty,onToggleMessage }) => {
  const [existingMessage, setExistingMessage] = useState(() => {
  const storedMessages = localStorage.getItem('messages');
  return storedMessages ? JSON.parse(storedMessages).reverse() : [];
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [indexCol, setIndexCol] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedRadioOption, setSelectedRadioOption] = useState('sendAll');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);

  const handleSave = async () => {
    console.log(selectedData);
    if (!sendMessage || selectedData.length <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: !sendMessage ? 'Select a message, please.' : 'Select the phone number column, please.',
      });
      return;
    }
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'Select a phone number, please.',
      });
      return;
    }
    const emptyIndexes = selectedData
  .map((item, index) => (item === "" ? index : -1))
  .filter(index => index !== -1);
    setPhoneNumberEmpty([])
    setIndexColumn(null)
    SpinnerComponent(true);
    let getId = [];
    let checkError = [];
    const fetchPromises = (selectedRadioOption === 'selectSend' ? selectedPhoneNumber : selectedData.map((value, index) => ({ value, index }))).map((item) => {
    const dataItem = selectedRadioOption === 'selectSend' ? item.value : item.value;
      if (dataItem) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", "98o1ib90jhvrmm38");
        urlencoded.append("to", `+85620${dataItem}`);
        urlencoded.append("body", `${sendMessage}`);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };

        return fetch("https://api.ultramsg.com/instance108372/messages/chat", requestOptions)
          .then(response => response.json())
          .then((result) => {
            if (result.error) {
            SpinnerComponent(false);
            checkError.push(result.error);
          }else{
            getId.push({id:result.id,index:item.index});
          }
          })
          .catch((error) => {
           SpinnerComponent(false);
           checkError.push(error);
          });
      }
      return Promise.resolve();
    });
    await Promise.all(fetchPromises).then(() => {
      if (checkError.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Message sending failed: Daily limit exceeded or instance closed.",
        });
        return;
      }else{
        setTimeout(async () => {
          const count = getId.length;
          localStorage.setItem('amountSend', getAmountSend + count);
          setGetAmountSend(getAmountSend + count);
          if(selectedRadioOption === 'selectSend'){
            await checkPhoneInvalid(getId, indexCol,[]);
          }else{
          await checkPhoneInvalid(getId, indexCol,emptyIndexes);
          }
          SpinnerComponent(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'All messages have been sent successfully.',
          });
        }, 5000);
      }
  })
   
  };

  const handleCancel = () => {
    onToggleMessageList(false);
  };

  const handleSelectMessage = (index,template) => {
    if (selectedMessage === index) {
      setSelectedMessage(null); 
      setSendMessage(null); 
      return;
  }
    setSendMessage(template.message);
    setSelectedMessage(index);
  };

  const handleEdit = (index) => {
    const messageToEdit = existingMessage[index];
    onEditMessage(messageToEdit);
  };

  const handleDelete = (index) => {
    const updatedTemplates = existingMessage.filter((_, i) => i !== index);
    localStorage.setItem('messages', JSON.stringify(updatedTemplates.reverse()));
    setExistingMessage(updatedTemplates.reverse()); 
    setSelectedMessage(null);
    setSendMessage(null);
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      let selectedData = data.map(row => row[selectedIndex]);
      const nonNumberValues = selectedData.filter(value => isNaN(value));
      if (nonNumberValues.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Select the phone number column, please.',
        });
        setShowRadio(false);
        setSelectedData([]);
        return;
      }else{
      selectedData = selectedData.map(value => (value.toString().length === 8 ? value : ""));
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
      }
    }
    if (selectedIndex === "") {
      setShowRadio(false);
      setSelectedData([]);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedRadioOption(e.target.value);
    if (e.target.value === 'selectSend') {
      setShowPhoneNumber(true);
    } else {
      setShowPhoneNumber(false);
    }
  };

  const handleSelectPhoneNumber = (value, index) => {
    setSelectedPhoneNumber((prev) => {
      const updatedSelection = prev.some((item) => item.index === index)
        ? prev.filter((item) => item.index !== index)
        : [...prev, { value, index }];
      return updatedSelection.length === 0 ? [] : updatedSelection;
    });
  };
  
  return (
    <div className="send-message">
      <div className="send-head">
        <div className='amount-send'>
        <h2>Message List</h2>
        <h3>Total messages sent:<label className='amount'> {getAmountSend}</label></h3>
        </div>
      </div>
      <div className='add-message-list'>
      <div className="icon-add-message" onClick={onToggleMessage}data-tooltip="Add message">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div className="message-item-container">
        {existingMessage.map((template, index) => (
          <div key={index} className="message-item">
            <div className="action-container">
              <div className="control-checked"onClick={() => handleSelectMessage(index,template)}>
                {selectedMessage === index && (
                  <div className="icon-checked">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </div>
              <button value={template.template} onClick={() => handleSelectMessage(index,template)}>
                {template.name.length > 22 ? `${template.name.slice(0, 22)}...` : template.name}
              </button>
              <div className="icon-edit" onClick={() => handleEdit(index)}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className="icon-delete" onClick={() => handleDelete(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='dropdown-container'>
          <div className='dropdown-phone-container'>
            <label>Select Phone Number Column:</label>
            <select className='dropdown-select' value={selectedOption} onChange={handleDropdownChange}>
            <option value="" >Select a column...</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
          </div>
          {showRadio &&(<div className='choice-send'>
            <label className={`radio-button ${selectedRadioOption === 'sendAll' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="sendAll"
                checked={selectedRadioOption === 'sendAll'}
                onChange={handleOptionChange}
              />
              Send to all
            </label>
            <label className={`radio-button ${selectedRadioOption === 'selectSend' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="selectSend"
                checked={selectedRadioOption === 'selectSend'}
                onChange={handleOptionChange}
              />
              Select to send
          </label>
            </div>)}
            {showPhoneNumber && (
            <div className="selected-phone-number">
              <label>Select Phone Numbers:</label>
              <div className="select-phone-control">
                {selectedData.map((value, originalIndex) => (
                  value && value.toString().length === 8 && (
                    <div className="select-phone" key={originalIndex}>
                      <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, originalIndex)}>
                        {selectedPhoneNumber.some((item) => item.index === originalIndex) && (
                          <div className="icon-checked">
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectPhoneNumber(value, originalIndex)}
                        className={selectedPhoneNumber.some((item) => item.index === originalIndex) ? "selected" : ""}
                      >
                        {value.length > 18 ? `${value.slice(0, 18)}...` : value}
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          </div>
      <div className='btn-add'>
        <button className='btn-save-add' onClick={handleSave}>Send Message<FontAwesomeIcon icon={faPaperPlane}/></button>
        <button className='btn-cancel-add' onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};
//222
const TemplateList = ({ onToggleTemplateList,onEditTemplate,headers,data,SpinnerComponent,
  checkPhoneInvalid,setIndexColumn,getAmountSend,setGetAmountSend,setPhoneNumberEmpty,onToggleTemplate }) => {
    const [existingTemplate, setExistingTemplate] = useState(() => {
      const storedTemplate = localStorage.getItem('template');
      return storedTemplate ? JSON.parse(storedTemplate).reverse() : [];
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedData, setSelectedData] = useState([]);
  const [sendTemplate, setSendTemplate] = useState(null);
  const [indexCol, setIndexCol] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedRadioOption, setSelectedRadioOption] = useState('sendAll');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);
  const handleSave = async () => {
    if (!sendTemplate || selectedData.length <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: !sendTemplate ? 'Select a template, please.' : 'Select the phone number column, please.',
      });
      return;
    }
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'Select a phone number, please.',
      });
      return;
    }
    const emptyIndexes = selectedData
    .map((item, index) => (item === "" ? index : -1))
    .filter(index => index !== -1);

    setPhoneNumberEmpty([])
    setIndexColumn(null)
    SpinnerComponent(true);
    let getId = [];
    let checkError = [];
    const fetchPromises = (selectedRadioOption === 'selectSend' ? selectedPhoneNumber : selectedData.map((value, index) => ({ value, index }))).map((item) => {
      const dataItem = selectedRadioOption === 'selectSend' ? item.value : item.value;
      const template = sendTemplate[selectedRadioOption === 'selectSend' ? item.index : item.index];
      if (dataItem) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", "98o1ib90jhvrmm38");
        urlencoded.append("to", `+85620${dataItem}`);
        urlencoded.append("body", `${template}`);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };

        return fetch("https://api.ultramsg.com/instance108372/messages/chat", requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.error) {
              SpinnerComponent(false);
              checkError.push(result.error);
            }else{
            getId.push({id:result.id,index:item.index});
            }
          })
          .catch(error => {
            SpinnerComponent(false);
            checkError.push(error);
          });
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises).then(() => {
      if (checkError.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Message sending failed: Daily limit exceeded or instance closed.",
        });
        return;
      }else{
        setTimeout(async () => {
          const count = getId.length;
          localStorage.setItem('amountSend', getAmountSend + count);
          setGetAmountSend(getAmountSend + count);
          if(selectedRadioOption === 'selectSend'){
          await checkPhoneInvalid(getId, indexCol,[]);
          }else{
          await checkPhoneInvalid(getId, indexCol,emptyIndexes);
          }
          SpinnerComponent(false);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Template have been sent successfully.',
          });
        }, 5000);
      }
  })
    
  };

  const handleCancel = () => {
    onToggleTemplateList(false);
  };

  const handleSelectTemplate = (index, template) => {
    if (selectedTemplate === index) {
      setSelectedTemplate(null); 
      setSendTemplate(null); 
      return;
    }
    let templateValue = template.template;
    templateValue = templateValue.replace(/{{{+/g, '{{').replace(/}}}+/g, '}}');
    const regex = /{{\s*([a-zA-Z0-9_ก-๙ກ-ໝ\s]+)\s*}}/g;
    const updatedTemplates = data.map((row) => {
      return templateValue.replace(regex, (_, key) => {
        key = key.trim();
        const cellValue = row[key];
      if (cellValue instanceof Date) {
        return cellValue.toLocaleDateString();
      }
        return row[key] !== undefined ? row[key] : '';
      });
    });
    setSendTemplate(updatedTemplates.length > 0 ? updatedTemplates : ['']);
    setSelectedTemplate(index);
  };

  const handleEdit = (index) => {
    const messageToEdit = existingTemplate[index];
    onEditTemplate(messageToEdit);
  };

  const handleDelete = (index) => {
    const updatedTemplates = existingTemplate.filter((_, i) => i !== index);
    localStorage.setItem('template', JSON.stringify(updatedTemplates.reverse()));
    setExistingTemplate(updatedTemplates.reverse()); 
    setSelectedTemplate(null);
    setSendTemplate(null);
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      let selectedData = data.map(row => row[selectedIndex]);
      const nonNumberValues = selectedData.filter(value => isNaN(value));
      if (nonNumberValues.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Warning',
          text: 'Select the phone number column, please.',
        });
        setShowRadio(false);
        setSelectedData([]);
        return;
      }else{
      selectedData = selectedData.map(value => (value.toString().length === 8 ? value : ""));
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
      }
    }
    if (selectedIndex === "") {
      setShowRadio(false);
      setSelectedData([]);
    }
  };

  const handleOptionChange = (e) => {
    setSelectedRadioOption(e.target.value);
    if (e.target.value === 'selectSend') {
      setShowPhoneNumber(true);
    } else {
      setShowPhoneNumber(false);
    }
  };

  const handleSelectPhoneNumber = (value, index) => {
    setSelectedPhoneNumber((prev) => {
      const updatedSelection = prev.some((item) => item.index === index)
        ? prev.filter((item) => item.index !== index)
        : [...prev, { value, index }];
      return updatedSelection.length === 0 ? [] : updatedSelection;
    });
  };

  return (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h2>Template List</h2>
        <h3>Total messages sent:<label className='amount'> {getAmountSend}</label></h3>
        </div>
      </div>
      <div className='add-message-list'>
      <div className="icon-add-message"onClick={onToggleTemplate} data-tooltip="Add template">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div className="message-item-container">
        {existingTemplate.map((template, index) => (
          <div key={index} className="message-item">
            <div className="action-container">
              <div className="control-checked" onClick={() => handleSelectTemplate(index, template)}>
              {selectedTemplate === index && (
                  <div className="icon-checked">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </div>
              <button value={template.template} onClick={() => handleSelectTemplate(index,template)}>
                {template.name.length > 18 ? `${template.name.slice(0, 18)}...` : template.name}
              </button>
              <div className="icon-edit" onClick={() => handleEdit(index,template)}data-tooltip="edit">
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className="icon-delete" onClick={() => handleDelete(index)}data-tooltip="delete">
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='dropdown-container'>
          <div className='dropdown-phone-container'>
            <label>Select Phone Number Column:</label>
            <select className='dropdown-select'value={selectedOption} onChange={handleDropdownChange}>
            <option value="">Select a column...</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
           </div>
           {showRadio &&(<div className='choice-send'>
            <label className={`radio-button ${selectedRadioOption === 'sendAll' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="sendAll"
                checked={selectedRadioOption === 'sendAll'}
                onChange={handleOptionChange}
              />
              Send to all
            </label>
            <label className={`radio-button ${selectedRadioOption === 'selectSend' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="selectSend"
                checked={selectedRadioOption === 'selectSend'}
                onChange={handleOptionChange}
              />
              Select to send
          </label>
            </div>)}
            {showPhoneNumber && (
            <div className="selected-phone-number">
              <label>Select Phone Number:</label>
              <div className="select-phone-control">
                {selectedData.map((value, originalIndex) => (
                  value && value.toString().length === 8 && (
                    <div className="select-phone" key={originalIndex}>
                      <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, originalIndex)}>
                        {selectedPhoneNumber.some((item) => item.index === originalIndex) && (
                          <div className="icon-checked">
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectPhoneNumber(value, originalIndex)}
                        className={selectedPhoneNumber.some((item) => item.index === originalIndex) ? "selected" : ""}
                      >
                        {value.length > 18 ? `${value.slice(0, 18)}...` : value}
                      </button>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
          </div>
      <div className="btn-add">
        <button className="btn-save-add" onClick={handleSave}>
          Send Template <FontAwesomeIcon icon={faPaperPlane}/>
        </button>
        <button className="btn-cancel-add" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};
//-------------------------------------Messenger sole---------------------------------
const PageInitial = ({handleToggleBackHome,handleEditMessenger,onToggleMessage,handleToggleSendWhatsapp }) => {
  const [existingMessage, setExistingMessage] = useState(() => {
  const storedMessages = localStorage.getItem('page');
  return storedMessages ? JSON.parse(storedMessages).reverse() : [];
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const handleSave = async () => {
    if(!selectedPage){
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please select a page.',
      });
      return;
    }
    handleToggleSendWhatsapp(selectedPage);
  };

  const handleSelectMessage = (index, template) => {
    if (selectedMessage === index) {
      setSelectedMessage(null);
      setSelectedPage(null);
      return;
    }
    setSelectedPage(template);
    setSelectedMessage(index);
  };

  const handleEdit = (index) => {
    const pageToEdit = existingMessage[index];
    handleEditMessenger(pageToEdit);
  };

  const handleDelete = (index) => {
    const updatedTemplates = existingMessage.filter((_, i) => i !== index);
    localStorage.setItem('page', JSON.stringify(updatedTemplates.reverse()));
    setExistingMessage(updatedTemplates.reverse()); 
    setSelectedMessage(null);
  };

  return (
    <div className="send-message">
      <div className="send-head">
        <div className='amount-send'>
        <h2>Page List</h2>
        <h3>Select Some Page</h3>
        </div>
      </div> 
      <div className='add-message-list'>
      <div className="icon-add-message" onClick={onToggleMessage}data-tooltip="Add Page">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div className="message-item-container">
        {existingMessage.map((template, index) => (
          <div key={index} className="message-item">
            <div className="action-container">
              <div className="control-checked"onClick={() => handleSelectMessage(index,template)}>
                {selectedMessage === index && (
                  <div className="icon-checked">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </div>
              <button value={template.template} onClick={() => handleSelectMessage(index,template)}>
                {template.name.length > 22 ? `${template.name.slice(0, 22)}...` : template.name}
              </button>
              <div className="icon-edit" onClick={() => handleEdit(index)}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className="icon-delete" onClick={() => handleDelete(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='btn-add'>
        <button className='btn-save-add' onClick={handleSave}>Confirm Page<FontAwesomeIcon icon={faPaperPlane}/></button>
        <button className='btn-cancel-add' onClick={()=>handleToggleBackHome(true)}>Cancel</button>
      </div>
    </div>
  );
};
const MessengerDetail = ({onClick, fileInputRef, onFileUpload, onToggleMessage, onToggleTemplate,
  onToggleMessageList,onToggleTemplateList,handleTogglePromptPage,handleToggleBackPageInitial }) => (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h2>Messenger</h2> 
        <h3>Send message by use messenger</h3>
        </div>
      </div>
      <div className="send-body-list">
        <div className="icon-circle" onClick={()=>onClick('addFromMessenger')} data-tooltip="Add new file">
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className="icon-circle" onClick={()=>onToggleMessage(true)} data-tooltip="Add Message">
          <FontAwesomeIcon icon={faCommentDots} />
        </div>
        <div className="icon-circle" onClick={()=>onToggleTemplate(true)} data-tooltip="Add Template">
          <FontAwesomeIcon icon={faFileAlt} />
        </div>
        <div className="icon-circle" onClick={handleTogglePromptPage} data-tooltip="Add Page">
          <FontAwesomeIcon icon={faFontAwesome} />
        </div>
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={onFileUpload}
        />
      </div>
      <div className='list-message'>
      <button className="btn-list" onClick={onToggleTemplateList}>
      Template List <FontAwesomeIcon icon={faUpload} /> 
    </button>
    <button className="btn-list" onClick={onToggleMessageList}>
       Message List <FontAwesomeIcon icon={faUpload} />
    </button>
    <button className="send-btn" onClick ={()=>handleToggleBackPageInitial()}>
        <FontAwesomeIcon icon={faArrowLeft}  />Cancel
        </button>
      </div>
      <div className="send-footer">
      </div>
    </div>
);

const CreatePromptPage = ({onToggleSave,onToggleCancel,messengerToEdit,clearToEdit,dataPage}) => { 
  console.log(dataPage);
  const [pageName, setPageName] = useState(messengerToEdit? messengerToEdit.name : '');
  const [pageId, setPageId] = useState(messengerToEdit? messengerToEdit.pageId : '');
  const [accessToken, setAccessToken] = useState(messengerToEdit? messengerToEdit.accessToken : '');
  const title = messengerToEdit
  ? { header: 'Update Page', button: 'Update Page', title: 'Update your Page'}
  : { header: 'Add Page', button: 'Save Page',title: 'Create your Page'};

const handleSave = () => {
  const showWarning = (text) => {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text,
    });
  };
  
  if (!pageName) return showWarning('Page Name cannot be empty.');
  if (!pageId) return showWarning('Page ID cannot be empty.');
  if (!accessToken) return showWarning('Access Token cannot be empty.');

  let templateData = {
    name: pageName,
    pageId: pageId,
    accessToken: accessToken
  };
  const existingMessages = JSON.parse(localStorage.getItem('page')) || [];
  const updatedMessages = messengerToEdit
    ? existingMessages.map((msg) => (msg.name === messengerToEdit.name ? templateData : msg))
    : [...existingMessages, templateData];

  try {
    localStorage.setItem('page', JSON.stringify(updatedMessages));
    onToggleSave();
    clearToEdit("clear-messenger");
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Local storage is full. Please clear some space and try again.',
      });
    } 
  }
};

  const handleCancel = () => {
    if(dataPage){
    messengerToEdit? onToggleSave() :onToggleCancel()
    }else{
        onToggleSave() 
    }
    clearToEdit("clear-messenger");
  };
  return(
  <div className="send-message">
  <div className="send-head">
    <h2>{title.header}</h2>
  </div>
  <div className="send-body">
  <div className='textarea-container'>
    <h2>{title.title}</h2>
    <div className='message-name'>
            <label>Page Name:</label>
            <input type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
             />
          </div>
          <div className='message-name'>
            <label>Page ID:</label>
            <input type="text"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
             />
          </div>
          <div className='message-name-content'>
            <label>Access Token:</label>
          </div>
    <textarea className='textarea'
    placeholder="Enter your Access Token here"
     rows="10" 
     cols="50"
     value={accessToken}
     onChange={(e) => setAccessToken(e.target.value)}
     ></textarea>
    </div>
  </div>
  <div className='btn-add'>
    <button className='btn-save-add' onClick={handleSave}>{title.button}</button>
    <button className='btn-cancel-add'onClick={handleCancel}>Cancel</button>
  </div>
</div>
);
}

const MessengerMessageList = ({ onToggleMessageList, onEditMessage,headers,data,SpinnerComponent,
  checkPhoneInvalid,setIndexColumn,setPhoneNumberEmpty,onToggleMessage,dataPage }) => {
  const [existingMessage, setExistingMessage] = useState(() => {
  const storedMessages = localStorage.getItem('messages');
  return storedMessages ? JSON.parse(storedMessages).reverse() : [];
  });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedData, setSelectedData] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [indexCol, setIndexCol] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedRadioOption, setSelectedRadioOption] = useState('sendAll');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);

  const handleSave = async () => {
    if (!sendMessage || !selectedData) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: !sendMessage ? 'Select a message, please.' : 'Select the customer name column, please.',
      });
      return;
    }
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'Select a customer name, please.',
      });
      return;
    }
    const emptyIndexes = selectedData
    .map((item, index) => (item === "" ? index : -1))
    .filter(index => index !== -1);
    setPhoneNumberEmpty([])
    setIndexColumn(null)
    SpinnerComponent(true);
    let getId = [];
    let getInvalidName = [];
    let filteredCustomers = [];
    try {
      const getData = `https://pages.fm/api/v1/pages/${dataPage.pageId}/conversations?access_token=${dataPage.accessToken}`;
      const getResponse = await fetch(getData, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await getResponse.json();
      if (result.success === false) {
       SpinnerComponent(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Access_Token or Page_ID is invalid',
        });
        return;
      }
      filteredCustomers = result.conversations.reduce((acc, dataFromGet) => {
        selectedData.forEach((name, index) => {
          if (name === dataFromGet.from.name && !acc.some(item => item.name === name && item.index === index)) {
            acc.push({ name, id: dataFromGet.id, index });
          }
        });
        return acc;
      }, []);

      selectedData.forEach((name, index) => {
        if (!filteredCustomers.some(customer => customer.index === index)) {
          emptyIndexes.push(index);
        }
      });
    } catch (error) {
      return error;
    }
    if (selectedRadioOption === 'selectSend') {
      const matchedIndexes = new Set();
      filteredCustomers = filteredCustomers
          .filter(item => {
              const isMatched = selectedPhoneNumber.some(phone => phone.index === item.index);
              if (isMatched) {
                  matchedIndexes.add(item.index);
              }
              return isMatched;
          })
          .map(dataFromGet => ({ id: dataFromGet.id, name: dataFromGet.name, index: dataFromGet.index }));
      selectedPhoneNumber.forEach(phone => {
          if (!matchedIndexes.has(phone.index)) {
            getInvalidName.push(phone.index);
          }
      });
  }
    const fetchPromises = filteredCustomers.map(async (item) => {
      const dataItem = item;
      if (dataItem) {
        try {
          const postData = `https://pages.fm/api/v1/pages/${dataPage.pageId}/conversations/${dataItem.id}/messages?access_token=${dataPage.accessToken}&&action=reply_inbox`;
          await fetch(postData, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: sendMessage}),
          });
          
      } catch (error) {
        return error;
      }
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises);
    setTimeout(async () => {
      if(selectedRadioOption === 'selectSend'){
        await checkPhoneInvalid(getId, indexCol,getInvalidName);
      }else{
      await checkPhoneInvalid(getId, indexCol,emptyIndexes);
      }
      SpinnerComponent(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'All messages have been sent successfully.',
      });
    },);
  };

  const handleCancel = () => {
    onToggleMessageList(true);
  };

  const handleSelectMessage = (index,template) => {
    if (selectedMessage === index) {
      setSelectedMessage(null); 
      setSendMessage(null); 
      return;
  }
    setSendMessage(template.message);
    setSelectedMessage(index);
  };

  const handleEdit = (index) => {
    const messageToEdit = existingMessage[index];
    onEditMessage(messageToEdit,true);
  };

  const handleDelete = (index) => {
    const updatedTemplates = existingMessage.filter((_, i) => i !== index);
    localStorage.setItem('messages', JSON.stringify(updatedTemplates.reverse()));
    setExistingMessage(updatedTemplates.reverse()); 
    setSelectedMessage(null);
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      const selectedData = data.map(row => row[selectedIndex]);
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
    }
    if(selectedIndex == ""){
      setSelectedData("");
      setShowRadio(false);
      }
  };

  const handleOptionChange = (e) => {
    setSelectedRadioOption(e.target.value);
    if (e.target.value === 'selectSend') {
      setShowPhoneNumber(true);
    } else {
      setShowPhoneNumber(false);
    }
  };

  const handleSelectPhoneNumber = (value, index) => {
    setSelectedPhoneNumber((prev) => {
      const updatedSelection = prev.some((item) => item.index === index)
        ? prev.filter((item) => item.index !== index)
        : [...prev, { value, index }];
      return updatedSelection.length === 0 ? [] : updatedSelection;
    });
  };
  
  return (
    <div className="send-message">
      <div className="send-head">
        <div className='amount-send'>
        <h2>Message List</h2>
        <h3>Message List For Send Messenger</h3>
        </div>
      </div> 
      <div className='add-message-list'>
      <div className="icon-add-message" onClick={onToggleMessage}data-tooltip="Add message">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div className="message-item-container">
        {existingMessage.map((template, index) => (
          <div key={index} className="message-item">
            <div className="action-container">
              <div className="control-checked"onClick={() => handleSelectMessage(index,template)}>
                {selectedMessage === index && (
                  <div className="icon-checked">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </div>
              <button value={template.template} onClick={() => handleSelectMessage(index,template)}>
                {template.name.length > 22 ? `${template.name.slice(0, 22)}...` : template.name}
              </button>
              <div className="icon-edit" onClick={() => handleEdit(index)}>
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className="icon-delete" onClick={() => handleDelete(index)}>
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='dropdown-container'>
          <div className='dropdown-phone-container'>
            <label>Select Customer Name Column:</label>
            <select className='dropdown-select' value={selectedOption} onChange={handleDropdownChange}>
            <option value="">Select a column...</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
          </div>
          {showRadio &&(<div className='choice-send'>
            <label className={`radio-button ${selectedRadioOption === 'sendAll' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="sendAll"
                checked={selectedRadioOption === 'sendAll'}
                onChange={handleOptionChange}
              />
              Send to all
            </label>
            <label className={`radio-button ${selectedRadioOption === 'selectSend' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="selectSend"
                checked={selectedRadioOption === 'selectSend'}
                onChange={handleOptionChange}
              />
              Select to send
          </label>
            </div>)}
            {showPhoneNumber && (
            <div className="selected-phone-number">
              <label>Select Customer Name:</label>
              <div className="select-phone-control">
                {Array.from(new Set(selectedData.map((value, originalIndex) => ({ value, originalIndex }))))
                  .filter(({ value }) => value)
                  .map(({ value, originalIndex }) => (
                    <div className="select-phone" key={originalIndex}>
                      <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, originalIndex)}>
                        {selectedPhoneNumber.some((item) => item.index === originalIndex) && (
                          <div className="icon-checked">
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectPhoneNumber(value, originalIndex)}
                        className={selectedPhoneNumber.some((item) => item.index === originalIndex) ? "selected" : ""}
                      >
                        {value.length > 18 ? `${value.slice(0, 18)}...` : value}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
          </div>
      <div className='btn-add'>
        <button className='btn-save-add' onClick={handleSave}>Send Template<FontAwesomeIcon icon={faPaperPlane}/></button>
        <button className='btn-cancel-add' onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

const MessengerTemplateList = ({ onToggleTemplateList,onEditTemplate,headers,data,SpinnerComponent,
  checkPhoneInvalid,setIndexColumn,setPhoneNumberEmpty,onToggleTemplate,dataPage }) => {
    const [existingTemplate, setExistingTemplate] = useState(() => {
      const storedTemplate = localStorage.getItem('template');
      return storedTemplate ? JSON.parse(storedTemplate).reverse() : [];
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedData, setSelectedData] = useState(null);
  const [sendTemplate, setSendTemplate] = useState(null);
  const [indexCol, setIndexCol] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedRadioOption, setSelectedRadioOption] = useState('sendAll');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);
  
  const handleSave = async () => {
    if (!sendTemplate || !selectedData) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: !sendTemplate ? 'Select a template, please.' : 'Select the customer name column, please.',
      });
      return;
    }
    
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'warning',
        text: 'Select a customer name, please.',
      });
      return;
    }
    const emptyIndexes = selectedData
    .map((item, index) => (item === "" ? index : -1))
    .filter(index => index !== -1);

    setPhoneNumberEmpty([])
    setIndexColumn(null)
    SpinnerComponent(true);
    let getId = [];
    let getInvalidName = [];
  let filteredCustomers = [];
  try {
    const getData = `https://pages.fm/api/v1/pages/${dataPage.pageId}/conversations?access_token=${dataPage.accessToken}`;
    const getResponse = await fetch(getData, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
        const result = await getResponse.json();
        if (result.success === false) {
          SpinnerComponent(false);
           Swal.fire({
             icon: 'error',
             title: 'Error',
             text: 'Access_Token or Page_ID is invalid',
           });
           return;
         }
      filteredCustomers = result.conversations.reduce((acc, dataFromGet) => {
        selectedData.forEach((name, index) => {
          if (name === dataFromGet.from.name) {
            acc.push({ name, id: dataFromGet.id, index });
          }
        });
        return acc;
      }, []);

      selectedData.forEach((name, index) => {
        if (!filteredCustomers.some(customer => customer.index === index)) {
          emptyIndexes.push(index);
        }
      });
    } catch (error) {
      return error;
    }
  if (selectedRadioOption === 'selectSend') {
    const matchedIndexes = new Set();
    filteredCustomers = filteredCustomers
        .filter(item => {
            const isMatched = selectedPhoneNumber.some(phone => phone.index === item.index);
            if (isMatched) {
                matchedIndexes.add(item.index);
            }
            return isMatched;
        })
        .map(dataFromGet => ({ id: dataFromGet.id, name: dataFromGet.name, index: dataFromGet.index }));
    selectedPhoneNumber.forEach(phone => {
        if (!matchedIndexes.has(phone.index)) {
          getInvalidName.push(phone.index);
        }
    });
}
  const fetchPromises = filteredCustomers.map(async (item) => {
    const dataItem = item;
    const template = sendTemplate[dataItem.index];
    if (dataItem) {
      try {
        const postData = `https://pages.fm/api/v1/pages/${dataPage.pageId}/conversations/${dataItem.id}/messages?access_token=${dataPage.accessToken}&&action=reply_inbox`;
        let a = await fetch(postData, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: template }),
        });
      } catch (error) {
        return error;
      }
    }
    return Promise.resolve();
  });

    await Promise.all(fetchPromises);
    setTimeout(async () => {
      if(selectedRadioOption === 'selectSend'){
      await checkPhoneInvalid(getId, indexCol,getInvalidName);
      }else{
      await checkPhoneInvalid(getId, indexCol,emptyIndexes);
      }
      SpinnerComponent(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Template have been sent successfully.',
      });
    },);
  };
 
  const handleCancel = () => {
    onToggleTemplateList(true);
  };

  const handleSelectTemplate = (index, template) => {
    if (selectedTemplate === index) {
      setSelectedTemplate(null); 
      setSendTemplate(null); 
      return;
    }
    let templateValue = template.template;
    templateValue = templateValue.replace(/{{{+/g, '{{').replace(/}}}+/g, '}}');
    const regex = /{{\s*([a-zA-Z0-9_ก-๙ກ-ໝ\s]+)\s*}}/g;
    const updatedTemplates = data.map((row) => {
      return templateValue.replace(regex, (_, key) => {
        key = key.trim();
        const cellValue = row[key];
      if (cellValue instanceof Date) {
        return cellValue.toLocaleDateString();
      }
        return row[key] !== undefined ? row[key] : '';
      });
    });
    setSendTemplate(updatedTemplates.length > 0 ? updatedTemplates : ['']);
    setSelectedTemplate(index);
  };

  const handleEdit = (index) => {
    const messageToEdit = existingTemplate[index];
    onEditTemplate(messageToEdit,true);
  };

  const handleDelete = (index) => {
    const updatedTemplates = existingTemplate.filter((_, i) => i !== index);
    localStorage.setItem('template', JSON.stringify(updatedTemplates.reverse()));
    setExistingTemplate(updatedTemplates.reverse()); 
    setSelectedTemplate(null);
    setSendTemplate(null);
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      const selectedData = data.map(row => row[selectedIndex]);
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
    }
    if(selectedIndex == ""){
      setSelectedData("");
      setShowRadio(false);
      }
  };

  const handleOptionChange = (e) => {
    setSelectedRadioOption(e.target.value);
    if (e.target.value === 'selectSend') {
      setShowPhoneNumber(true);
    } else {
      setShowPhoneNumber(false);
    }
  };

  const handleSelectPhoneNumber = (value, index) => {
    setSelectedPhoneNumber((prev) => {
      const updatedSelection = prev.some((item) => item.index === index)
        ? prev.filter((item) => item.index !== index)
        : [...prev, { value, index }];
      return updatedSelection.length === 0 ? [] : updatedSelection;
    });
  };

  return (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h2>Template List</h2>
        <h3>Template List For Send Messenger</h3>
        </div>
      </div>
      <div className='add-message-list'>
      <div className="icon-add-message"onClick={onToggleTemplate} data-tooltip="Add template">
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
      <div className="message-item-container">
        {existingTemplate.map((template, index) => (
          <div key={index} className="message-item">
            <div className="action-container">
              <div className="control-checked" onClick={() => handleSelectTemplate(index, template)}>
              {selectedTemplate === index && (
                  <div className="icon-checked">
                    <FontAwesomeIcon icon={faCheck} />
                  </div>
                )}
              </div>
              <button value={template.template} onClick={() => handleSelectTemplate(index,template)}>
                {template.name.length > 18 ? `${template.name.slice(0, 18)}...` : template.name}
              </button>
              <div className="icon-edit" onClick={() => handleEdit(index,template)}data-tooltip="edit">
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className="icon-delete" onClick={() => handleDelete(index)}data-tooltip="delete">
                <FontAwesomeIcon icon={faTrash} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='dropdown-container'>
          <div className='dropdown-phone-container'>
            <label>Select Customer Name Column:</label>
            <select className='dropdown-select'value={selectedOption} onChange={handleDropdownChange}>
            <option value="">Select a column...</option>
              {headers.map((header, index) => (
                <option key={index} value={header}>{header}</option>
              ))}
            </select>
           </div>
           {showRadio &&(<div className='choice-send'>
            <label className={`radio-button ${selectedRadioOption === 'sendAll' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="sendAll"
                checked={selectedRadioOption === 'sendAll'}
                onChange={handleOptionChange}
              />
              Send to all
            </label>
            <label className={`radio-button ${selectedRadioOption === 'selectSend' ? 'selected' : ''}`}>
              <input
                type="radio"
                value="selectSend"
                checked={selectedRadioOption === 'selectSend'}
                onChange={handleOptionChange}
              />
              Select to send
          </label>
            </div>)}
            {showPhoneNumber && (
              <div className="selected-phone-number">
                <label>Select Customer Name:</label>
                <div className="select-phone-control">
                  {selectedData.map((value, originalIndex) => (
                    value && (
                      <div className="select-phone" key={originalIndex}>
                        <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, originalIndex)}>
                          {selectedPhoneNumber.some((item) => item.index === originalIndex) && (
                            <div className="icon-checked">
                              <FontAwesomeIcon icon={faCheck} />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleSelectPhoneNumber(value, originalIndex)}
                          className={selectedPhoneNumber.some((item) => item.index === originalIndex) ? "selected" : ""}
                        >
                          {value.length > 18 ? `${value.slice(0, 18)}...` : value}
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
      <div className="btn-add">
        <button className="btn-save-add" onClick={handleSave}>
          Send Template <FontAwesomeIcon icon={faPaperPlane}/>
        </button>
        <button className="btn-cancel-add" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const Footer = () => (
  <div className="footer">
    <div className="footer-copy">Send message by using API send message</div>
  </div>
);

export default ReadExcel;