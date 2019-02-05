import React, { Component } from "react";
import * as d3 from "d3";
import "./style.css";
import data from "./data";

export default class GroupBarchart2 extends Component {
  state = {
    data: {},
    svg: "",
    scales: {},
    axes: {},
    display: { w: 600, h: 300, m: { t: 20, b: 30, r: 30, l: 40 } },
    x1: {}
  };
  componentDidMount() {
    let state = this.state,
      m = state.display.m,
      w = state.display.w - m.l - m.r,
      h = state.display.h - m.t - m.b;
    console.log(m);
    let xScale = d3.scale.ordinal().rangeRoundBands([0, w], 0.4);
    let yScale = d3.scale.linear().range([h, 0]);
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
    let ageNames = d3.keys(data[0]).filter(function(key) {
      return key !== "Groups";
    });
    let Data = data.forEach(function(d) {
      d.ages = ageNames.map(function(name) {
        return { name: name, value: +d[name] };
      });
    });
    console.log(data);
    xScale.domain(
      data.map(function(d) {
        return d.Groups;
      })
    );
    x1.domain(ageNames).rangeRoundBands([0, xScale.rangeBand()]);
    yScale
      .domain([
        d3.min(data, function(d) {
          return d3.min(d.ages, function(d) {
            return d.value;
          });
        }),
        d3.max(data, function(d) {
          return d3.max(d.ages, function(d) {
            return d.value;
          });
        })
      ])
      .nice();

    this.setState({
      data: Data,
      svg: d3
        .select("#graph")
        .append("svg")
        .attr("height", h + m.t + m.b)
        .attr("width", w + m.l + m.r)
        .attr("class", "chart"),
      scales: { xScale: xScale, yScale: yScale, x1: x1 },
      axes: { xAxis: xAxis, yAxis: yAxis },
      x1: { x1: x1 }
    });
  }
  render() {
    var state = this.state,
      Data = state.data,
      svg = state.svg || false,
      m = state.display.m,
      w = state.display.w - m.l - m.r,
      h = state.display.h - m.t - m.b,
      xScale = state.scales.xScale,
      yScale = state.scales.yScale,
      xAxis = state.axes.xAxis,
      yAxis = state.axes.yAxis,
      x1 = state.x1.x1;
    console.log(this.state.data);
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
        .call(g => g.select(".domain").remove())
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value");
      {
        console.log(data);
      }
      // chart
      //   .append("g")
      //   .attr("class", "infowin")
      //   .attr("transform", d => `translate(${50},${2})`)
      //   .append("text")
      //   .attr("id", "letter");
      // chart
      //   .append("g")
      //   .attr("class", "infowin")
      //   .attr("transform", d => `translate(${120},${2})`)
      //   .append("text")
      //   .attr("id", "Val");

      let state = svg
        .append("g")
        .attr("transform", d => `translate(${m.l},${m.t})`)
        .selectAll(".groups")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "groups")
        .attr("transform", function(d) {
          return `translate(${xScale(d.Groups)},${0})`;
        });

      state
        .selectAll("rect")
        .data(function(d) {
          return d.ages;
        })
        .enter()
        .append("rect")
        .attr("Value", function(d) {
          return d.value;
        })
        .attr("Name", function(d) {
          return d.name;
        })
        .attr("rx", 6)
        .attr("ry", 6)
        // .style("fill", function(d, i) {
        //   return Color(i);
        //   Color(i);
        // })
        .attr("x", function(d, i) {
          return x1(d.name);
        })
        .attr("y", function(d) {
          if (d.value > 0) {
            return yScale(d.value);
          } else {
            return yScale(0);
          }
        })
        .attr("width", x1.rangeBand())
        .attr("height", function(d) {
          return Math.abs(yScale(d.value) - yScale(0));
        })
        .style("fill", function(d) {
          return Color(d.name);
        });
      // .attr("data-yr", function(d) {
      //   return d.value;
      // })
      // .attr("data-xr", function(d) {
      //   return d.letter;
      // })
      // .on("mouseover", function(d) {
      //   d3.select("#letter").text("Value:" + d.value);
      //   d3.select("#Val").text(d.letter);
      //   d3.select(".bar").fill("#000");
      // });
    }
    return <div id="graph" />;
  }
}
