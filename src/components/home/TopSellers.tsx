"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { scrollEase, scrollViewport } from "@/lib/motion";

export default function TopSellers() {
  const reduceMotion = useReducedMotion();

  const headerTransition = {
    duration: reduceMotion ? 0 : 0.85,
    ease: scrollEase,
  };

  const gridVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.15,
        delayChildren: reduceMotion ? 0 : 0.05,
      },
    },
  };

  const productVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 0, y: 56, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: 280,
            damping: 22,
            mass: 0.85,
          },
    },
  };

  const products = [
    { handle: "adaptogen-complex", title: "NutriZen Adaptogen+ Complex", price: "279.99", image: "/placeholder-1.jpg", badge: "Best Seller" },
    { handle: "vitacore-b", title: "NutriZen VitaCore B-Complex", price: "279.99", image: "/placeholder-2.jpg", badge: "Sale" },
    { handle: "iron-supplement", title: "NutriZen Iron+ Supplement", price: "269.99", image: "/placeholder-3.jpg" },
    { handle: "para-cleanse", title: "NutriZen Para-Cleanse Complex", price: "249.99", image: "/placeholder-4.jpg" },
  ];

  return (
    <section className="py-32 bg-background-alt relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6"
          initial={reduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={scrollViewport}
          transition={headerTransition}
        >
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-darkest mb-4">
              Targeted Supplements for Energy, Immunity & Total Wellness
            </h2>
            <p className="text-neutral-dark text-lg">
              From daily energy support to advanced detox and immune resilience, NutriZen offers premium supplements designed to support your total health.
            </p>
          </div>
          <Button variant="outline" className="hidden md:flex group">
            Explore Products
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          variants={gridVariants}
        >
          {products.map((product, i) => (
            <motion.div key={i} variants={productVariants}>
              <ProductCard
                id={product.handle}
                handle={product.handle}
                title={product.title}
                price={product.price}
                image={product.image}
                badge={product.badge}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center md:hidden">
          <Button variant="outline" fullWidth className="group">
            Explore Products
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Button>
        </div>
      </div>
    </section>
  );
}
