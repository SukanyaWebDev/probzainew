import React from 'react';
import '../styles/index.css'

const TimeframeSelector = ({ onSelect }) => (
  <div className='buttonscontaner'>
    <button onClick={() => onSelect('daily')}>Daily</button>
    <button onClick={() => onSelect('weekly')}>Weekly</button>
    <button onClick={() => onSelect('monthly')}>Monthly</button>
  </div>
);

export default TimeframeSelector;
