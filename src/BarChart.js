/*
 * Homework 3
 * BarChart js source code
 *
 * Author: Evan Lee
 * Version: 1.0
 */
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import "./BarChart.css"


const BarChart = (props) => {
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);
    const [selectedBars, setSelectedBars] = useState(new Set());
    const keys = props.data.data.length > 0 ? Object.keys(props.data.data[0]) : ['xValue', 'yValue'];

    
    useEffect(() => {

        const svg = d3.select(svgRef.current);
        const tooltip = d3.select(tooltipRef.current);
        svg.selectAll('*').remove();
        if (!props.data.data || props.data.data.length === 0) {
            return;
          }

        const gridGroup = svg.append('g').classed('grid-group', true);
        const barsGroup = svg.append('g').classed('bars-group', true);

        function customRound(value) {
            if (value % 1 === 0) {
                return value; // If it's an integer, don't round up.
            }
            const integerPart = Math.floor(value);
            const decimalPart = value - integerPart;
            if (decimalPart <= 0.5) {
                return integerPart + 0.5;
            } else {
                return integerPart + 1;
            }
        }

        const title = {
            text: props.data.title,
            x: 0,
            y: 0,
            width: 100,
            height: 10,
            baseline: 5
        };

        const maxValue = props.data.data.reduce((max, current) => Math.max(max, current[keys[1]]), 0);
        const upperBound = customRound(maxValue);
        const { numTicks, stepSize } = calculateStepSize(maxValue);
        const barSpacing = 93 / props.data.data.length;
        const barWidth = barSpacing * 0.7;
        const yScale = d3.scaleLinear()
            .domain([0, (numTicks * stepSize).toFixed(1)])
            .range([ 95, 10]);


        svg.append('text')
            .attr('x', title.width / 2)
            .attr('y', title.baseline)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-family', 'Arial')
            .attr('font-size', '3pt')
            .attr('fill', 'black')
            .text(title.text);
        
            
    
        for (let i = 0; i <= numTicks ; i++) {
            const yPosition = 95 - (i * 85 / numTicks);
            const value = (i * stepSize).toFixed(1);
            
            svg.append('text')
                .attr('x', '2.5')
                .attr('y', `${yPosition}%`)
                .attr('font-family', 'Arial')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('font-size', '1.3pt')
                .attr('fill', 'black')
                .text(value);
                
            gridGroup.append('line')
                .attr('x1', '5%')
                .attr('x2', '98%')
                .attr('y1', `${yPosition}%`)
                .attr('y2', `${yPosition}%`)
                .attr('stroke', 'rgb(191, 191, 191)')
                .attr('stroke-width', 0.1);
        }
        // console.log(props.data.data.length)
        // Bars Area
        barsGroup.selectAll('rect')
            .data(props.data.data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => 7 + i * barSpacing)
            .attr('class', (d, i) => 'bar-' + i)
            .attr('width', barWidth)
            .attr('y', d => {
                console.log(d[keys[1]])
                return yScale(d[keys[1]])
            }) // The y position is the top of the bar
            .attr('height', d =>{
                let barHeight = 95 - yScale(d[keys[1]]);
                if( d[keys[1]] === '')
                {
                    barHeight = 0;
                }
                return barHeight;
            }) // The height is the bar's length
            .attr("stroke-width", '0.1pt')
            .attr('fill', (d, i) => selectedBars.has('bar-' + i) ? 'red' : 'dodgerblue')
            .on('click', (event) => handleBarClick(event.target.getAttribute('class')))
            .on('mouseover', (event, d) => {
                const svgRect = svgRef.current.getBoundingClientRect();
                const barRect = event.target.getBoundingClientRect();
                const x = barRect.left + barRect.width / 2 - svgRect.left;
                const y = barRect.top - svgRect.top;
                tooltip
                    .style('visibility', 'visible')
                    .style('left', `${x}px`)
                    .style('top', `${y - 5}px`)
                    .style('transform', 'translate(-50%, -100%)')  // Center the tooltip above the bar
                    .style('background-color', selectedBars.has(event.target.getAttribute('class')) ? 'red' : 'dodgerblue')
                    .style('color', 'white')
                    .text(`${keys[0]} : ${d[keys[0]]}, ${keys[1]}: ${d[keys[1]]}`);
            })
            .on('mouseout', () => {
                tooltip.style('visibility', 'hidden');
            });
        
        // Labels Area
        for (let i = 0; i < props.data.data.length; i++) {
            svg.append('text')
                .attr('x', 7 + i * barSpacing + barWidth / 2)  // Centered below each bar
                .attr('y', 98.5)  // Slightly above the bottom edge
                .attr('text-anchor', 'middle')
                .attr('font-family', 'Arial')
                .attr('font-size', '1.3pt')
                .attr('fill', 'black')
                .text(props.data.data[i][keys[0]]);

            svg.append('line')
                .attr('x1', 7 + i * barSpacing + barWidth / 2)  // Start slightly to the left of the label's center
                .attr('x2', 7 + i * barSpacing + barWidth / 2)  // End slightly to the right of the label's center
                .attr('y1', 95)
                .attr('y2', 95 + 1)
                .attr('stroke', 'rgb(191, 191, 191)')
                .attr('stroke-width', 0.1);
        }
        tooltip
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('border', 'solid')
            .style('border-width', '1px')
            .style('border-radius', '5px')
            .style('padding', '5px');
            
    }, [props.data,selectedBars]);

    useEffect(() => {
        setSelectedBars(new Set());
    }, [props.newLoaded, props.data.data.length]);

    const handleBarClick = (xKey) => {
        setSelectedBars(prevSelectedBars => {
            const newSelectedBars = new Set(prevSelectedBars);
            if (newSelectedBars.has(xKey)) {
                newSelectedBars.delete(xKey);
            } else {
                newSelectedBars.add(xKey);
            }
            return newSelectedBars;
        });
    };

    function calculateStepSize(maxValue, maxTicks = 20, minTicks = 0) {
        let stepSize = 0.5; // Start with the smallest multiple of 0.5
        let numTicks = Math.ceil(maxValue / stepSize);
      
        // Define a function to find the next clean step size
        function getNextCleanStepSize(currentStepSize) {
          if (currentStepSize >= 1) {
            return Math.ceil(currentStepSize); // Round up to the nearest whole number
          }
          return currentStepSize; // If less than 1, it's already at the minimum clean step of 0.5
        }
      
        // Increase the step size to get a clean number and acceptable tick count
        while (numTicks > maxTicks || numTicks < minTicks) {
          if (numTicks > maxTicks) {
            stepSize *= 2; // Double the step size to reduce the number of ticks
          } else if (numTicks < minTicks) {
            stepSize /= 2; // Half the step size to increase the number of ticks, but not below 0.5
            stepSize = Math.max(stepSize, 0.5); // Enforce the minimum step size of 0.5
          }
          stepSize = getNextCleanStepSize(stepSize);
          numTicks = Math.ceil(maxValue / stepSize);
        }
      
        return {
          numTicks: numTicks,
          stepSize: stepSize
        };
    }
      
      


    return (
        <>
            <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio='none' className='BarChart'>
            </svg>
            <div ref={tooltipRef}></div>
        </>
    );
}
export default BarChart;
