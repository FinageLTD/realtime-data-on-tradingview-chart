"use strict";

var container = document.getElementById("container");
var chart = LightweightCharts.createChart(container, {
  height: 500,
  crosshair: {
    mode: LightweightCharts.CrosshairMode.Normal,
  },
});

var candleSeries = chart.addCandlestickSeries();

var lastClose = 0;
var lastIndex = 0;

var currentIndex = lastIndex + 1;
var ticksInCurrentBar = 0;
var currentBar = {
  open: null,
  high: null,
  low: null,
  close: null,
  time: +new Date(),
};

function mergeTickToBar(price) {
  if (currentBar.open === null) {
    currentBar.open = price;
    currentBar.high = price;
    currentBar.low = price;
    currentBar.close = price;
  } else {
    currentBar.close = price;
    currentBar.high = Math.max(currentBar.high, price);
    currentBar.low = Math.min(currentBar.low, price);
  }
  candleSeries.update(currentBar);
}

async function loadHistoricalData(historicalData) {
  var data = [];
  historicalData.forEach((result) => {
    data.push({
      open: +result.o,
      high: +result.h,
      low: +result.l,
      close: +result.c,
      time: +result.t / 1000,
    });
  });

  lastClose = data[data.length - 1].close;
  lastIndex = data.length - 1;

  candleSeries.setData(data);
}

function updateChart(lastPrice) {
  mergeTickToBar(lastPrice);
  if (++ticksInCurrentBar === 60) {
    // move to the next bar after 60 data.
    currentBar = {
      open: null,
      high: null,
      low: null,
      close: null,
      time: +new Date(),
    };
    ticksInCurrentBar = 0;
  }
}
