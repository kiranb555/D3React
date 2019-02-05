import React, { Component } from "react";
import * as d3 from "d3";
import "./GroupBarchart.css";
import data from "./data";

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
    let xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0.2);
    let yScale = d3.scale.linear().range([h, 0]);
    let color = d3.scale.ordinal().range(["red", "blue"]);
    let x1 = d3.scale.ordinal();

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
    // let data = this.state.data;
    let ageNames = d3.keys(
      data.filter(function(key) {
        return key != "Letter";
      })
    );
    data.forEach(function(d) {
      d.ages = ageNames.map(function(name) {
        return { name: name, value: +d[name] };
      });
    });

    let Data = data.map(function(d) {
      return { letter: d.Letter, value: d.Freq };
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
      let Color = d3.scale.ordinal().range(["#688dea", "#81efde"]);
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
        .text("Value");
      chart
        .append("g")
        .attr("class", "infowin")
        .attr("transform", d => `translate(${50},${2})`)
        .append("text")
        .attr("id", "letter");
      chart
        .append("g")
        .attr("class", "infowin")
        .attr("transform", d => `translate(${120},${2})`)
        .append("text")
        .attr("id", "Val");

      chart
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", function(d, i) {
          return Color(i);
          Color(i);
        })
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
        })
        .attr("data-yr", function(d) {
          return d.value;
        })
        .attr("data-xr", function(d) {
          return d.letter;
        })
        .on("mouseover", function(d) {
          d3.select("#letter").text("Value:" + d.value);
          d3.select("#Val").text(d.letter);
          d3.select(".bar").fill("#000");
        });
    }
    return <div id="graph" />;
  }
}
