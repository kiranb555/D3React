import React, { Component } from "react";
import { render } from "react-dom";
import Barchart from "./Components/Barchart/Barchart.js";
import Barchart2 from "./Components/Barchart 2/Barchart2";
import GroupBarchart from "./Components/GroupBarchart/GroupBarchart";
import GroupBarchart2 from "./Components/GroupBarchart2/GroupBarchart";
import GroupBarDirect from "./Components/GroupBar_directdata/GroupBar";
import data from "./Components/GroupBar_directdata/data.json";

class ReactComponent extends Component {
  render() {
    return (
      <div>
        {/*      <Barchart />  
        <Barchart2 /> 
        <GroupBarchart />
        <GroupBarchart2 />*/}
        <GroupBarDirect data={data.slice(0, 6)} width={900} height={400} />
      </div>
    );
  }
}

render(<ReactComponent />, document.getElementById("root"));
