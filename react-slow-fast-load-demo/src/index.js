import React from 'react';
import ReactDOM from 'react-dom/client';
// import SlowGallery from './SlowGallery';
// Uncomment the line below to use the optimized version
import FastGallery from './FastGallery';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <SlowGallery /> */}
    {/* Uncomment the line below to use the optimized version */}
    <FastGallery />
  </React.StrictMode>
);
