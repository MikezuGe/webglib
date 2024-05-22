interface AddInputOptionsShared {
  name: string;
  mode?: string;
}

interface AddInputOptionsCheckbox extends AddInputOptionsShared {
  type: "checkbox";
  name: string;
  initialValue: boolean;
  onInput?: (value: boolean) => void;
}

interface AddInputOptionsRange extends AddInputOptionsShared {
  type: "range";
  name: string;
  min: number;
  max: number;
  step: number;
  initialValue: number;
  onInput?: (value: number) => void;
}

type AddInputOptions = AddInputOptionsCheckbox | AddInputOptionsRange;

const modeContainerIndex = 1;
const generalMode = "General";

export class Inputs {
  private readonly _container = document.createElement("div");
  private readonly _modeSeletor = document.createElement("select");
  private readonly _modeContainerMap = new Map<string, HTMLDivElement>();
  private readonly _modeChangeListeners: ((mode: string) => void)[] = [];

  public constructor() {
    this._container.style.position = "absolute";
    this._container.style.top = "5px";
    this._container.style.left = "5px";
    this._container.style.backgroundColor = "white";
    this._container.style.padding = "5px";
    this._container.style.borderRadius = "5px";
    this._container.style.zIndex = "10";

    this._modeSeletor.addEventListener("change", this._setMode.bind(this));
    this._container.appendChild(this._modeSeletor);
    document.body.appendChild(this._container);
  }

  public addModeChangeListener(fn: (mode: string) => void): void {
    this._modeChangeListeners.push(fn);
  }

  public addInput(options: AddInputOptions): HTMLInputElement {
    const mode = options.mode ?? generalMode;
    const modeContainer =
      this._modeContainerMap.get(mode) ?? this._addModeContainer(mode);
    const nameContainer = document.createElement("div");
    const inputContainer = document.createElement("div");
    const input = document.createElement("input");
    const valueContainer = document.createElement("div");

    nameContainer.textContent = options.name;
    valueContainer.textContent = `${options.initialValue}`;
    inputContainer.appendChild(input);
    modeContainer.appendChild(nameContainer);
    modeContainer.appendChild(inputContainer);
    modeContainer.appendChild(valueContainer);

    switch (options.type) {
      case "checkbox":
        input.type = "checkbox";
        input.checked = options.initialValue;
        input.addEventListener(
          "change",
          options.onInput
            ? (event): void => {
                valueContainer.textContent = `${
                  (event.target as HTMLInputElement).checked
                }`;
                options.onInput?.((event.target as HTMLInputElement).checked);
              }
            : (event): void => {
                valueContainer.textContent = `${
                  (event.target as HTMLInputElement).checked
                }`;
              }
        );
        break;
      case "range":
        input.type = "range";
        input.min = `${options.min}`;
        input.max = `${options.max}`;
        input.step = `${options.step}`;
        input.value = `${options.initialValue}`;

        input.addEventListener(
          "input",
          options.onInput
            ? (event): void => {
                valueContainer.textContent = (
                  event.target! as HTMLInputElement
                ).value;
                options.onInput?.(
                  parseFloat((event.target as HTMLInputElement).value)
                );
              }
            : (event): void => {
                valueContainer.textContent = (
                  event.target as HTMLInputElement
                ).value;
              }
        );
        break;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Invalid input type: ${options}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (this._container.childNodes.length < 2) {
      this._modeSeletor.value = mode;
      this._setMode();
    }

    return input;
  }

  private _addModeContainer(mode: string): HTMLDivElement {
    const modeContainer = document.createElement("div");
    modeContainer.style.display = "grid";
    modeContainer.style.gridTemplateColumns = "1fr 2fr 1fr";
    modeContainer.style.gap = "2px";
    modeContainer.style.justifyItems = "center";
    modeContainer.style.alignItems = "center";
    this._modeContainerMap.set(mode, modeContainer);
    this._modeSeletor.appendChild(new Option(mode, mode));
    return modeContainer;
  }

  private _setMode(): void {
    const mode = this._modeSeletor.value;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    this._container.childNodes[modeContainerIndex]?.remove();
    const modeContainer = this._modeContainerMap.get(mode);
    if (modeContainer) {
      this._container.appendChild(modeContainer);
    }
    for (const fn of this._modeChangeListeners) {
      fn(mode);
    }
  }
}
