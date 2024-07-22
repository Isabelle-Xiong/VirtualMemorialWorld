import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import '../AddMemories.css';

function AddMemories() {
    const { id: avatarId } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [soundtrackUrl, setSoundtrackUrl] = useState('');
    const [title, setTitle] = useState('');

    useEffect(() => {
        document.body.classList.add('add-memories-page');
        return () => {
            document.body.classList.remove('add-memories-page');
        };
    }, []);

    const handlePhotoChange = async (event) => {
        const files = Array.from(event.target.files);
        const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
        const base64Files = await Promise.all(compressedFiles.map(file => convertToBase64(file)));
        setPhotos(prevPhotos => [...prevPhotos, ...base64Files]);
    };

    const handleRemovePhoto = (index) => {
        setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post(`http://localhost:5001/api/avatars/${avatarId}/memories`, {
                title,
                photos,
                soundtrackUrl
            }, {
                headers: {
                    'x-auth-token': token,
                }
            });

            setTitle('');
            setPhotos([]);
            setSoundtrackUrl('');
            alert('Memories added successfully!');
        } catch (error) {
            console.error('Error adding memories:', error);
            alert('Failed to add memories. Please try again.');
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 800;
                    const maxHeight = 800;

                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.7);
                };
            };

            reader.onerror = error => reject(error);
        });
    };

    const handleBackClick = () => {
        navigate(`/avatar-home/${avatarId}`);
    };

    return (
        <div className="add-memories-container">
            <div className="header">
            <button className="back-button" onClick={handleBackClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <h2>Add New Memories</h2>
        </div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Memory Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="photos">Upload Photos</label>
                    <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="soundtrackUrl">Soundtrack URL (Optional)</label>
                    <input
                        type="url"
                        id="soundtrackUrl"
                        value={soundtrackUrl}
                        onChange={(e) => setSoundtrackUrl(e.target.value)}
                    />
                </div>
                <button type="submit">Add Memories</button>
            </form>
            <div className="preview-section">
                <h3>Preview</h3>
                <div className="preview-images">
                    {photos.map((photo, index) => (
                        <div key={index} className="preview-image-container">
                            <img src={photo} alt={`Preview ${index}`} />
                            <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>X</button>
                        </div>
                    ))}
                </div>
                {soundtrackUrl && (
                    <div className="preview-soundtrack">
                        <h4>Soundtrack</h4>
                        <ReactPlayer 
                            url={soundtrackUrl} 
                            controls 
                            width="50%" 
                            height="50%"
                            className="react-player"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddMemories;