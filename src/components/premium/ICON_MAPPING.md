# Premium Icon Mapping

This document maps the original card concepts to their premium SVG icon replacements.

## Icon Mapping Table

| Original Concept | Premium Icon | File Location | Usage |
|-----------------|-------------|---------------|-------|
| The Course | BookStackIcon | `icons/BookStackIcon.tsx` | Course content, learning materials, education |
| Practical Execution | HammerGavelIcon | `icons/HammerGavelIcon.tsx` | Hands-on work, practical tasks, execution |
| Internship | BriefcaseIcon | `icons/BriefcaseIcon.tsx` | Business opportunities, internships, work experience |
| Live Founder Sessions | UsersIcon | `icons/UsersIcon.tsx` | Mentorship, community, collaboration |
| Pitching Competition | MegaphoneIcon | `icons/MegaphoneIcon.tsx` | Announcements, pitching, presentations |
| Certification | AwardIcon | `icons/AwardIcon.tsx` | Achievements, certifications, recognition |

## Icon Design Specifications

All icons follow these design principles:

- **Size**: 48x48 viewBox for optimal scaling
- **Stroke Width**: 2.5px for main elements, 2px for secondary
- **Colors**: Gold gradient (`#C9A34B` to `#D4AF37`)
- **Style**: Minimalist line art with subtle details
- **Accessibility**: All icons have `aria-hidden="true"` when used decoratively

## Usage Example

```tsx
import BookStackIcon from "@/components/premium/icons/BookStackIcon";

<Card
  title="The Course"
  icon={<BookStackIcon />}
  // ... other props
/>
```

## Customization

To create custom premium icons:

1. Use the same 48x48 viewBox
2. Apply gold gradient using the pattern:
```tsx
<defs>
  <linearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stopColor="#C9A34B" stopOpacity="1" />
    <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
  </linearGradient>
</defs>
```

3. Use `stroke="url(#customGradient)"` for paths
4. Keep stroke width between 2-2.5px
5. Add `aria-hidden="true"` to the SVG element

