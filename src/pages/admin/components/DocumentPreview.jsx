import React from 'react';
import { FiFile } from 'react-icons/fi';
import './DocumentPreview.css';

const DocumentPreview = ({ documentUrl, documentName, size = 'medium' }) => {
  const getFileTypeIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FiFile className="file-icon pdf" />;
      case 'doc':
      case 'docx':
        return <FiFile className="file-icon word" />;
      case 'xls':
      case 'xlsx':
        return <FiFile className="file-icon excel" />;
      default:
        return <FiFile className="file-icon" />;
    }
  };

  return (
    <div className={`document-preview ${size}`}>
      <div className="document-thumbnail">
        {getFileTypeIcon(documentName)}
        <span className="document-extension">{documentName.split('.').pop()}</span>
      </div>
      <div className="document-info">
        <h4>{documentName}</h4>
      </div>
    </div>
  );
};

export default DocumentPreview;