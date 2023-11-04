import React, { useEffect } from 'react';

const DataLoader = () => {

    const dataset = {
        title: "World population",
        data: [
          { year: '1950', population: 2.525 },
          { year: '1960', population: 3.018 },
          { year: '1970', population: 3.682 },
          { year: '1980', population: 4.440 },
          { year: '1990', population: 5.310 },
          { year: '2000', population: 6.127 },
          { year: '2010', population: 6.930 },
        ]
      };

      const empty = {
        title: "Empty",
        data: [
        ]
    }

    const grades = {
        title: "Grade Distribution",
        data: [
            {grade: 'A', count: 5},
            {grade: 'A-', count: 10},
            {grade: 'B+', count: 12},
            {grade: 'B', count: 23},
            {grade: 'B-', count: 7},
            {grade: 'C+', count: 9},
            {grade: 'C', count: 16},
            {grade: 'C', count: 3},
            {grade: 'D+', count: 8},
            {grade: 'D', count: 11},
            {grade: 'D-', count: 13},
            {grade: 'F', count: 2},
        ]
    }

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem('pr1.json', JSON.stringify(dataset));
    localStorage.setItem('empty.json', JSON.stringify(empty));
    localStorage.setItem('grades.json', JSON.stringify(grades));

    Object.keys(localStorage).forEach(key => {
    //   console.log(key);
    //   console.log(JSON.parse(localStorage.getItem(key)));
    });
  }, []); // Empty dependency array means this effect will only run once, similar to componentDidMount

  return (
    <div>
    </div>
  );
};

export default DataLoader;
