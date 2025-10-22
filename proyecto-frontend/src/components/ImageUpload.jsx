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

    // Verificar límite de 9 imágenes totales
    const totalImages = uploadedImages.length + selectedFiles.length + validFiles.length;
    if (totalImages > 9) {
      alert(`Máximo 9 imágenes permitidas. Actualmente tienes ${uploadedImages.length} imágenes y estás intentando agregar ${validFiles.length} más.`);
      return;
    }

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

  const removeUploadedImage = async (index) => {
    const imageToDelete = uploadedImages[index];
    
    if (!imageToDelete) {
      alert('No se pudo encontrar la imagen a eliminar');
      return;
    }
    
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }
    
    try {
      console.log('Eliminando imagen:', imageToDelete);
      console.log('Total de imágenes antes:', uploadedImages.length);
      
      // Filtrar la imagen a eliminar del array local
      const imagenesRestantes = uploadedImages.filter((_, i) => i !== index);
      
      console.log('Imágenes restantes:', imagenesRestantes.length);
      console.log('Enviando al backend:', imagenesRestantes);
      
      // Actualizar en el backend usando PUT
      const response = await fetch(`http://api-savi.anima.edu.uy/api/empresas/${empresaId}/imagenes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagenes: imagenesRestantes })
      });
      
      console.log('Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Resultado del servidor:', result);
      
      if (result.success) {
        // Actualizar el estado local con las imágenes restantes
        setUploadedImages(imagenesRestantes);
        
        // Notificar al componente padre sobre el cambio
        if (onImagesUploaded) {
          onImagesUploaded(imagenesRestantes);
        }
        
        alert('Imagen eliminada exitosamente del backend y frontend');
      } else {
        throw new Error(result.error || 'Error al eliminar imagen');
      }
      
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Error al eliminar imagen: ${error.message}`);
    }
  };

  // Función para seleccionar solo las primeras 9 imágenes
  const selectOnlyFirst9 = async () => {
    if (uploadedImages.length <= 9) {
      alert('Ya tienes 9 imágenes o menos');
      return;
    }
    
    if (!confirm(`¿Quieres mantener solo las primeras 9 imágenes? Se eliminarán ${uploadedImages.length - 9} imágenes.`)) {
      return;
    }
    
    try {
      const primeras9 = uploadedImages.slice(0, 9);
      
      console.log('Eliminando imágenes masivamente...');
      console.log('Imágenes antes:', uploadedImages.length);
      console.log('Imágenes después:', primeras9.length);
      console.log('Imágenes a eliminar:', uploadedImages.length - 9);
      
      // Actualizar en el backend
      const response = await fetch(`http://api-savi.anima.edu.uy/api/empresas/${empresaId}/imagenes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagenes: primeras9 })
      });
      
      console.log('Respuesta del servidor:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error del servidor:', errorText);
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Resultado del servidor:', result);
      
      if (result.success) {
        setUploadedImages(primeras9);
        
        if (onImagesUploaded) {
          onImagesUploaded(primeras9);
        }
        
        alert(`✅ Se mantuvieron solo las primeras 9 imágenes. Se eliminaron ${uploadedImages.length - 9} imágenes del backend y frontend.`);
      } else {
        throw new Error(result.error || 'Error al actualizar imágenes');
      }
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error al actualizar imágenes: ${error.message}`);
    }
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

      const response = await fetch(`http://api-savi.anima.edu.uy/api/empresas/${empresaId}/imagenes`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Usar las nuevas imágenes que se subieron
        const newImages = result.imagenesNuevas || [];
        setUploadedImages(prev => [...prev, ...newImages]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        if (onImagesUploaded) {
          onImagesUploaded(newImages);
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
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            Máximo 9 imágenes totales. Actualmente tienes {uploadedImages.length} imágenes.
          </p>
          
          {uploadedImages.length > 9 && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px' }}>
              <p style={{ margin: '0 0 10px 0', color: '#856404', fontWeight: 'bold' }}>
                ⚠️ Tienes {uploadedImages.length} imágenes (límite: 9)
              </p>
              <button 
                onClick={selectOnlyFirst9}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🗑️ Mantener solo las primeras 9 imágenes
              </button>
            </div>
          )}
        
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
