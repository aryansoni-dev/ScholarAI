---
name: StudyAI
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#cebdff'
  on-tertiary: '#381385'
  tertiary-container: '#9b7fed'
  on-tertiary-container: '#31057e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#e8ddff'
  tertiary-fixed-dim: '#cebdff'
  on-tertiary-fixed: '#21005e'
  on-tertiary-fixed-variant: '#4f319c'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is defined by a sophisticated, "deep-space" aesthetic that prioritizes focus and academic clarity within a high-end SaaS environment. The personality is professional, calm, and intellectually empowering. 

By merging **Minimalism** with **Glassmorphism**, the interface achieves a sense of layered intelligence. Surfaces are treated as semi-translucent lenses, suggesting depth and data transparency. The visual language uses soft luminescence rather than harsh lines to guide the user's eye, creating a premium atmosphere that reduces cognitive load during long study sessions.

## Colors

The palette is anchored in a near-black "Midnight" base to maximize contrast with glowing UI elements. 

- **Primary:** A vibrant Violet used for high-intent actions and active states.
- **Secondary:** A crisp Electric Blue for secondary information and supportive highlights.
- **Neutral:** A range of deep grays and slates that provide structure without introducing visual noise.
- **Accents:** Subtle gradients blending primary and secondary hues are reserved for "AI-generated" content areas and premium feature callouts.

## Typography

The system utilizes **Inter** for its exceptional legibility and neutral, modern character. 

Hierarchy is established through weight and color rather than excessive scale. Headlines use a tighter letter-spacing and heavier weights to feel "grounded" against the ethereal glass backgrounds. Body text maintains a generous line height (1.6) to ensure long-form educational content is easy to digest. Labels and metadata utilize a semi-bold weight and slight tracking to distinguish them from interactive elements.

## Layout & Spacing

This design system employs a **Fixed Grid** model for desktop experiences to maintain a disciplined, "dashboard" feel, while transitioning to a fluid model for mobile. 

A 12-column grid provides the structural foundation. Content is often contained within "Glass Panes" (cards) that follow an 8px spacing rhythm. Large-scale layouts use significant padding (48px+) around primary AI chat zones to create a "Zen" mode, focusing the user's attention on the dialogue and study materials.

## Elevation & Depth

Depth is communicated through **Glassmorphism** and luminosity rather than traditional drop shadows.

1.  **Level 0 (Canvas):** The base background, near-black and static.
2.  **Level 1 (Panes):** Large containers using a subtle `backdrop-filter: blur(20px)` and a thin, 1px semi-transparent border.
3.  **Level 2 (Popovers/Modals):** Increased transparency and a subtle outer glow using the primary purple color at 10% opacity.
4.  **Interactive States:** Elements "lift" toward the user using a soft, diffused inner glow to simulate light hitting the edge of a glass surface.

## Shapes

The shape language is friendly yet structured. A medium-to-large corner radius (16px/1rem for standard components) is used to soften the technical nature of the AI. 

- **Containers:** 24px (1.5rem) radius for main app sections.
- **Cards/Inputs:** 16px (1rem) radius for content blocks.
- **Buttons:** 12px (0.75rem) radius for a modern, tactile feel.
- **Status Indicators:** Fully rounded (pill) shapes.

## Components

### Buttons
Primary buttons feature a linear gradient (Purple to Blue) with a soft outer glow. Secondary buttons use the "Glass Pane" style with a high-contrast white or primary-colored label. Hover states should trigger a subtle increase in glow intensity.

### Input Fields
Search and chat inputs are treated as recessed glass wells. They utilize a `0.05` opacity white background and a `1px` border that transitions to a Primary Purple glow when focused.

### Chat Bubbles
User messages are represented by dark, high-contrast bubbles, while AI responses are housed in glassmorphic containers with a subtle left-hand accent border in Primary Purple to denote the "source" of the intelligence.

### Cards & Chips
Cards use the standard glass style. Chips for "Study Topics" or "Tags" use a low-opacity fill of the primary or secondary color to keep the interface colorful but legible.

### Progress Indicators
Thin, glowing lines for course completion or AI processing states. These should use a gradient to imply motion and energy.