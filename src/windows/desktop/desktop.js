import React from "react";
import ReactDOM from "react-dom";
import App from "../../pages/App.tsx";
import "../../assets/css/title-bar.css";
import { AppWindow } from "../../classes/AppWindow";
import { kWindowNames } from "../../constants/consts";

new AppWindow(kWindowNames.desktop);

ReactDOM.render(<App />, document.getElementById("root"));
