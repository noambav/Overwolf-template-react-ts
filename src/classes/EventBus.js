export class EventBus {
  static _instance;
  constructor() {
    this._listeners = new Map();
  }

  static instance() {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
      console.log("Creating EventBus instance");
    }
    return EventBus._instance;
  }

  addListener(eventName, eventHandler) {
    this._listeners.set(eventName, eventHandler);
  }

  removeListener(eventHandler) {
    for (const [eventName, handler] of this._listeners.entries()) {
      if (handler === eventHandler) {
        this._listeners.delete(eventName);
        break;
      }
    }
  }

  trigger(eventName, eventValue) {
    const eventHandler = this._listeners.get(eventName);
    if (eventHandler) {
      console.log("Triggering");
      eventHandler(eventValue);
    }
  }
}
