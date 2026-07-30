"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const KEY_CODE_MAP: Record<string, string> = {
  Escape: "esc",
  F1: "f1", F2: "f2", F3: "f3", F4: "f4", F5: "f5", F6: "f6",
  F7: "f7", F8: "f8", F9: "f9", F10: "f10", F11: "f11", F12: "f12",
  F13: "f13", F14: "f14", F15: "f15", F16: "f16", F17: "f17", F18: "f18", F19: "f19",
  Backquote: "`", Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5",
  Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0",
  Minus: "-", Equal: "=", Backspace: "delete",
  Tab: "tab", KeyQ: "q", KeyW: "w", KeyE: "e", KeyR: "r", KeyT: "t", KeyY: "y",
  KeyU: "u", KeyI: "i", KeyO: "o", KeyP: "p",
  BracketLeft: "[", BracketRight: "]", Backslash: "\\",
  CapsLock: "caps lock", KeyA: "a", KeyS: "s", KeyD: "d", KeyF: "f", KeyG: "g",
  KeyH: "h", KeyJ: "j", KeyK: "k", KeyL: "l", Semicolon: ";", Quote: "'", Enter: "return",
  ShiftLeft: "shift", ShiftRight: "shift", KeyZ: "z", KeyX: "x", KeyC: "c", KeyV: "v",
  KeyB: "b", KeyN: "n", KeyM: "m", Comma: ",", Period: ".", Slash: "/",
  ControlLeft: "control", ControlRight: "control",
  AltLeft: "option", AltRight: "option",
  MetaLeft: "command", MetaRight: "command",
  Space: "space",
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  Home: "home", End: "end", PageUp: "page up", PageDown: "page down",
  Delete: "forward delete", NumLock: "clear",
  NumpadEqual: "=", NumpadDivide: "/", NumpadMultiply: "*",
  NumpadSubtract: "numpad -", NumpadAdd: "numpad +", NumpadEnter: "numpad enter",
  Numpad1: "numpad 1", Numpad2: "numpad 2", Numpad3: "numpad 3", Numpad4: "numpad 4",
  Numpad5: "numpad 5", Numpad6: "numpad 6", Numpad7: "numpad 7", Numpad8: "numpad 8",
  Numpad9: "numpad 9", Numpad0: "numpad 0", NumpadDecimal: "numpad .",
};

const PREVENT_DEFAULT_KEYS = new Set([
  "space", "tab", "up", "down", "left", "right",
  "page up", "page down", "home", "end", "delete",
]);

function isEditableTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT");
}

export interface InteractiveKeyboardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onKeyPress'> {
  onKeyClick?: (key: string) => void;
  onKeyPress?: (key: string) => void;
}

