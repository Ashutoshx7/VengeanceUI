"use client";

import React, { useState } from "react";
import { InteractiveKeyboard } from "@/components/ui/interactive-keyboard";

export function InteractiveKeyboardDemo() {
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    setLastKeyPressed(key);
  };

  return (
    <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-8 rounded-xl overflow-visible relative">
      <div className="w-full pb-8 -mx-8 px-8 flex justify-center items-start">
        <InteractiveKeyboard onKeyClick={handleKeyPress} onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}

export default InteractiveKeyboardDemo;
