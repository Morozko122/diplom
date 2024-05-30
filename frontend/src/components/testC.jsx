import React, { useState } from 'react';

const LabelForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
  };

  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <form onSubmit={handleSubmit}>
        <label>
          Enter label text:
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
        </label>
        <br />
        <button type="submit">Add Label</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default LabelForm;