# CPS Club Website - Style Guide

## Color Palette (Cricket.com.au Inspired)

### Primary Colors
- **Primary Blue**: `#003DA5` - Used for headings, buttons, links, primary CTAs
- **Secondary Blue**: `#0052CC` - Used for gradients, highlights, secondary elements
- **Dark Navy**: `#001a4d` - Used for dark backgrounds, deep text

### Accent Colors
- **Gold**: `#FFB81C` - Used for highlights, badges, accents (matches cricket theme)
- **Text Gray**: `#666666` - Used for body text, secondary information
- **Light Gray**: `#f3f4f6` - Used for backgrounds, dividers

## Typography

### Font Family
- **Primary**: System fonts (best rendering across all devices)
  ```
  -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 
  'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
  ```

### Font Sizes & Line Heights

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 48px | 700 | 52px |
| H2 | 36px | 700 | 40px |
| H3 | 28px | 600 | 36px |
| H4 | 22px | 600 | - |
| Body (p) | 16px | 400 | 24px |
| Small (sm) | 14px | 400 | 20px |
| Extra Small (xs) | 12px | 400 | 16px |

## Usage Examples

### Headings
```html
<!-- H1 - Main page headings -->
<h1>CPS Cricket Club</h1>

<!-- H2 - Section headings -->
<h2>About <span class="text-[var(--color-primary-2)]">CPS Club</span></h2>

<!-- H3 - Subsection headings -->
<h3>Team Selection Works</h3>
```

### Color Usage
```html
<!-- Primary button -->
<button class="bg-[var(--color-primary)] text-white">
  Register Now
</button>

<!-- Primary text -->
<p class="text-[var(--color-primary)]">Important information</p>

<!-- Accent highlight -->
<span class="text-[var(--color-accent)]">Special Highlight</span>

<!-- Secondary link -->
<a href="#" class="text-[var(--color-primary-2)]">Learn More</a>
```

### Gradients
```html
<!-- Primary gradient -->
<div class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-2)]">
  Gradient Content
</div>

<!-- Accent gradient -->
<div class="bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-primary-2)] to-[var(--color-accent)]">
  Ticker Content
</div>
```

## CSS Variables

All colors are available as CSS variables:
- `--color-primary`: #003DA5 (primary blue)
- `--color-primary-2`: #0052CC (secondary blue)
- `--color-accent`: #FFB81C (gold)
- `--color-dark`: #001a4d (dark navy)
- `--color-muted`: #666666 (text gray)
- `--font-sans`: System fonts

## Responsive Design

Use Tailwind's responsive prefixes:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```html
<h1 class="text-4xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>
```

## Spacing

Standard spacing scale (in pixels):
- `px-4` = 16px
- `py-6` = 24px
- `gap-8` = 32px
- `mb-6` = 24px margin-bottom

## Buttons & CTAs

### Primary Button
```html
<button class="bg-gradient-to-r from-[var(--color-primary-2)] to-[var(--color-accent)] 
                text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl 
                hover:scale-105 transform transition-all duration-200 font-semibold">
  Register Now
</button>
```

### Secondary Button
```html
<button class="border-2 border-[var(--color-primary)] text-[var(--color-primary)]
                px-6 py-3 rounded-lg hover:bg-[var(--color-primary)]/5 transition-colors">
  Learn More
</button>
```

## Updated March 2025

Last updated to match cricket.com.au professional standards while maintaining CPS Club branding.
