import React, { useState } from 'react';
import { FaUpload, FaTrash, FaImage } from 'react-icons/fa';
import './ImageUpload.css';

const ImageUpload = ({ empresaId, onImagesUploaded, existingImages = [] }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState(existingImages);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Crear previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Selecciona al menos una imagen');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('imagenes', file);
      });

      const response = await fetch(`http://localhost:3001/api/empresas/${empresaId}/imagenes`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUploadedImages(prev => [...prev, ...result.imagenes]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (onImagesUploaded) {
          onImagesUploaded(result.imagenes);
        }
        alert('Imágenes subidas exitosamente');
      } else {
        throw new Error(result.error || 'Error al subir imágenes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al subir imágenes: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload-container">
      <h3>Galería de Imágenes del Local</h3>
      
      {/* Imágenes existentes */}
      {uploadedImages.length > 0 && (
        <div className="existing-images">
          <h4>Imágenes actuales:</h4>
          <div className="image-grid">
            {uploadedImages.map((imageUrl, index) => (
              <div key={index} className="image-item">
                <img src={imageUrl} alt={`Imagen ${index + 1}`} />
                <button 
                  className="remove-btn"
                  onClick={() => removeUploadedImage(index)}
                  title="Eliminar imagen"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subir nuevas imágenes */}
      <div className="upload-section">
        <h4>Subir nuevas imágenes:</h4>
        
        <div className="file-input-container">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload" className="file-input-label">
            <FaUpload />
            Seleccionar imágenes
          </label>
        </div>

        {/* Preview de imágenes seleccionadas */}
        {previewUrls.length > 0 && (
          <div className="preview-section">
            <h5>Imágenes seleccionadas:</h5>
            <div className="preview-grid">
              {previewUrls.map((url, index) => (
                <div key={index} className="preview-item">
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button 
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              className="upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir imágenes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
