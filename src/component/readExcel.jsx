import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import './readExcel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPaperPlane, faPlus, faCommentDots, faFileAlt ,faCheck,faEdit, faTrash,faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import logo from '../logo/systory_logo_final-1-e1578037567378.png';
import Swal from 'sweetalert2';

const ReadExcel = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const fileInputRef = useRef(null);
  const [showUpload, setShowUpload] = useState(true);
  const [showSendMessage, setShowSendMessage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingShow, setIsDraggingShow] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const [showListTemplate, setShowListTemplate] = useState(false);
  const [showListMessage, setShowListMessage] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState(null);
  const [templateToEdit, setTemplateToEdit] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [invalidPhoneNumbers, setInvalidPhoneNumbers] = useState([]);
  const [indexColumn, setIndexColumn] = useState(null);
  const [phoneNumberEmpty, setPhoneNumberEmpty] = useState([]);
  const [getAmountSend, setGetAmountSend] = useState(parseInt(localStorage.getItem('amountSend'), 10) || 0);
  const today = new Date().toISOString().split('T')[0];
  const lastDate = localStorage.getItem('lastUpdateDate') || '';
  if (lastDate !== today) {
    setGetAmountSend(0);
    localStorage.setItem('amountSend', 0);
    localStorage.setItem('lastUpdateDate', today); 
  }

  const handleFileUpload = (file) => {
    const validExtensions = ['xlsx', 'xls', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

  if (!validExtensions.includes(fileExtension)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid File Type',
      text: 'Please upload a valid Excel file.',
    });
    return;
  }
    const reader = new FileReader();
    setShowUpload(false);
    setShowCreateMessage(false);
    setShowContent(true);
    setShowSendMessage(true);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setIndexColumn(null)
    setInvalidPhoneNumbers([]);
  
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
  
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
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
  
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleToggleMessage = () => {
    setShowCreateMessage(true);
    setShowSendMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
  };

  const handleToggleBackHome = () => {
    setShowCreateMessage(false);
    setShowSendMessage(false);
    setShowCreateTemplate(false);
    setShowListMessage(false);
    setShowListTemplate(false);
    setShowUpload(true)
    setShowContent(false)
  };

  const handleToggleTemplate = () => {
    setShowCreateTemplate(true);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
  };

  const handleToggleSave = () => {
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(true);
  };

  const handleToggleSaveTemplate = () => {
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(true);
  };

  const handleToggleCancel = () => {
    setShowCreateTemplate(false);
    setShowSendMessage(true);
    setShowCreateMessage(false);
    setShowListMessage(false);
    setShowListTemplate(false);
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

  const handleEditMessage = (message) => {
    setMessageToEdit(message);
    setShowCreateTemplate(false);
    setShowSendMessage(false);
    setShowCreateMessage(true);
    setShowListTemplate(false);
    setShowListMessage(false);
  };

  const handleEditTemplate = (message) => {
    setTemplateToEdit(message);
    setShowCreateTemplate(true);
    setShowSendMessage(false);
    setShowCreateMessage(false);
    setShowListTemplate(false);
    setShowListMessage(false);
  };

  const spinnerComponent = (status) => {
    setShowSpinner(status)
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileUpload(file);
    setIsDragging(false);
    setIsDraggingShow(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const showTableElement = document.querySelector('.show-table');
    if (showTableElement) {
      setIsDraggingShow(true)
    } else {
      setIsDragging(true);
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

  const clearMessageToEdit = () => {
    setMessageToEdit(null);
  };

  const clearTemplateToEdit = () => {
    setTemplateToEdit(null);
  };
//333
  const checkPhoneInvalid = async (ids,indexColumn,emptyIndexes) => {
    let getId = [];
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    const fetchPromises = ids.map((id) => {
      var urlencoded = new URLSearchParams();
      urlencoded.append("token", "uwetp05gfbbjkc2g");
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
  
      return fetch("https://api.ultramsg.com/instance104874/messages?" + urlencoded, requestOptions)
        .then(response => response.json())
        .then(result => {
          if(result.messages[0].status == "invalid"){
            const phoneNumber = result.messages[0].to.replace("85620", "").replace("@c.us", "");
            getId.push(phoneNumber)
          }
          })
        .catch(error => {return error});
    });
  
    Promise.all(fetchPromises)
      .then(() => {
        setInvalidPhoneNumbers(getId);
        setIndexColumn(indexColumn);
        setPhoneNumberEmpty(emptyIndexes)
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
              {/* 111 */}
            {data.map((row, index) => {
              let phoneNumber = '';
              if (indexColumn !== null && indexColumn !== undefined && headers[indexColumn]) {
                phoneNumber = row[headers[indexColumn]]?.toString().trim() || '';
              }
              const isEmptyRow = phoneNumberEmpty?.includes(index) || false;
              const isInvalid =
                invalidPhoneNumbers.length > 0 && invalidPhoneNumbers.includes(phoneNumber);
              return (
                <tr key={index} className={`${isInvalid ? 'invalid-phone' : ''} ${isEmptyRow ? 'empty-phone' : ''}`}>
                  {headers.map((header, i) => (
                    <td key={i}>{row[header]}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
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
          {showCreateMessage && 
          <CreateMessageSection 
          onToggleSave ={handleToggleSave} 
          onToggleCancel ={handleToggleCancel}
          messageToEdit={messageToEdit}
          clearMessageToEdit={clearMessageToEdit}
          />}
          {showCreateTemplate && 
          <CreateTemplate
          onToggleSave ={handleToggleSaveTemplate} 
          onToggleCancel ={handleToggleCancel} 
          templateToEdit={templateToEdit}
          clearTemplateToEdit={clearTemplateToEdit}
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
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  </header>
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
  </div>
);

const SendMessageSection = ({onClick, fileInputRef, onFileUpload, onToggleMessage, onToggleTemplate,
  onToggleMessageList,onToggleTemplateList,getAmountSend,handleToggleBackHome }) => (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h1>Send Message</h1>
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
    <button className="send-btn" onClick ={handleToggleBackHome}>
        <FontAwesomeIcon icon={faArrowLeft}  />Back To Home
        </button>
      </div>
      <div className="send-footer">
      </div>
    </div>
);

const CreateMessageSection = ({onToggleSave,onToggleCancel,messageToEdit,clearMessageToEdit}) => {
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
        text: 'Template Name and Template cannot be empty.',
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
      onToggleSave();
      clearMessageToEdit();
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
    messageToEdit? onToggleSave() :onToggleCancel();
    clearMessageToEdit();
  };

  return (
    <div className="send-message">
      <div className="send-head">
        <h1>{title.header}</h1>
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

const CreateTemplate = ({onToggleSave,onToggleCancel,templateToEdit,clearTemplateToEdit}) => { 
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
      text: 'Template Name and Template cannot be empty.',
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
    onToggleSave();
    clearTemplateToEdit();
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
    templateToEdit? onToggleSave() :onToggleCancel();
    clearTemplateToEdit();
  };
  return(
  <div className="send-message">
  <div className="send-head">
    <h1>{title.header}</h1>
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
  const [selectedData, setSelectedData] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [indexCol, setIndexCol] = useState(null);
  const [showRadio, setShowRadio] = useState(false);
  const [selectedRadioOption, setSelectedRadioOption] = useState('sendAll');
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState([]);

  const handleSave = async () => {
    const emptyIndexes = selectedData
  .map((item, index) => (item === "" ? index : -1))
  .filter(index => index !== -1);
    if (!sendMessage || !selectedData) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Selected data and message cannot be empty.',
      });
      return;
    }
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a phone number.',
      });
      return;
    }
    setPhoneNumberEmpty([])
    setIndexColumn(null)
    SpinnerComponent(true);
    let getId = [];
    const fetchPromises = (selectedRadioOption === 'selectSend' ? selectedPhoneNumber : selectedData).map((item) => {
      const dataItem = selectedRadioOption === 'selectSend' ? item.value : item;
      if (dataItem) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", "uwetp05gfbbjkc2g");
        urlencoded.append("to", `+85620${dataItem}`);
        urlencoded.append("body", `${sendMessage}`);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };

        return fetch("https://api.ultramsg.com/instance104874/messages/chat", requestOptions)
          .then(response => response.json())
          .then((result) => {
            getId.push(result.id);
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error,
            });
          });
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises);
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
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      const selectedData = data.map(row => row[selectedIndex]);
      const nonNumberValues = selectedData.filter(value => isNaN(value));
    
      if (nonNumberValues.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Data',
          text: 'Selected data must be numbers only.',
        });
        setShowRadio(false);
        return;
      }
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
    }
    if(selectedIndex == ""){
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
    if (selectedPhoneNumber.some((item) => item.value === value)) {
      setSelectedPhoneNumber((prev) =>
        prev.filter((item) => item.value !== value)
      );
    } else {
      setSelectedPhoneNumber((prev) => [...prev, { value, index }]);
    }
  };
  
  return (
    <div className="send-message">
      <div className="send-head">
        <div className='amount-send'>
        <h1>Message List</h1>
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
                {template.name}
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
            <option value="" disabled>Select a column...</option>
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
                  {selectedData.filter(value => value).map((value, index) => (
                    <div className="select-phone" key={index}>
                      <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, index)}>
                        {selectedPhoneNumber.some((item) => item.value === value) && (
                          <div className="icon-checked" >
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectPhoneNumber(value, index)}
                        className={
                          selectedPhoneNumber.some((item) => item.value === value)
                            ? "selected"
                            : ""
                        }
                      >
                        {value}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
           
          </div>
      <div className='btn-add'>
        <button className='btn-save-add' onClick={handleSave}>Send Template<FontAwesomeIcon icon={faPaperPlane}/></button>
        <button className='btn-cancel-add' onClick={handleCancel}>Back</button>
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
        text: 'Selected data and template cannot be empty.',
      });
      return;
    }
    if (selectedRadioOption === 'selectSend' && selectedPhoneNumber.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a phone number.',
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
    const fetchPromises = (selectedRadioOption === 'selectSend' ? selectedPhoneNumber : selectedData).map((item) => {
      const dataItem = selectedRadioOption === 'selectSend' ? item.value : item;
      const template = sendTemplate[selectedRadioOption === 'selectSend' ? item.index : selectedData.indexOf(item)];
      if (dataItem) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        var urlencoded = new URLSearchParams();
        urlencoded.append("token", "uwetp05gfbbjkc2g");
        urlencoded.append("to", `+85620${dataItem}`);
        urlencoded.append("body", `${template}`);
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: urlencoded,
          redirect: 'follow'
        };

        return fetch("https://api.ultramsg.com/instance104874/messages/chat", requestOptions)
          .then(response => response.json())
          .then(result => {
            getId.push(result.id);
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error,
            });
          });
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises);
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
      return templateValue.replace(regex, (match, key) => {
        key = key.trim();
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
  };

  const handleDropdownChange = (e) => {
    const selectedIndex = e.target.value;
    setSelectedOption(selectedIndex);
    const dataIndex = headers.indexOf(selectedIndex);
    if (dataIndex !== -1) {
      const selectedData = data.map(row => row[selectedIndex]);
      const nonNumberValues = selectedData.filter(value => isNaN(value));
    
      if (nonNumberValues.length > 0 ) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Data',
          text: 'Selected data must be numbers only.',
        });
      setShowRadio(false);

        return;
      }
      setShowRadio(true);
      setSelectedData(selectedData);
      setIndexCol(dataIndex);
    }
    if(selectedIndex == ""){
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
    if (selectedPhoneNumber.some((item) => item.value === value)) {
      setSelectedPhoneNumber((prev) =>
        prev.filter((item) => item.value !== value)
      );
    } else {
      setSelectedPhoneNumber((prev) => [...prev, { value, index }]);
    }
  };

  return (
    <div className="send-message">
      <div className="send-head">
      <div className='amount-send'>
        <h1>Template List</h1>
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
                {template.name}
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
            <option value="" disabled>Select a column...</option>
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
                  {selectedData.filter(value => value).map((value, index) => (
                    <div className="select-phone" key={index}>
                      <div className="control-checked" onClick={() => handleSelectPhoneNumber(value, index)}>
                        {selectedPhoneNumber.some((item) => item.value === value) && (
                          <div className="icon-checked"onClick={() => handleSelectPhoneNumber(value, index)}>
                            <FontAwesomeIcon icon={faCheck} />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleSelectPhoneNumber(value, index)}
                        className={
                          selectedPhoneNumber.some((item) => item.value === value)
                            ? "selected"
                            : ""
                        }
                      >
                        {value}
                      </button>
                    </div>
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
          Back
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