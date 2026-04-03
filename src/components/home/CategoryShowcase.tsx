"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";

// Assuming we map Shopify products to this interface
export interface Product {
  id: string;
  title: string;
  /** Pre-formatted price string from Shopify (includes currency). */
  price: string;
  imageUrl?: string;
  handle: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  /** Shopify collection handle for deep links */
  handle: string;
  products: Product[];
}

export default function CategoryShowcase({ categories }: { categories: Category[] }) {
  // Guard clause against empty categories
  if (!categories || categories.length === 0) {
    return null;
  }

  const [activeCategory, setActiveCategory] = useState<Category>(categories[0]);

  useEffect(() => {
    setActiveCategory(categories[0]);
  }, [categories]);
  
  // Consistent color hashing for pill tokens
  const getColorForCategory = (title: string, isActive: boolean) => {
    // Array of brand-aligned colors: Sage Green, Muted Orange, Ocean Blue, Deep Forest Green, Pale Red, Sand
    const colors = ["#8CAB77", "#D87D4A", "#6995B1", "#425244", "#B35A5A", "#E5D9C5"];
    
    // Simple hash function for consistent mapping
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = colors[Math.abs(hash) % colors.length];

    if (isActive) {
      return {
        bg: color,
        text: "#FFFFFF",
        dot: "#E0E0E0" // Lighter dot for contrast on dark active bg
      };
    }
    
    return {
      bg: "#F2F4F0", // Soft neutral background for inactive state
      text: "#425244", // Dark text
      dot: color // Brand color dot
    };
  };

  return (
    <section className="py-24 bg-background-main relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Dynamic Category Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-darkest mb-10 font-serif">
            Start Your Journey To Better Health
          </h2>
          
          {/* Category Pill Menu */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => {
              const isActive = activeCategory.id === category.id;
              const theme = getColorForCategory(category.title, isActive);

              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: theme.bg, 
                    color: theme.text,
                    boxShadow: isActive ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
                  }}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: theme.dot }}
                  />
                  {category.title}
                </button>
              );
            })}
          </div>

          {/* Active Category Description */}
          {activeCategory.description && (
             <p className="text-neutral-dark text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed animate-fade-in">
               {activeCategory.description}
             </p>
          )}
        </div>

        {/* Dynamic Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" key={activeCategory.id}>
          {activeCategory.products.length > 0 ? (
            activeCategory.products.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                title={product.title}
                price={product.price.toString()}
                image={product.imageUrl || ''}
                handle={product.handle}
              />
            ))
          ) : (
             <div className="col-span-full py-12 text-center text-neutral-dark">
               No products found in this category.
             </div>
          )}
        </div>
        
        {/* Mobile View All (Optional) */}
        <div className="mt-10 flex justify-center md:hidden">
           <Link
             href={`/shop?collection=${encodeURIComponent(activeCategory.handle)}`}
             className="group inline-flex w-full items-center justify-center rounded-2xl border-2 border-primary px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/5"
           >
             Explore {activeCategory.title}
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
           </Link>
        </div>

      </div>
    </section>
  );
}
