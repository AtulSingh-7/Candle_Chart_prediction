import { LineStyle, TickMarkType, createChart } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../App.css"

const LeftLive = () => {
    const chartContainerRef = useRef();
    const [candlePrice, setCandlePrice] = useState(null);
    const [linePrice, setLinePrice] = useState(null);

    useEffect(() => {
        const initialData = [];

        axios('http://localhost:3001/leftdata')
        .then(response => {
          const initialData = response.data;
          console.log(initialData);
          candleStickSeries.setData(initialData);
        //   lineSeries.setData(lineData); // Update this line if lineData also comes from backend
        });

        const intervalId = setInterval(() => {
            axios('http://localhost:3001/leftdata')
            .then(response => {
              const initialData = response.data;
              console.log(initialData);
              candleStickSeries.setData(initialData);
              lineSeries.setData(lineData); // Update this line if lineData also comes from backend
            });
          }, 1 * 30 * 1000); 

        const lineData = initialData.map((item) => ({
            time: item.time,
            value: (item.open + item.close) / 2,
        }));

        const chart = createChart(chartContainerRef.current);

        chart.applyOptions({
            layout: {
                background: { color: '#222' },
                textColor: '#DDD',
            },
            grid: {
                vertLines: { color: '#444' },
                horzLines: { color: '#444' },
            },

            width: chartContainerRef.current.clientWidth,
            // width: 800,
            height: 400,
            crosshair: {
                vertLine:{
                    width: 3,
                    color: '#C3BCDB44',
                    style: LineStyle.Dashed,
                    labelBackgroundColor: '#9B7DFF',
                },
                horzLine: {
                    color: '#9B7DFF',
                    labelBackgroundColor: '#9B7DFF',
                },
            },

            localization: {
                locate: "en-IN",
                timeFormatter: (time) => {
                    const date = new Date(time * 1000);
                    const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
                        hour: "numeric",
                        minute: "numeric",
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                    });
                    return dateFormatter.format(date);
                },
                priceFormatter: (price) => {
                    // return price.toFixed(0);
                    const myPrice = new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 2,
                    }).format(price);

                    return myPrice
                },
            },
        });

        // Setting the border color for the vertical axis
        chart.priceScale("right").applyOptions({
            borderColor: '#71649C',
            visible: true,
            invertScale: false, //for inverting the order of price
            autoScale: true, //flase for enabling vertical mouse controlled move of chart
        });

        chart.priceScale("left").applyOptions({
            borderColor: '#71649C',
            visible: true,
        });

        // Setting the border color for the horizontal axis
        chart.timeScale().applyOptions({
            borderColor: '#71649C',
            // borderVisible: false,
            // visible: false,
            timeVisible: true,
            rightOffset: 20,
            barSpacing: 15,
            minBarSpacing: 5,
            fixLeftEdge: true,
            tickMarkFormatter: (time, tickMarkType, locale) => {
                const date = new Date(time * 1000);
                
                // const myDate = 
                // date.toLocaleDateString("en-IN") +
                // " " +
                // date.getHours() +
                // ":" +
                // date.getMinutes();

                // return myDate;

                switch (tickMarkType) {
                    case TickMarkType.Year:
                        return date.getFullYear();

                    case TickMarkType.Month:
                        const monthFormatter = new Intl.DateTimeFormat(locale, {
                            month: "short",
                        });

                        return monthFormatter.format(date);

                    case TickMarkType.DayOfMonth:
                        return date.getDate();
                        
                    case TickMarkType.Time:
                        const timeFormatter = new Intl.DateTimeFormat(locale, {
                            hour: "numeric",
                            minute: "numeric",
                        });

                        return timeFormatter.format(date);
                    
                    case TickMarkType.TimeWithSeconds:
                        const TimeWithSecondsFormatter = new Intl.DateTimeFormat(locale, {
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                        });

                        return TimeWithSecondsFormatter.format(date);
                    default:
                        console.log('Sorry, we are out of. ');
                }
            },
        });

        // chart.timeScale().fitContent();

        const lineSeries = chart.addLineSeries();
        const candleStickSeries = chart.addCandlestickSeries();
        // const newSeries = chart.addCandlestickSeries({ 
        //     upColor: '#26a69a',
        //     downColor: '#ef5350',
        //     borderVisible: false,
        //     wickUpColor: '#26a69a',
        //     wickDownColor: '#ef5350' 
        //     });
        candleStickSeries.applyOptions({
            wickUpColor: 'rgb(87, 217, 54)',
            upColor: 'rgb(87, 217, 54)',
            wickDownColor: 'rgb(225, 50, 85)',
            downColor: 'rgb(225, 50, 85)',
            borderVisible: false,
        });

        lineSeries.applyOptions({
            lineWidth: 1,
            priceScaleId: "left",
        });

        candleStickSeries.setData(initialData);
        lineSeries.setData(lineData);


        chart.subscribeCrosshairMove((param) => {
            if (param.time) {

                const data = param.seriesData.get(candleStickSeries);
                const linePriceData = param.seriesData.get(lineSeries);
                setCandlePrice(data);
                setLinePrice(linePriceData);
            }
        });

        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };

        window.addEventListener("resize", handleResize);


        return () => {
            clearInterval(intervalId);
            chart.remove();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div ref={chartContainerRef} style={{
            position: 'absolute',
            border: '2px solid black',
            width: '45%',
            left: '0px',
            marginLeft: '40px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.9)',

            
            }}>
            <div style={{
                position: 'absolute',
                top: 20,
                left: 100,
                zIndex: 20,
                color: 'white'
                
                }}>
                <div>Live Market</div>
                <div style={{display: 'flex'}}>
                <div style={{marginRight: 10}}>OPEN: {candlePrice?.open}</div>
                <div style={{marginRight: 10}}>HIGH: {candlePrice?.high}</div>
                <div style={{marginRight: 10}}>LOW: {candlePrice?.low}</div>
                <div style={{marginRight: 10}}>CLOSE: {candlePrice?.close}</div>
                </div>

                <div>VALUE: {linePrice?.value}</div>
                
            </div>
        </div>
    ) 
}

export default LeftLive;