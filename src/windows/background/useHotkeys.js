import { useEffect } from "react";

const useHotkeys = (ingameWindow, desktopWindow) => {
  console.log("In useHotkeys");
  const toggleWindowVisibility = (windowId) => {
    window.overwolf.windows.getWindowState(windowId, (result) => {
      if (result.success) {
        const windowState = result.window_state;
        if (windowState === "normal" || windowState === "maximized") {
          window.overwolf.windows.minimize(windowId);
        } else {
          window.overwolf.windows.restore(windowId);
        }
      }
    });
  };

  useEffect(() => {
    const hotkeyListener = (event) => {
      if (event.name === "in_game_showhide") {
        if (ingameWindow) {
          window.overwolf.windows.getWindowState(ingameWindow.id, (result) => {
            if (result?.success && result.window_id) {
              toggleWindowVisibility(result.window_id);
            }
          });
        }
      } else if (event.name === "second_monitor_showhide") {
        if (desktopWindow) {
          window.overwolf.windows.getWindowState(desktopWindow.id, (result) => {
            if (result?.success && result.window_id) {
              toggleWindowVisibility(result.window_id);
            }
          });
        }
      }
    };

    window.overwolf.settings.hotkeys.onPressed.addListener(hotkeyListener);

    return () => {
      window.overwolf.settings.hotkeys.onPressed.removeListener(hotkeyListener);
    };
  }, [ingameWindow]);

  return null;
};

export default useHotkeys;
