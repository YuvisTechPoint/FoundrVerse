"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Card, { CardProps } from "./Card";

interface CardsGridProps {
  cards: CardProps[];
  className?: string;
  containerClassName?: string;
}

export default function CardsGrid({
  cards,
  className,
  containerClassName,
}: CardsGridProps) {
  return (
    <div
      className={cn(
        "premium-bg-gradient min-h-screen py-16 md:py-24 px-4 sm:px-6 lg:px-8",
        containerClassName
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-9",
            className
          )}
        >
          {cards.map((card, index) => (
            <Card key={card.title || index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}

