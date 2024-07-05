// Pets.js
import React from 'react';

function Pets({ pets }) {
    return (
        <div>
            <h3>Pets</h3>
            {pets.map((pet, index) => (
                <div key={index}>
                    <p>Name: {pet.name}</p>
                    <p>Type: {pet.type}</p>
                    <p>Age: {pet.age}</p>
                </div>
            ))}
        </div>
    );
}

export default Pets;