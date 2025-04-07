"use client";

import {
  type HTMLMotionProps,
  motion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

export default function AnimatedNumber({
  value,
  ...spanProps
}: { value: number } & HTMLMotionProps<"span">) {
  const spring = useSpring(value, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span {...spanProps}>{display}</motion.span>;
}
