import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import App from "../../pages/App";
import "../../assets/css/title-bar.css";
import { AppWindow } from "../../classes/AppWindow";
import { kHotkeys, kWindowNames } from "../../constants/consts";
import { useRunningGame } from "overwolf-hooks";

const options = { displayLog: false };

function MyComponent() {
  const [runningGame] = useRunningGame(options);
  const [binding, setBinding] = useState("");
  const infoText = `Press ${binding} to show/hide`;

  useEffect(() => {
    window.overwolf.settings.hotkeys.get((res) => {
      let hotkey;
      if (res.success) {
        const gameID = runningGame?.id;
        if (res.games[gameID]) {
          console.log(res.games[gameID]);
          hotkey = res.games[gameID].find(
            (hotkey) => hotkey.name === kHotkeys.secondMonitorToggle
          );
        } else
          hotkey = res.globals.find(
            (hotkey) => hotkey.name === kHotkeys.secondMonitorToggle
          );
        console.log(hotkey);
        if (hotkey?.binding) setBinding(hotkey?.binding);
      }
    });

    window.overwolf.settings.hotkeys.onChanged.addListener((res) => {
      console.log("Hotkey changed event");
      if (binding !== res.binding) setBinding(res.binding);
    });
  }, [runningGame]);

  useEffect(() => {
    if (binding === "") return;
    // add header component position absolute
    const header = document.getElementById("header");
    const infoTextElement = document.createElement("div");
    infoTextElement.classList.add("info-text");
    infoTextElement.textContent = infoText;
    header.appendChild(infoTextElement);

    return () => {
      header.removeChild(infoTextElement);
    };
  }, [binding]);

  return <App />;
}

new AppWindow(kWindowNames.secondMonitor);

ReactDOM.render(<MyComponent />, document.getElementById("root"));
