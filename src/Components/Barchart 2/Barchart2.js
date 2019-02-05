import React, { Component } from "react";
import * as d3 from "d3";
import "./bar2.css";
import data from "./data2";

export default class Barchart extends Component {
  state = {
    data: [],
    svg: "",
    scales: {},
    axes: {},
    display: { w: 960, h: 500, m: { t: 20, b: 30, r: 30, l: 40 } }
  };
  componentDidMount() {
    let state = this.state,
      m = state.display.m,
      w = state.display.w - m.l - m.r,
      h = state.display.h - m.t - m.b;
    console.log(m);
    let xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0.8);
    let yScale = d3.scale.linear().range([h, 0]);
    console.log(data);
    let xAxis = d3.svg
      .axis()
      .scale(xScale)
      .innerTickSize(0)
      .orient("bottom");

    let yAxis = d3.svg
      .axis()
      .scale(yScale)
      .orient("left")
      .innerTickSize(-w)
      .outerTickSize(0);
    // .ticks(10, "%");

    let Data = data.map(function(d) {
      return { letter: d.Letter, value: +d.Freq };
    });
    xScale.domain(Data.map(d => d.letter));
    yScale.domain(d3.extent(Data, d => d.value)).nice();

    this.setState({
      data: Data,
      svg: d3
        .select("#graph")
        .append("svg")
        .attr("height", h + m.t + m.b)
        .attr("width", w + m.l + m.r)
        .attr("class", "chart"),
      scales: { xScale: xScale, yScale: yScale },
      axes: { xAxis: xAxis, yAxis: yAxis }
    });
    console.log(Data);
  }
  render() {
    var state = this.state,
      data = state.data,
      svg = state.svg || false,
      m = state.display.m,
      w = state.display.w - m.l - m.r,
      h = state.display.h - m.t - m.b,
      xScale = state.scales.xScale,
      yScale = state.scales.yScale,
      xAxis = state.axes.xAxis,
      yAxis = state.axes.yAxis;
    if (svg) {
      var chart = svg
        .append("g")
        .attr("transform", d => `translate(${m.l},${m.t})`);

      chart
        .append("g")
        .attr("class", "x axis")
        .attr("transform", d => `translate(${0},${h})`)
        .call(xAxis);
      chart
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Frequency");

      chart
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => {
          return xScale(d.letter);
        })
        .attr("y", (d, i) => {
          if (d.value > 0) {
            return yScale(d.value);
          } else {
            return yScale(0);
          }
        })
        .attr("width", xScale.rangeBand())
        .attr("height", (d, i) => {
          return Math.abs(yScale(d.value) - yScale(0));
        });
    }
    return <div id="graph" />;
  }
}
