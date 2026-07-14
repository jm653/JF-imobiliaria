"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function StorySection({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="max-w-3xl"
      >
        {eyebrow && (
          <span className="mb-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          {title}
        </h2>
        {children && <div className="mt-8">{children}</div>}
      </motion.div>
    </section>
  );
}