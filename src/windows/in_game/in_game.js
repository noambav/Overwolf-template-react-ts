import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../../pages/App";
import "../../assets/css/title-bar.css";
import { AppWindow } from "../../classes/AppWindow";
import { kHotkeys, kWindowNames } from "../../constants/consts";
import { useRunningGame } from "overwolf-hooks";

new AppWindow(kWindowNames.inGame);

ReactDOM.render(<App />, document.getElementById("root"));
