import {
  OWWindow,
  OWGameListener,
  OWGames,
  OWHotkeys,
} from "@overwolf/overwolf-api-ts";
import { kHotkeys, kWindowNames } from "../../constants/consts";
import { EventBus } from "../../classes/EventBus";

const HOTKEY_NAMES = {
  inGameToggle: "in_game_showhide",
  secondMonitorToggle: "second_monitor_showhide",
};
const WINDOW_STATES = {
  NORMAL: "normal",
  MINIMIZED: "minimized",
  MAXIMIZED: "maximized",
  CLOSED: "closed",
};

class BackgroundController {
  static _instance;
  _windows = {};
  _gameListener;
  _secondMonitor;

  constructor() {
    this._gameListener = new OWGameListener({
      onGameStarted: this.toggleWindows.bind(this),
      onGameEnded: this.toggleWindows.bind(this),
    });

    window.overwolf?.extensions.onAppLaunchTriggered.addListener((e) =>
      this.onAppLaunchTriggered(e)
    );

    this.setToggleHotkeyBehavior();

    this.init();
  }

  static instance() {
    if (!BackgroundController._instance) {
      console.log("Making background controller instance");
      BackgroundController._instance = new BackgroundController();
    }
    return BackgroundController._instance;
  }

  async init() {
    await this.getSecondMonitor();

    this._windows = {
      [kWindowNames.desktop]: new OWWindow(kWindowNames.desktop),
      [kWindowNames.inGame]: new OWWindow(kWindowNames.inGame),
      [kWindowNames.secondMonitor]: new OWWindow(kWindowNames.secondMonitor),
    };

    //Should be available using overwolf.windows.getMainWindow()
    console.log("Calling event bus from background controller");
    window.EventBus = EventBus.instance();
  }

  async run() {
    this._gameListener.start();

    const currWindowName = (await this.isGameRunning())
      ? kWindowNames.inGame
      : kWindowNames.desktop;

    this._windows[currWindowName].restore();

    if (currWindowName === kWindowNames.inGame) {
      if (this._secondMonitor) {
        console.log("Showing second monitor", this._secondMonitor);
        this.showSecondMonitor();
      }
    }
  }

  showSecondMonitor() {
    const secondMonitorWindow = this._windows[kWindowNames.secondMonitor];
    secondMonitorWindow.restore();

    window.overwolf.windows.getWindow(kWindowNames.secondMonitor, (res) => {
      console.log("Second window ", res);

      const height = res.window.height;
      const width = res.window.width;

      const x = Math.round(
        this._secondMonitor.x + this._secondMonitor.width / 2 - width / 2
      );
      const y = Math.round(
        this._secondMonitor.y + this._secondMonitor.height / 2 - height / 2
      );

      window.overwolf.windows.changePosition(kWindowNames.secondMonitor, x, y);
    });
  }

  getSecondMonitor() {
    window.overwolf.utils.getMonitorsList((result) => {
      const displays = result.displays;
      console.log(displays);

      const primaryMonitor = displays.find(
        (monitor) => monitor.is_primary === true
      );
      const sideBySideMonitor = displays.find((monitor) => {
        return (
          monitor.is_primary === false && Math.abs(monitor.x) > primaryMonitor.x
        );
      });

      this._secondMonitor = sideBySideMonitor;
    });
  }

  async onAppLaunchTriggered(e) {
    console.log("In background controller onAppLaunchTriggered", e);

    if (!e || e.origin.includes("gamelaunchevent")) {
      return;
    }

    if (await this.isGameRunning()) {
      this._windows[kWindowNames.desktop].close();
      this._windows[kWindowNames.inGame].restore();
      if (this._secondMonitor)
        this._windows[kWindowNames.secondMonitor].restore();
    } else {
      this._windows[kWindowNames.desktop].restore();
      this._windows[kWindowNames.inGame].close();
      if (this._secondMonitor)
        this._windows[kWindowNames.secondMonitor].close();
    }
  }

  toggleWindows(info) {
    if (info.isRunning) {
      this._windows[kWindowNames.desktop].close();
      this._windows[kWindowNames.inGame].restore();
      if (this._secondMonitor)
        this._windows[kWindowNames.secondMonitor].restore();
    } else {
      this._windows[kWindowNames.desktop].restore();
      this._windows[kWindowNames.inGame].close();
      if (this._secondMonitor)
        this._windows[kWindowNames.secondMonitor].close();
    }
  }
  async setToggleHotkeyBehavior() {
    const toggleHotkeyWindow = async (hotkeyResult) => {
      console.log("Hotkey pressed ", hotkeyResult);

      let windowName;
      if (hotkeyResult.name === kHotkeys.inGameToggle)
        windowName = kWindowNames.inGame;
      else if (hotkeyResult.name === kHotkeys.secondMonitorToggle)
        windowName = kWindowNames.secondMonitor;

      const window = this._windows[windowName];
      const windowState = await window.getWindowState();

      if (
        windowState.window_state === WINDOW_STATES.NORMAL ||
        windowState.window_state === WINDOW_STATES.MAXIMIZED
      ) {
        window.minimize();
      } else if (
        windowState.window_state === WINDOW_STATES.MINIMIZED ||
        windowState.window_state === WINDOW_STATES.CLOSED
      ) {
        window.restore();
      }
    };
    console.log("Listening to hotkeys");

    OWHotkeys.onHotkeyDown(HOTKEY_NAMES.inGameToggle, toggleHotkeyWindow);

    OWHotkeys.onHotkeyDown(
      HOTKEY_NAMES.secondMonitorToggle,
      toggleHotkeyWindow
    );
  }

  async isGameRunning() {
    const info = await OWGames.getRunningGameInfo();
    return info && info.isRunning;
  }
}

BackgroundController.instance().run();
