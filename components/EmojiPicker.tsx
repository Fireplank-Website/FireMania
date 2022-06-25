import React, { useEffect, useRef } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";

const EmojiPicker = (props: any) => {
  const ref = useRef(null);
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    new Picker({ ...props, data, ref });
    executedRef.current = true;
  }, []);

  return <div ref={ref} />;
};

export default EmojiPicker;