export function InteractiveKeyboard({ className, onKeyClick, onKeyPress, onPointerEnter, onPointerLeave, ...props }: InteractiveKeyboardProps) {
  const [capsLock, setCapsLock] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const hoverRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hoverRef.current || isEditableTarget(event.target)) return;
      const keyName = KEY_CODE_MAP[event.code];
      if (!keyName) return;
      if (PREVENT_DEFAULT_KEYS.has(keyName)) event.preventDefault();
      if (event.repeat) return;
      if (keyName === "caps lock") {
        setCapsLock(event.getModifierState("CapsLock"));
      } else {
        setPressedKeys((prev) => new Set(prev).add(keyName));
      }
      onKeyPress?.(keyName);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const keyName = KEY_CODE_MAP[event.code];
      if (!keyName) return;
      setPressedKeys((prev) => {
        // macOS swallows keyup events while command is held, so releasing
        // command clears everything to avoid stuck keys
        if (keyName === "command") return new Set();
        if (!prev.has(keyName)) return prev;
        const next = new Set(prev);
        next.delete(keyName);
        return next;
      });
    };

    const handleBlur = () => setPressedKeys(new Set());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [onKeyPress]);

  const handleKeyClick = (keyName: string) => {
    if (keyName === "caps lock") {
      setCapsLock(!capsLock);
    }
    onKeyClick?.(keyName);
  };

  const keyProps = (keyName: string) => ({
    onClick: () => handleKeyClick(keyName),
    "data-pressed": pressedKeys.has(keyName) || undefined,
  });

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    hoverRef.current = true;
    onPointerEnter?.(event);
  };

  const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    hoverRef.current = false;
    setPressedKeys(new Set());
    onPointerLeave?.(event);
  };

  return (
    <div
      className={cn("interactive-keyboard-wrapper", className)}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <style>{`
        .interactive-keyboard-wrapper {
          --kb-key-top: hsl(0,0%,99%);
          --kb-key-bottom: hsl(0,0%,93%);
          --kb-text: hsl(0,0%,40%);
          --kb-key-shadow:
            0 0 0.02em 0.01em hsla(0,0%,0%,0.45),
            0 0.05em 0.06em hsla(0,0%,0%,0.28),
            0 0.03em 0.02em hsla(0,0%,100%,0.95) inset,
            0 -0.04em 0.05em hsla(0,0%,0%,0.12) inset;
          --kb-key-shadow-pressed:
            0 0 0.02em 0.01em hsla(0,0%,0%,0.5),
            0 0.01em 0.02em hsla(0,0%,0%,0.2),
            0 0.02em 0.04em hsla(0,0%,0%,0.18) inset,
            0 -0.02em 0.03em hsla(0,0%,100%,0.4) inset;
          --kb-press-brightness: 0.96;
          --kb-focus-bg: hsl(0,0%,100%);
          --kb-focus-text: hsl(0,0%,54%);

          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          display: flex;
          width: 100%;
          justify-content: center;
          padding: 4em;
        }

        :is(.dark) .interactive-keyboard-wrapper {
          --kb-key-top: #18181b;
          --kb-key-bottom: #0c0b10;
          --kb-text: #b4b4bc;
          --kb-key-shadow:
            0 0 0.02em 0.01em rgba(0,0,0,0.9),
            0 0.05em 0.07em rgba(0,0,0,0.55),
            0 0.03em 0.02em rgba(255,255,255,0.09) inset,
            0 -0.04em 0.06em rgba(0,0,0,0.6) inset;
          --kb-key-shadow-pressed:
            0 0 0.02em 0.01em rgba(0,0,0,0.95),
            0 0.01em 0.02em rgba(0,0,0,0.5),
            0 0.03em 0.05em rgba(0,0,0,0.8) inset,
            0 -0.02em 0.02em rgba(255,255,255,0.05) inset;
          --kb-press-brightness: 1.25;
          --kb-focus-bg: #222224;
          --kb-focus-text: #ffffff;
        }

        .interactive-keyboard-wrapper button {
          background-image: linear-gradient(180deg, var(--kb-key-top), var(--kb-key-bottom));
          border-radius: 0.15em;
          box-shadow: var(--kb-key-shadow);
          color: var(--kb-text);
          display: block;
          font-size: 1em;
          outline: transparent;
          position: relative;
          transition: transform 60ms ease, box-shadow 60ms ease, filter 60ms ease;
          -webkit-appearance: none;
          appearance: none;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          border: 0;
          margin: 0;
          padding: 0;
          cursor: pointer;
        }

        .interactive-keyboard-wrapper button:active,
        .interactive-keyboard-wrapper button[data-pressed] {
          box-shadow: var(--kb-key-shadow-pressed);
          transform: translateY(0.04em) scale(0.97);
          filter: brightness(var(--kb-press-brightness));
        }
        .interactive-keyboard-wrapper button:focus-visible {
          background-color: var(--kb-focus-bg);
          color: var(--kb-focus-text);
        }
        .interactive-keyboard-wrapper button span {
          display: inline-flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
        }
        .interactive-keyboard-wrapper button > span {
          margin: auto;
          padding: 0.2em 0.375em;
          position: absolute;
          top: 50%;
          left: 0;
          font-size: 0.5em;
          line-height: 2;
          transform: translateY(-50%) scaleX(0.875);
          width: 100%;
        }
        .interactive-keyboard-wrapper button[aria-pressed="true"] .dot-light {
          color: hsl(88,100%,50%);
          text-shadow: 0 0 2px hsl(88,100%,27%);
        }

        /* Keyboard */
        .ikb-keyboard {
          background-image: linear-gradient(90deg,hsl(0,0%,53%),hsl(0,0%,80%));
          border-radius: 0.5em;
          box-shadow:
            -1em -1em 1.5em hsla(0,0%,0%,0.6),
            0 0 0 1px hsl(0,0%,67%) inset;
          display: grid;
          gap: 0.375em 0.875em;
          grid-template-columns: 21.25em 4.125em 5.65em;
          grid-template-rows: 0.75em 1.125em 1.125em 1.125em 1.125em 1.375em;
          font-size: clamp(8px, 2.5vw, 24px);
          margin: auto;
          padding: 0.25em;
          width: 33.25em;
          height: 9em;
        }

        :is(.dark) .interactive-keyboard-wrapper .ikb-keyboard {
           background-image: linear-gradient(135deg, #1b1b1e, #070708);
           box-shadow:
             0 2em 4em -1em rgba(0,0,0,0.6),
             0 0 0 1px rgba(255,255,255,0.07) inset,
             0 1px 1px rgba(255,255,255,0.12) inset;
        }

        .ikb-row {
          display: flex;
          gap: 0.35em;
        }
        .ikb-row:nth-of-type(14) {
          margin: auto;
        }
        .ikb-row:nth-of-type(n + 14):nth-of-type(-3n + 17) {
          transform: translateY(0.25em);
        }
        .interactive-keyboard-wrapper button > span.ikb-bump {
          border-radius: 0.1em;
          box-shadow: -0.05em -0.02em 0 0.05em hsla(0,0%,0%,0.3);
          padding: 0;
          top: 85%;
          left: calc(50% - 0.4em);
          width: 0.8em;
          height: 0.15em;
          transform: none;
        }

        /* Button size */
        .ikb-btn-0 { width: 1.19em; height: 0.75em; }
        .ikb-btn-1 { width: 1.125em; height: 0.75em; }
        .ikb-btn-2 { width: 1.125em; height: 1.125em; }
        .ikb-btn-3 { width: 2em; height: 1.125em; }
        .ikb-btn-4 { width: 2.3em; height: 1.125em; }
        .ikb-btn-5 { width: 3.05em; height: 1.125em; }
        .ikb-btn-6 { width: 1.5625em; height: 1.375em; }
        .ikb-btn-7 { width: 1.8375em; height: 1.375em; }
        .ikb-btn-8 { width: 1.125em; height: 1.375em; }
        .ikb-btn-9 { width: 2.6875em; height: 1.375em; }
        .ikb-btn-10 { width: 1.125em; height: 2.875em; }
        .ikb-btn-longest { width: 8.625em; height: 1.375em; }

        /* Alignment */
        .interactive-keyboard-wrapper button > span.ikb-ul, 
        .interactive-keyboard-wrapper button > span.ikb-ll, 
        .interactive-keyboard-wrapper button > span.ikb-ur, 
        .interactive-keyboard-wrapper button > span.ikb-lr { top: 0; transform: scaleX(0.875); }
        .interactive-keyboard-wrapper button > span.ikb-ul, 
        .interactive-keyboard-wrapper button > span.ikb-ll { justify-content: flex-start; transform-origin: 0 50%; }
        .interactive-keyboard-wrapper button > span.ikb-ur, 
        .interactive-keyboard-wrapper button > span.ikb-lr { justify-content: flex-end; transform-origin: 100% 50%; }
        .interactive-keyboard-wrapper button > span.ikb-ll, 
        .interactive-keyboard-wrapper button > span.ikb-lr { top: auto; bottom: 0; }
        .interactive-keyboard-wrapper button > span.ikb-noxscale { transform: translateY(-50%) scaleX(1); }
        .interactive-keyboard-wrapper button > span.ikb-ll.ikb-noxscale, 
        .interactive-keyboard-wrapper button > span.ikb-lr.ikb-noxscale { transform: scaleX(1); }

        /* Fonts */
        .interactive-keyboard-wrapper button > span.ikb-xxxs { font-size: 0.2em; line-height: 1.5; }
        .interactive-keyboard-wrapper button > span.ikb-xxs { font-size: 0.25em; line-height: 1.5; }
        .interactive-keyboard-wrapper button > span.ikb-xs { font-size: 0.3em; line-height: 1.125; }
        .interactive-keyboard-wrapper button > span.ikb-sm { font-size: 0.4em; line-height: 1.25; }

        /* Icons */
        .ikb-up, .ikb-right, .ikb-down, .ikb-left { width: 0; height: 0; vertical-align: 0.1em; }
        .ikb-up { border-left: 0.25em solid transparent; border-right: 0.25em solid transparent; border-bottom: 0.5em solid currentColor; }
        .ikb-right { border-left: 0.5em solid currentColor; border-top: 0.25em solid transparent; border-bottom: 0.25em solid transparent; }
        .ikb-down { border-left: 0.25em solid transparent; border-right: 0.25em solid transparent; border-top: 0.5em solid currentColor; }
        .ikb-left { border-right: 0.5em solid currentColor; border-top: 0.25em solid transparent; border-bottom: 0.25em solid transparent; }
        
        .ikb-pause { border-left: 0.2em solid; border-right: 0.2em solid; vertical-align: 0.1em; width: 0.475em; height: 0.5em; }
        .ikb-emoji { filter: saturate(0); -webkit-filter: saturate(0); }
        
        .ikb-block { margin-left: 0.1em; height: 0.8em; width: 0.6em; vertical-align: 0.1em; }
        .ikb-cascade { position: relative; height: 1em; width: 1.2em; }
        .ikb-cascade:before, .ikb-cascade:after { content: ""; position: absolute; height: 0.45em; width: 0.8em; }
        .ikb-cascade:before { top: 0; left: 0; }
        .ikb-cascade:after { right: 0; bottom: 0; }
        
        .ikb-block, .ikb-cascade:before, .ikb-cascade:after { border: 1px solid; }
        .ikb-apps:before, .ikb-apps:after { font-weight: bold; display: block; content: "\\25A1\\25A1\\25A1"; line-height: 0.875; }
        
        .interactive-keyboard-wrapper button > span.ikb-noxpad { padding: 0.2em 0; }
      `}</style>
      
      <div className="ikb-keyboard">
        <div className="ikb-row">
          <button type="button" className="ikb-btn-0" {...keyProps("esc")}><span className="ikb-xs">esc</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f1")}><span className="ikb-xs ikb-noxscale"><span className="ikb-emoji">&#128261;</span></span><span className="ikb-lr ikb-xxxs">F1</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f2")}><span className="ikb-xs ikb-noxscale"><span className="ikb-emoji">&#128262;</span></span><span className="ikb-lr ikb-xxxs">F2</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f3")}><span className="ikb-xs ikb-noxscale"><span className="ikb-cascade"></span><span className="ikb-block"></span></span><span className="ikb-lr ikb-xxxs">F3</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f4")}><span className="ikb-xxxs ikb-noxscale"><span className="ikb-apps"></span></span><span className="ikb-lr ikb-xxxs">F4</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f5")}><span className="ikb-lr ikb-xxxs">F5</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f6")}><span className="ikb-lr ikb-xxxs">F6</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f7")}><span className="ikb-sm"><span className="ikb-left"></span><span className="ikb-left"></span></span><span className="ikb-lr ikb-xxxs">F7</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f8")}><span className="ikb-sm"><span className="ikb-right"></span><span className="ikb-pause"></span></span><span className="ikb-lr ikb-xxxs">F8</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f9")}><span className="ikb-sm"><span className="ikb-right"></span><span className="ikb-right"></span></span><span className="ikb-lr ikb-xxxs">F9</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f10")}><span className="ikb-xs ikb-noxscale"><span className="ikb-emoji">&#128264;</span></span><span className="ikb-lr ikb-xxxs">F10</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f11")}><span className="ikb-xs ikb-noxscale"><span className="ikb-emoji">&#128265;</span></span><span className="ikb-lr ikb-xxxs">F11</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("f12")}><span className="ikb-xs ikb-noxscale"><span className="ikb-emoji">&#128266;</span></span><span className="ikb-lr ikb-xxxs">F12</span></button>
          <button type="button" className="ikb-btn-0" {...keyProps("eject")}><span className="ikb-xs ikb-noxscale">⏏</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-1" {...keyProps("f13")}><span className="ikb-lr ikb-xxxs">F13</span></button>
          <button type="button" className="ikb-btn-1" {...keyProps("f14")}><span className="ikb-lr ikb-xxxs">F14</span></button>
          <button type="button" className="ikb-btn-1" {...keyProps("f15")}><span className="ikb-lr ikb-xxxs">F15</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-1" {...keyProps("f16")}><span className="ikb-lr ikb-xxxs">F16</span></button>
          <button type="button" className="ikb-btn-1" {...keyProps("f17")}><span className="ikb-lr ikb-xxxs">F17</span></button>
          <button type="button" className="ikb-btn-1" {...keyProps("f18")}><span className="ikb-lr ikb-xxxs">F18</span></button>
          <button type="button" className="ikb-btn-1" {...keyProps("f19")}><span className="ikb-lr ikb-xxxs">F19</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("`")}><span className="ikb-sm">~<br/>`</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("1")}><span className="ikb-sm">!<br/>1</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("2")}><span className="ikb-sm">@<br/>2</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("3")}><span className="ikb-sm">#<br/>3</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("4")}><span className="ikb-sm">$<br/>4</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("5")}><span className="ikb-sm">%<br/>5</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("6")}><span className="ikb-sm">^<br/>6</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("7")}><span className="ikb-sm">&amp;<br/>7</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("8")}><span className="ikb-sm">*<br/>8</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("9")}><span className="ikb-sm">(<br/>9</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("0")}><span className="ikb-sm">)<br/>0</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("-")}><span className="ikb-sm">_<br/>-</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("=")}><span className="ikb-sm">+<br/>=</span></button>
          <button type="button" className="ikb-btn-3" {...keyProps("delete")}><span className="ikb-lr ikb-xs">delete</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("fn")}><span className="ikb-xs">fn</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("home")}><span className="ikb-xs">home</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("page up")}><span className="ikb-xs">page up</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("clear")}><span className="ikb-xs">clear</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("=")}><span>=</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("/")}><span>/</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("*")}><span>*</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-3" {...keyProps("tab")}><span className="ikb-ll ikb-xs">tab</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("q")}><span>Q</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("w")}><span>W</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("e")}><span>E</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("r")}><span>R</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("t")}><span>T</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("y")}><span>Y</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("u")}><span>U</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("i")}><span>I</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("o")}><span>O</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("p")}><span>P</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("[")}><span className="ikb-sm">&#123;<br/>[</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("]")}><span className="ikb-sm">&#125;<br/>]</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("\\")}><span className="ikb-sm">|<br/>\</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("forward delete")}>
            <span className="ikb-xs flex flex-col items-center leading-tight">
              <span>del</span>
              <span className="text-[1.5em] leading-none mt-0.5">⌦</span>
            </span>
          </button>
          <button type="button" className="ikb-btn-2" {...keyProps("end")}><span className="ikb-xs">end</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("page down")}><span className="ikb-xs">page down</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 7")}><span>7</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 8")}><span>8</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 9")}><span>9</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad -")}><span>-</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-4" aria-pressed={capsLock} {...keyProps("caps lock")}>
            <span className="ikb-ul ikb-xs dot-light" aria-hidden="true">•</span>
            <span className="ikb-ll ikb-xs">caps lock</span>
          </button>
          <button type="button" className="ikb-btn-2" {...keyProps("a")}><span>A</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("s")}><span>S</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("d")}><span>D</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("f")}><span>F</span><span className="ikb-bump"></span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("g")}><span>G</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("h")}><span>H</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("j")}><span>J</span><span className="ikb-bump"></span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("k")}><span>K</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("l")}><span>L</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps(";")}><span className="ikb-sm">:<br/>;</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("'")}><span className="ikb-sm">&quot;<br/>&#39;</span></button>
          <button type="button" className="ikb-btn-4" {...keyProps("return")}><span className="ikb-lr ikb-xs">return</span></button>
        </div>
        <div className="ikb-row"></div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 4")}><span>4</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 5")}><span>5</span><span className="ikb-bump"></span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 6")}><span>6</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad +")}><span>+</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-5" {...keyProps("shift")}><span className="ikb-ll ikb-xs">shift</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("z")}><span>Z</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("x")}><span>X</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("c")}><span>C</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("v")}><span>V</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("b")}><span>B</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("n")}><span>N</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("m")}><span>M</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps(",")}><span className="ikb-sm">&lt;<br/>,</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps(".")}><span className="ikb-sm">&gt;<br/>.</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("/")}><span className="ikb-sm">?<br/>/</span></button>
          <button type="button" className="ikb-btn-5" {...keyProps("shift")}><span className="ikb-lr ikb-xs">shift</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("up")}><span><span className="ikb-up"></span></span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 1")}><span>1</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 2")}><span>2</span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("numpad 3")}><span>3</span></button>
          <button type="button" className="ikb-btn-10" {...keyProps("numpad enter")}><span className="ikb-lr ikb-xs">enter</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-7" {...keyProps("control")}><span className="ikb-ll ikb-xs">control</span></button>
          <button type="button" className="ikb-btn-6" {...keyProps("option")}><span className="ikb-ul ikb-xxs">alt</span><span className="ikb-ll ikb-xs">option</span></button>
          <button type="button" className="ikb-btn-7" {...keyProps("command")}>
            <span className="ikb-ll ikb-xs flex items-center gap-[0.3em]">
              <span className="ikb-noxscale text-[1.2em] relative top-[1px]">⌘</span>
              <span>command</span>
            </span>
          </button>
          <button type="button" className="ikb-btn-longest" {...keyProps("space")}><span></span></button>
          <button type="button" className="ikb-btn-7" {...keyProps("command")}>
            <span className="ikb-ll ikb-xs flex items-center gap-[0.3em]">
              <span className="ikb-noxscale text-[1.2em] relative top-[1px]">⌘</span>
              <span>command</span>
            </span>
          </button>
          <button type="button" className="ikb-btn-6" {...keyProps("option")}><span className="ikb-ur ikb-xxs">alt</span><span className="ikb-lr ikb-xs">option</span></button>
          <button type="button" className="ikb-btn-7" {...keyProps("control")}><span className="ikb-lr ikb-xs">control</span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-2" {...keyProps("left")}><span><span className="ikb-left"></span></span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("down")}><span><span className="ikb-down"></span></span></button>
          <button type="button" className="ikb-btn-2" {...keyProps("right")}><span><span className="ikb-right"></span></span></button>
        </div>
        <div className="ikb-row">
          <button type="button" className="ikb-btn-9" {...keyProps("numpad 0")}><span>0</span></button>
          <button type="button" className="ikb-btn-8" {...keyProps("numpad .")}><span>.</span></button>
        </div>
      </div>
    </div>
  );
}

export default InteractiveKeyboard;
