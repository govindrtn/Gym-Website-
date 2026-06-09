import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import "./animated-text.css";

function ShimmeringText({
  text,
  className,
  duration = 2600,
  delay = 0,
  color = "rgb(203 213 225)",
  shimmerColor = "rgb(255 255 255)",
}) {
  return (
    <span
      className={cn("shimmering-text", className)}
      style={{
        "--shimmer-duration": `${duration}ms`,
        "--shimmer-delay": `${delay}ms`,
        "--shimmer-base": color,
        "--shimmer-highlight": shimmerColor,
      }}
    >
      {text}
    </span>
  );
}

function TypingText({
  text,
  texts,
  className,
  cursorClassName,
  speed = 70,
  pauseDuration = 1800,
  loop = false,
}) {
  const textQueue = useMemo(() => (texts?.length ? texts : [text ?? ""]), [text, texts]);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const currentText = textQueue[textIndex] ?? "";

    if (displayText.length < currentText.length) {
      const timeout = window.setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, speed);

      return () => window.clearTimeout(timeout);
    }

    if (loop && textQueue.length > 1) {
      const timeout = window.setTimeout(() => {
        setDisplayText("");
        setTextIndex((current) => (current + 1) % textQueue.length);
      }, pauseDuration);

      return () => window.clearTimeout(timeout);
    }
  }, [displayText, loop, pauseDuration, speed, textIndex, textQueue]);

  return (
    <span className={cn("typing-text", className)}>
      {displayText}
      <span className={cn("typing-cursor", cursorClassName)} aria-hidden="true" />
    </span>
  );
}

function WordRotate({ words, className, duration = 1800 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!words?.length) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % words.length);
    }, duration);

    return () => window.clearInterval(interval);
  }, [duration, words]);

  if (!words?.length) {
    return null;
  }

  return (
    <span className={cn("word-rotate", className)} key={words[index]}>
      {words[index]}
    </span>
  );
}

export { ShimmeringText, TypingText, WordRotate };
