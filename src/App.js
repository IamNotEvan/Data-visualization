/*
 * Homework 3
 * App js source code
 *
 * Author: Evan Lee
 * Version: 1.0
 */
import React, { useState } from 'react';
import './App.css';
import BarChart from './BarChart';
import Header from './Header';  // Import the Header component
import Editor from './Editor';
import MenuBar from './MenuBar'; // Import the DataLoader component
import DataLoader from './load';




function App() {

    const loadedData = localStorage.getItem("pr1.json");
    const file1 = JSON.parse(loadedData)
    const [data, setData] = useState(file1);  // Setting the initial state with the imported JSON data
    const keys = data.data && data.data.length > 0 ? Object.keys(data.data[0]) : [];
    const [newLoaded, setNewLoaded] = useState(0)

    // Function to update the data state
    const updateData = (newData) => {
        setData(newData);
    };

    const setEmptyData = () => {
        setData({
          title: "New File",
          data: [{xLabel: '', yLabel: ''}]
        });
    };

    const loadData = (loadedData) => {
        try {
          const parsedData = JSON.parse(loadedData);
          setData(parsedData);
          setNewLoaded(newLoaded + 1);
        } catch (error) {
          console.error('Error parsing loaded data:', error);
        }
    };


    // console.log(data)
    return (
        <div className="App">
            <DataLoader></DataLoader>
            <div className='Header-Container'>
                <div className='MenuBar-Container'>
                    <MenuBar
                        setEmptyData={setEmptyData}
                        loadData={loadData}
                        data={data} 
                    />
                </div>
                <Header/>
            </div>
            <div className="Editor-Container">
                <Editor 
                    data={data}
                    updateData={updateData}
                />
            </div>
            <div className="BarChart-Container">
                <div className="Actual-BarChart-Box">
                    <BarChart 
                        data={data}
                        newLoaded={newLoaded}
                    />
                </div>
                <div className="X-Lable-Box">
                    {keys[0]}
                </div>
                <div className='Y-Label-Box'>
                    {keys[1] && keys[1].split('').map((letter, index) => (
                <div key={index} className="Vertical-Text">
                    {letter}
                </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default App;
