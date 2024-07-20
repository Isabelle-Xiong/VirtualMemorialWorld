import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../AddMemories.css';

function AddMemories() {
    const { id: avatarId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [soundtrack, setSoundtrack] = useState(null);
    const [title, setTitle] = useState('');

    useEffect(() => {
        document.body.classList.add('add-memories-page');
        return () => {
            document.body.classList.remove('add-memories-page');
        };
    }, []);

    const handlePhotoChange = (event) => {
        const files = Array.from(event.target.files);
        setPhotos(prevPhotos => [...prevPhotos, ...files]);
    };

    const handleSoundtrackChange = (event) => {
        setSoundtrack(event.target.files[0]);
    };

    const handleRemovePhoto = (index) => {
        setPhotos(prevPhotos => prevPhotos.filter((_, i) => i !== index));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', title);
        photos.forEach(photo => {
            formData.append('photos', photo);
        });
        if (soundtrack) {
            formData.append('soundtrack', soundtrack);
        }

        try {
            // Upload photos and soundtrack together
            await axios.post(`http://localhost:5001/api/avatars/${avatarId}/memories`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-auth-token': token,
                }
            });

            // Clear the form after successful submission
            setTitle('');
            setPhotos([]);
            setSoundtrack(null);
            alert('Memories added successfully!');
        } catch (error) {
            console.error('Error adding memories:', error);
            alert('Failed to add memories. Please try again.');
        }
    };

    return (
        <div className="add-memories-container">
            <h2>Add New Memories</h2>
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
                    <label htmlFor="soundtrack">Upload Soundtrack (Optional, max 45 seconds)</label>
                    <input
                        type="file"
                        id="soundtrack"
                        accept="audio/*,video/mp4"
                        onChange={handleSoundtrackChange}
                    />
                </div>
                <button type="submit">Add Memories</button>
            </form>
            <div className="preview-section">
                <h3>Preview</h3>
                <div className="preview-images">
                    {photos.map((photo, index) => (
                        <div key={index} className="preview-image-container">
                            <img src={URL.createObjectURL(photo)} alt={`Preview ${index}`} />
                            <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>X</button>
                        </div>
                    ))}
                </div>
                {soundtrack && (
                    <div className="preview-soundtrack">
                        <h4>Soundtrack</h4>
                        <audio controls>
                            <source src={URL.createObjectURL(soundtrack)} type={soundtrack.type} />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddMemories;