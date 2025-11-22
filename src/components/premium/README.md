# Premium Royal Cards Component

A premium, royal, high-end card grid component system built with Next.js, TypeScript, and Tailwind CSS.

## Overview

This component system provides a luxurious, enterprise-grade card grid with:
- Deep navy/indigo backgrounds with rich gold accents
- Refined serif typography (Playfair Display) for headings
- Soft glass-like card surfaces with subtle depth
- Premium SVG icons with gradient fills
- Smooth micro-interactions and hover effects
- Full accessibility support (a11y)
- Responsive design (1 col mobile, 2 col tablet, 3 col desktop)

## Components

### `Card.tsx`
The main card component with premium styling.

**Props:**
- `title` (string, required): Card title (max 3 words recommended)
- `subtitle` (string, optional): Small uppercase subtitle (max 6-8 words)
- `description` (string, required): Card description (max 25-30 words)
- `icon` (ReactNode, required): SVG icon component
- `featured` (boolean, optional): Adds gold border and "Featured" badge
- `className` (string, optional): Additional CSS classes
- `onClick` (function, optional): Click handler
- `ariaLabel` (string, optional): Accessibility label

**Example:**
```tsx
<Card
  title="The Course"
  subtitle="Foundation"
  description="30-Day Startup Blueprint. Build idea, product, brand, marketing, growth, funding."
  icon={<BookStackIcon />}
  featured={true}
/>
```

### `IconBadge.tsx`
Floating badge component with halo glow effect for icons.

**Props:**
- `icon` (ReactNode, required): SVG icon
- `size` ("sm" | "md" | "lg", optional): Badge size (default: "md")
- `accent` ("gold" | "blue" | "default", optional): Accent color (default: "gold")
- `className` (string, optional): Additional CSS classes
- `ariaLabel` (string, optional): Accessibility label
- `decorative` (boolean, optional): Mark as decorative (default: false)

### `CardsGrid.tsx`
Responsive grid container for cards.

**Props:**
- `cards` (CardProps[], required): Array of card data
- `className` (string, optional): Additional CSS classes for grid
- `containerClassName` (string, optional): Additional CSS classes for container

**Example:**
```tsx
<CardsGrid
  cards={premiumCards}
  className="custom-grid-class"
/>
```

## Icons

Premium SVG icons are located in `src/components/premium/icons/`:

1. **BookStackIcon** - For course/learning content
2. **HammerGavelIcon** - For practical execution/hands-on work
3. **BriefcaseIcon** - For internships/business opportunities
4. **UsersIcon** - For mentorship/community
5. **MegaphoneIcon** - For pitching/announcements
6. **AwardIcon** - For certifications/achievements

All icons use gold gradient fills and are optimized SVGs.

## CSS Variables

Premium theme variables are defined in `globals.css`:

```css
--premium-bg: #08102A;                    /* Deep navy background */
--premium-card-bg: rgba(255, 255, 255, 0.98);  /* Glass-like card */
--premium-gold: #C9A34B;                  /* Royal gold */
--premium-gold-light: #D4AF37;            /* Lighter gold accent */
--premium-muted: #475569;                 /* Muted text color */
--premium-ivory: #F7F6F4;                  /* Off-white */
--premium-glass-shadow: 0 18px 30px rgba(2, 6, 23, 0.45);
--premium-glass-shadow-hover: 0 24px 40px rgba(2, 6, 23, 0.6);
--premium-glow-gold: rgba(201, 163, 75, 0.3);
```

## Usage

### Basic Example

```tsx
import CardsGrid from "@/components/premium/CardsGrid";
import Card, { CardProps } from "@/components/premium/Card";
import BookStackIcon from "@/components/premium/icons/BookStackIcon";

const cards: CardProps[] = [
  {
    title: "The Course",
    subtitle: "Foundation",
    description: "30-Day Startup Blueprint.",
    icon: <BookStackIcon />,
    featured: true,
  },
];

export default function MyPage() {
  return <CardsGrid cards={cards} />;
}
```

### Full Demo

See `src/app/premium-cards/page.tsx` for a complete example with all 6 cards.

## Styling

### Custom Classes

The component uses utility classes and CSS custom properties:

- `.premium-card` - Base card styling
- `.premium-card-featured` - Featured card with gold border
- `.premium-icon-badge` - Icon badge with halo effect
- `.premium-bg-gradient` - Background gradient for sections

### Tailwind Colors

Premium colors are available in Tailwind config:

```tsx
className="bg-premium-bg text-premium-gold"
```

## Accessibility

- Semantic HTML (`<article>`, `<h3>`)
- ARIA labels and roles
- Keyboard navigation support
- Focus states with visible rings
- Sufficient color contrast (WCAG AA compliant)
- Decorative icons marked with `aria-hidden`

## Performance

- SVGs are inlined and optimized
- CSS animations use `transform` and `opacity` for GPU acceleration
- Lazy loading ready (use Next.js Image for raster assets)
- Minimal layout shift

## Typography

- **Headings**: Playfair Display (serif) - elegant and refined
- **Body**: Inter (sans-serif) - clean and readable
- Fonts are loaded via Next.js font optimization

## Responsive Breakpoints

- **Mobile (sm)**: 1 column
- **Tablet (md)**: 2 columns
- **Desktop (lg+)**: 3 columns

## Migration Guide

To replace existing cards with premium cards:

1. Import the components:
```tsx
import CardsGrid from "@/components/premium/CardsGrid";
import Card, { CardProps } from "@/components/premium/Card";
```

2. Replace icon imports with premium icons:
```tsx
// Old: import { BookOpen } from "lucide-react";
// New:
import BookStackIcon from "@/components/premium/icons/BookStackIcon";
```

3. Update card data structure:
```tsx
const cards: CardProps[] = [
  {
    title: "Title",
    subtitle: "Optional Subtitle",
    description: "Description text",
    icon: <BookStackIcon />,
    featured: false, // Set to true for featured card
  },
];
```

4. Replace grid component:
```tsx
// Old: <div className="grid...">
// New:
<CardsGrid cards={cards} />
```

## Notes

- Featured cards have a gold border and slightly warmer background
- Hover effects include subtle lift (translateY -6px) and scale (1.01)
- Icon badges have a micro-tilt animation on hover
- All animations use 180-240ms ease-out timing
- Cards are keyboard accessible (Enter/Space to activate)

