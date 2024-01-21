import React from 'react';
import './ClientButton.css';

export default function SlideButton({ image1Version, image2Version, image3Version }) {
  return (
    <div className="slide-button-container">
      <img src={src/images/img1version${image1Version}.jpg} alt="Image 1" />
      <img src={src/images/img2version${image2Version}.jpg} alt="Image 2" />
      <img src={src/images/img3version${image3Version}.jpg} alt="Image 3" />
    </div>
  );
}