import React from 'react';
import { FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

const ImagePreview = ({ imageUrl, onRemove, theme }) => {
  if (!imageUrl) return null;

  return (
    <div className="relative inline-block">
      <img src={imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded" />
      <button
        onClick={onRemove}
        className={clsx(
          "absolute top-0 right-0 bg-white rounded-full p-1 shadow-md",
          theme ? "text-gray-800" : "text-red-600"
        )}
        aria-label="Remove image"
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default ImagePreview;
