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
      className="fixed z-50 flex items-center justify-start gap-3 px-5 py-2 -translate-x-1/2 bg-white border w-fit top-5 left-1/2 rounded-xl border-neutral-300"
    >
      <Info size={20} />
      <p className="text-black">{message}</p>
    </motion.div>
  );
}