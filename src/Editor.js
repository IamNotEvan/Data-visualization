/*
 * Homework 3
 * Editor js source code
 *
 * Author: Evan Lee
 * Version: 1.0
 */
import React, { useState, useEffect } from 'react';
import './Editor.css';

const Editor = (props) => {

  const [dataset, setDataset] = useState(props.data);
  const dataKeys = dataset.data && dataset.data.length > 0 ? Object.keys(dataset.data[0]) : ["", ""];
  const keys = { xValue: dataKeys[0], yValue: dataKeys[1] };

  const handleValueChange = (index, field, value) => {
    setDataset(prevDataset => {
      const newDataset = { ...prevDataset };
      newDataset.data = prevDataset.data.map((entry, i) => {
        if (i === index) {
          return { ...entry, [field]: value };
        }
        return entry;
      });
      return newDataset;
    });
  }

  const handleKeyChange = (keyType, newKey) => {
    setDataset(prevDataset => {
      const oldKey = keyType === 'xValue' ? keys.xValue : keys.yValue;
  
      const updatedData = prevDataset.data.map(entry => {
        // Store the value of the old key
        const value = entry[oldKey];
        // Create a new entry with the old key removed
        const {[oldKey]: _, ...rest} = entry;
        // Create a new object with the new key and value, maintaining the order of properties
        const updatedEntry = keyType === 'xValue' 
          ? { [newKey]: value, ...rest }
          : { ...rest, [newKey]: value };
        return updatedEntry;
      });
  
      return { ...prevDataset, data: updatedData };
    });
  };

  const handleRemoveLine = (index) => {
    setDataset(prevDataset => {
      const newDataset = { ...prevDataset };
      newDataset.data = prevDataset.data.filter((_, i) => i !== index);
      return newDataset;
    });
  }

  const handleAddLine = (index) => {
    setDataset(prevDataset => {
      const newDataset = { ...prevDataset };
      const newLine = {};
      Object.keys(keys).forEach(key => {
        newLine[keys[key]] = '';
      });
      newDataset.data = index === -1
        ? [newLine, ...prevDataset.data]
        : [
            ...prevDataset.data.slice(0, index + 1),
            newLine,
            ...prevDataset.data.slice(index + 1),
          ];
      return newDataset;
    });
  };

  useEffect(() => {
    props.updateData(dataset)
  }, [dataset]);

  useEffect(() => {
    setDataset(props.data);
  }, [props.data]);

  return (
    <div className="editor-container">
      <div className='title-container'>
        <input 
          type="text" 
          className="title-input bigger-font" 
          value={dataset.title}
          size='14'
          onChange={(e) => setDataset({ ...dataset, title: e.target.value })} 
        />
      </div>
      <div className='table-container'>
        <table>
          <thead>
            <tr>
              <th>
              <button onClick={() => handleAddLine(-1)}
                          style={{ transform: 'translateY(65%)' }}
                                >Add</button>
              </th> 
              {Object.keys(keys).map(key => (
                <th key={key}>
                  <input 
                    type="text"
                    className='Key-Values bigger-font'
                    value={keys[key]}
                    // size='10' 
                    onChange={(e) => handleKeyChange(key, e.target.value)} 
                  />
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dataset.data.map((entry, index) => (
              <tr key={index}>
                <td>
                  <button 
                    onClick={() => handleAddLine(index)}
                    style={{ transform: 'translateY(65%)' }}
                  >
                    Add
                  </button>
                </td>
                {Object.keys(keys).map((key, keyIndex) => (
                  <td key={key}>
                    <input 
                      type={keyIndex === 0 ? 'text' : 'number'}
                      className='variables bigger-font'
                      // size="8"
                      value={entry[keys[key]]} 
                      onChange={(e) => handleValueChange(index, keys[key], e.target.value)} 
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => handleRemoveLine(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Editor;
