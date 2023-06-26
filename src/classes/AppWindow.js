import { OWWindow } from "@overwolf/overwolf-api-ts";
import windowCloseSVG from "../assets/img/window_close.svg";
import windowMinimizeSVG from "../assets/img/window_minimize.svg";
import windowMaximizeSVG from "../assets/img/window_maximize.svg";
import windowRestoreSVG from "../assets/img/window_restore.svg";
import windowHotkeySVG from "../assets/img/window_settings.svg";
import { kWindowNames } from "../constants/consts";
// A base class for the app's foreground windows.
// Sets the modal and drag behaviors, which are shared accross the desktop and in-game windows.
export class AppWindow {
  constructor(windowName) {
    this.mainWindow = new OWWindow("background");
    this.currWindow = new OWWindow(windowName);

    const closeButton = document.getElementById("closeButton");
    const maximizeButton = document.getElementById("maximizeButton");
    const minimizeButton = document.getElementById("minimizeButton");
    const hotkeyButton = document.getElementById("hotkeyButton");

    const header = document.getElementById("header");

    closeButton.innerHTML = windowCloseSVG;
    maximizeButton.innerHTML = !this.maximized
      ? windowMaximizeSVG
      : windowRestoreSVG;
    minimizeButton.innerHTML = windowMinimizeSVG;
    hotkeyButton.innerHTML = windowHotkeySVG;

    this.setDrag(header);

    header.addEventListener("dblclick", (e) => {
      if (e.target !== header) {
        return;
      }

      if (!this.maximized) {
        this.currWindow.maximize();
      } else {
        this.currWindow.restore();
      }

      this.maximized = !this.maximized;
    });

    closeButton.addEventListener("click", () => {
      if (windowName !== kWindowNames.secondMonitor) this.mainWindow.close();
      else this.currWindow.close();
    });

    minimizeButton.addEventListener("click", () => {
      this.currWindow.minimize();
    });

    maximizeButton.addEventListener("click", () => {
      if (!this.maximized) {
        this.currWindow.maximize();
      } else {
        this.currWindow.restore();
      }

      this.maximized = !this.maximized;
    });

    hotkeyButton.addEventListener("click", () => {
      window.location.href =
        "overwolf://settings/games-overlay?hotkey=in_game_showhide";
    });
  }

  async getWindowState() {
    return await this.currWindow.getWindowState();
  }

  async setDrag(elem) {
    this.currWindow.dragMove(elem);
  }
}
