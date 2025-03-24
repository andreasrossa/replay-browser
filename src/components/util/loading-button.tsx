import { Button, type ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * A wrapper around the [Button](https://ui.shadcn.com/docs/components/button) component that displays a loading spinner when the isLoading prop is true.
 * During loading, the button is disabled.
 *
 * When setting isLoading to false, the loading spinner will continue to be displayed
 * for a short duration to prevent flickering.
 *
 * This can be configured using the debounce prop (default: 180ms).
 *
 * @param { boolean } props.isLoading - Whether the button is loading.
 * @param { number } props.debounce - The debounce time for the loading spinner (default: 180ms).
 */
export default function LoadingButton({
  children,
  isLoading,
  debounce = 180,
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
  debounce?: number;
} & ButtonProps) {
  const [debouncedIsLoading, setDebouncedIsLoading] = useState(isLoading);

  // debounce the isLoading prop to prevent flickering
  useEffect(() => {
    if (isLoading) {
      setDebouncedIsLoading(true);
    } else {
      const timeout = setTimeout(() => {
        setDebouncedIsLoading(false);
      }, debounce);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, debounce]);

  return (
    <Button disabled={debouncedIsLoading} {...props}>
      <AnimatePresence mode="sync">
        {debouncedIsLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center"
          >
            <motion.div
              initial={{ width: 0, x: -10, opacity: 0 }}
              animate={{ width: "1rem", x: 0, opacity: 1 }}
              exit={{ width: 0, x: -10, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mr-1 overflow-hidden"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          </motion.div>
        )}
        <motion.div key="content">{children}</motion.div>
      </AnimatePresence>
    </Button>
  );
}
