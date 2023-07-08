"use client";

import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { Info } from "lucide-react";

export default function Toast({
  key,
  message,
  atom,
}: {
  key: string;
  message: string;
  atom: any;
}) {
  const [_onSuccess, setOnSuccess] = useAtom(atom);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOnSuccess(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setOnSuccess]);

  return (
    <motion.div
      key={key}
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      className="fixed left-1/2 top-5 z-50 flex w-fit -translate-x-1/2 items-center justify-start gap-3 rounded-xl border border-neutral-300 bg-white px-5 py-2"
    >
      <Info size={20} />
      <p className="text-black">{message}</p>
    </motion.div>
  );
}
