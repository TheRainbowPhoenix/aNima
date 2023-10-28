class KeyBindingHandler {
  private keyBindings: { [key: number]: { key: KeyData; name: string }[] } = {};
  private keyState: { [key: number]: number } = {};

  private specialKeysNumbers: { [key: string]: number } = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    "pause/break": 19,
    "caps lock": 20,
    esc: 27,
    space: 32,
    "page up": 33,
    "page down": 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    command: 91,
    "right click": 93,
    "numpad *": 106,
    "numpad +": 107,
    "numpad -": 109,
    "numpad .": 110,
    "numpad /": 111,
    "num lock": 144,
    "scroll lock": 145,
    "my computer": 182,
    "my calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    '"': 222,
  };

  private aliasesKeysNumbers: { [key: string]: number } = {
    windows: 91,
    "⇧": 16,
    "⌥": 18,
    "⌃": 17,
    "⌘": 91,
    ctl: 17,
    control: 17,
    option: 18,
    pause: 19,
    break: 19,
    caps: 20,
    return: 13,
    escape: 27,
    spc: 32,
    pgup: 33,
    pgdn: 33,
    ins: 45,
    del: 46,
    cmd: 91,
  };

  // onAction, onActionReleased
  constructor(
    private onAction: (action: string, repeat: boolean) => void,
    private onActionReleased: (action: string) => void
  ) {
    // window.addEventListener('keydown', this.onKeyDown.bind(this));
    // window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    const { keyCode, shiftKey, metaKey, ctrlKey, altKey } = event;
    const key = this.keyBindings[keyCode];

    if (key) {
      const lastKeyPressTime = this.keyState[keyCode];
      const repeat =
        typeof lastKeyPressTime !== "undefined" &&
        Date.now() - lastKeyPressTime < 1000;

      for (let i = 0; i < key.length; i++) {
        const binding = key[i];
        const bindingKey = binding.key;
        if (
          bindingKey.shift === shiftKey &&
          bindingKey.command === metaKey &&
          bindingKey.ctrl === ctrlKey &&
          bindingKey.alt === altKey
        ) {
          this.onKeyPress(binding.name, repeat);
          event.preventDefault();
          event.stopPropagation();
        }
      }
      this.keyState[keyCode] = Date.now();
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const { keyCode } = event;
    const key = this.keyBindings[keyCode];

    if (key) {
      delete this.keyState[keyCode];
      for (let i = 0; i < key.length; i++) {
        const binding = key[i];
        const bindingKey = binding.key;
        if (
          bindingKey.shift === event.shiftKey &&
          bindingKey.command === event.metaKey &&
          bindingKey.ctrl === event.ctrlKey &&
          bindingKey.alt === event.altKey
        ) {
          this.onKeyUp(binding.name);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
  }

  parse(keyBindings: KeyBindingData[]) {
    this.keyBindings = {};
    this.keyState = {};

    for (let i = 0; i < keyBindings.length; i++) {
      const binding = keyBindings[i];
      if (binding.keys) {
        const keyData: KeyData = {
          code: null,
          command: false,
          shift: false,
          ctrl: false,
          alt: false,
        };

        for (let j = 0; j < binding.keys.length; j++) {
          const keyCode = this.getKeyCode(binding.keys[j]); // this.index.getKeyCode(...)
          switch (keyCode) {
            case 91:
              keyData.command = true;
              break;
            case 16:
              keyData.shift = true;
              break;
            case 17:
              keyData.ctrl = true;
              break;
            case 18:
              keyData.alt = true;
              break;
            default:
              keyData.code = keyCode;
          }
        }

        if (keyData.code) {
          const keyList = this.keyBindings[keyData.code] || [];
          keyList.push({
            key: keyData,
            name: binding.action,
          });
          this.keyBindings[keyData.code] = keyList;
        }
      }
    }
  }

  getKeyBinding(action: string) {
    return this.keyBindings[action];
  }

  private getKeyCode(key: string) {
    // TODO: keycode.js
    // Define your custom key mappings here if needed
    // This example includes only basic key mappings
    const keyMappings: { [key: string]: number } = {
      // Define your custom key mappings here, e.g., "space": 32
    };

    return keyMappings[key] || key.charCodeAt(0);
  }
}

// Example usage
const onKeyPressCallback = (action: string, repeat: boolean) => {
  // Handle key press
};

const onKeyUpCallback = (action: string) => {
  // Handle key up
};

const keyBindingsData: KeyBindingData[] = [
  // Define your key bindings data
];

const keyMap = new KeyBindingHandler(onKeyPressCallback, onKeyUpCallback);
keyMap.parse(keyBindingsData);

// Later usage
// const event: KeyboardEvent = /* your KeyboardEvent */;
// keyMap.onKeyDown(event);
// keyMap.onKeyUp(event);
// const keyBinding = keyMap.getKeyBinding(action);

interface KeyData {
  code: number | null;
  command: boolean;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
}

interface KeyBindingData {
  keys: string[];
  action: string;
}
