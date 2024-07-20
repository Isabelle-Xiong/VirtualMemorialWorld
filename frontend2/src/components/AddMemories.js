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

    const handlePhotoChange = async (event) => {
        const files = Array.from(event.target.files);
        const compressedFiles = await Promise.all(files.map(file => compressImage(file)));
        const base64Files = await Promise.all(compressedFiles.map(file => convertToBase64(file)));
        setPhotos(prevPhotos => [...prevPhotos, ...base64Files]);
    };

    const handleSoundtrackChange = async (event) => {
        const file = event.target.files[0];
        const truncatedFile = await truncateAudio(file, 45); // Truncate to 45 seconds
        const base64File = await convertToBase64(truncatedFile);
        setSoundtrack(base64File);
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
                soundtrack
            }, {
                headers: {
                    'x-auth-token': token,
                }
            });

            setTitle('');
            setPhotos([]);
            setSoundtrack(null);
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

    const truncateAudio = (file, maxDurationInSeconds) => {
        return new Promise((resolve, reject) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const reader = new FileReader();

            reader.onload = () => {
                audioContext.decodeAudioData(reader.result)
                    .then(buffer => {
                        const duration = buffer.duration;
                        const truncatedDuration = Math.min(duration, maxDurationInSeconds);
                        const truncatedBuffer = audioContext.createBuffer(buffer.numberOfChannels, truncatedDuration * buffer.sampleRate, buffer.sampleRate);

                        for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                            truncatedBuffer.copyToChannel(buffer.getChannelData(channel).subarray(0, truncatedDuration * buffer.sampleRate), channel);
                        }

                        const wavData = bufferToWave(truncatedBuffer, truncatedDuration * buffer.sampleRate);
                        const blob = new Blob([new DataView(wavData)], { type: 'audio/wav' });
                        resolve(blob);
                    }).catch(err => reject(err));
            };

            reader.onerror = error => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    const bufferToWave = (abuffer, len) => {
        let numOfChan = abuffer.numberOfChannels,
            length = len * numOfChan * 2 + 44,
            buffer = new ArrayBuffer(length),
            view = new DataView(buffer),
            channels = [],
            i, sample,
            offset = 0,
            pos = 0;

        // write WAVE header
        setUint32(0x46464952);                         // "RIFF"
        setUint32(length - 8);                         // file length - 8
        setUint32(0x45564157);                         // "WAVE"

        setUint32(0x20746d66);                         // "fmt " chunk
        setUint32(16);                                 // length = 16
        setUint16(1);                                  // PCM (uncompressed)
        setUint16(numOfChan);
        setUint32(abuffer.sampleRate);
        setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
        setUint16(numOfChan * 2);                      // block-align
        setUint16(16);                                 // 16-bit (hardcoded in this demo)

        setUint32(0x61746164);                         // "data" - chunk
        setUint32(length - pos - 4);                   // chunk length

        // write interleaved data
        for (i = 0; i < abuffer.numberOfChannels; i++)
            channels.push(abuffer.getChannelData(i));

        while (pos < length) {
            for (i = 0; i < numOfChan; i++) {             // interleave channels
                sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
                view.setInt16(pos, sample, true);          // write 16-bit sample
                pos += 2;
            }
            offset++                                     // next source sample
        }

        return buffer;

        function setUint16(data) {
            view.setUint16(pos, data, true);
            pos += 2;
        }

        function setUint32(data) {
            view.setUint32(pos, data, true);
            pos += 4;
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
                            <img src={photo} alt={`Preview ${index}`} />
                            <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>X</button>
                        </div>
                    ))}
                </div>
                {soundtrack && (
                    <div className="preview-soundtrack">
                        <h4>Soundtrack</h4>
                        <audio controls>
                            <source src={soundtrack} />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddMemories;