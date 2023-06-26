export const kWindowNames = {
  inGame: "in_game",
  desktop: "desktop",
  background: "background",
  secondMonitor: "second_monitor",
};

export const kHotkeys = {
  inGameToggle: "in_game_showhide",
  secondMonitorToggle: "second_monitor_showhide",
};

export const EVENTS = {
  onSkip: new CustomEvent("onSkip"),
  onQueueUpdate: (queue) => new CustomEvent("onQueueUpdate", { detail: queue }),
  onTogglePlayUpdate: (isPaused) =>
    new CustomEvent("onTogglePlayUpdate", { detail: isPaused }),
  onToggleLoopUpdate: (isLooped) =>
    new CustomEvent("onToggleLoopUpdate", { detail: isLooped }),
  onPlayerStateUpdate: (playerState) =>
    new CustomEvent("onPlayerStateUpdate", { detail: playerState }),
  onPlayerDestroy: () => new CustomEvent("onPlayerDestroy"),
};
