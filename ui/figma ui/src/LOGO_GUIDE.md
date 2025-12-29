# NUON Brand Identity Guidelines

## Logo Overview

The NUON logo is a clean, modern wordmark with Florence Nightingale's lamp integrated into the letter "U". This design symbolizes the seamless blend of nursing heritage and modern innovation.

---

## The Tagline

### "Nurse United, Opportunities Nourished"

This powerful tagline captures our dual mission:

**Nurse United**
- Building a supportive nursing community
- Bringing nurses together across specialties and experience levels
- Creating unity in the profession

**Opportunities Nourished**
- Cultivating professional growth and development
- Nurturing career advancement
- Feeding the potential of every nurse

---

## Logo Components

### 1. The Wordmark: NUON

**Typography**: Bold, modern sans-serif  
**Color**: Dark gray (#2D3748) or White (#FFFFFF)  
**Style**: Clean, professional, highly readable

The four letters represent:
- **N** - Nurse/Nursing
- **U** - United (with integrated lamp)
- **O** - Opportunities
- **N** - Nourished

### 2. The Integrated Lamp

**Location**: Inside the letter "U"  
**Design**: Florence Nightingale's oil lamp  
**Colors**: Golden gradient (#FDB913 → #D4A03A)  
**Animation**: Gentle flame flicker (2-second cycle)

**Components**:
- Hook/handle at top
- Round oil reservoir body
- Extended spout on right
- Wick protruding from spout
- Realistic teardrop flame
- Warm orange-yellow gradient

### 3. The Tagline

**Text**: "Nurse United, Opportunities Nourished"  
**Size**: ~14px (responsive)  
**Color**: Gray (#4A5568) or White opacity 80%  
**Weight**: Medium (500)  
**Spacing**: 0.025em letter-spacing

---

## Nursing Symbolism

### Florence Nightingale's Lamp

The lamp integrated into the "U" is not decorative—it's the most iconic symbol of nursing:

**Historical Significance**:
- Florence Nightingale (1820-1910), founder of modern nursing
- Known as "The Lady with the Lamp" during the Crimean War
- Would make night rounds carrying an oil lamp
- Symbol of nursing care, dedication, and compassion

**In Our Logo**:
- **The Handle**: Carrying care wherever needed (portability)
- **The Reservoir**: Foundation of knowledge and compassion (fuel)
- **The Spout**: Directing light where it's needed (focus)
- **The Wick**: Conduit between knowledge and practice
- **The Flame**: Enlightenment, hope, and the light of care

**What It Represents**:
- 🏮 Nursing heritage and history
- 🔥 Continuous learning and knowledge
- ✨ Light in darkness / hope and healing
- 💛 Warmth and compassion
- 🤲 Dedication to patient care

---

## Logo Variants

### Full Logo
**Components**: Wordmark + Lamp + Tagline  
**Use**: Primary branding, splash screens, presentations  
**Props**: `variant`, `showTagline`, `className`

```tsx
<NuonLogo variant="default" showTagline={true} />
<NuonLogo variant="white" showTagline={false} />
```

### Horizontal Logo
**Components**: Wordmark + Lamp (no tagline)  
**Use**: Navigation bars, headers, constrained spaces  
**Props**: `height`, `variant`, `className`

```tsx
<NuonLogoHorizontal height={40} variant="default" />
```

### Icon Only
**Components**: Just "U" with lamp  
**Use**: App icon, favicon, social media avatar  
**Props**: `size`, `variant`

```tsx
<NuonIcon size={64} variant="default" />
```

---

## Color Specifications

### Default Variant (Light Backgrounds)

| Element | Color | Hex/Value |
|---------|-------|-----------|
| Wordmark | Dark Gray | #2D3748 |
| Tagline | Medium Gray | #4A5568 |
| Lamp Body | Gold Gradient Start | #FDB913 |
| Lamp Body | Gold Gradient End | #D4A03A |
| Lamp Rings | Bronze | #C89622 |
| Wick | Dark Brown | #3E2723 |
| Flame Outer | Orange | #FF9800 |
| Flame Inner | Yellow | #FFEB3B |
| Flame Glow | Light Yellow | #FFF9C4 |

### White Variant (Dark Backgrounds)

| Element | Color | Value |
|---------|-------|-------|
| Wordmark | White | #FFFFFF |
| Tagline | White 80% | rgba(255,255,255,0.8) |
| Lamp | Same as Default | (Golden gradient) |

---

## Usage Guidelines

### Clear Space
Maintain clear space around the logo equal to the height of the letter "N" on all sides.

### Minimum Size
- **Full Logo**: 200px wide minimum
- **Horizontal**: 120px wide minimum
- **Icon**: 32px minimum

### Backgrounds

✅ **Recommended Backgrounds**:
- White or light gray (default variant)
- Dark gradients: purple/blue/cyan (white variant)
- Solid dark colors (white variant)

❌ **Avoid**:
- Busy patterns or images
- Low contrast combinations
- Gradients that interfere with readability

---

## Placement Examples

### Splash Screen
```tsx
<div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600">
  <NuonLogo variant="white" showTagline={true} />
</div>
```

### Authentication Screens
```tsx
<div className="bg-purple-600">
  <NuonIcon size={96} variant="white" />
  <h1>Welcome to NUON</h1>
  <p>Nurse United, Opportunities Nourished</p>
</div>
```

### Dashboard Header
```tsx
<header className="bg-white border-b">
  <NuonLogoHorizontal height={40} variant="default" />
</header>
```

### Email Signatures
```
[Logo: NuonLogoHorizontal, height 32px]
```

---

## Animation Specifications

### Flame Animation
- **Property**: Opacity
- **Values**: 0.85 → 1.0 → 0.85
- **Duration**: 2 seconds
- **Timing**: Linear
- **Loop**: Infinite

**Purpose**: Creates a living, breathing quality that represents continuous dedication and care.

**When to Use**:
- ✅ Splash screens
- ✅ Loading states
- ✅ Authentication pages
- ❌ Static documents (PDFs, prints)

---

## Brand Voice & Tone

When using the logo, ensure surrounding messaging reflects:

### Professional
- Clean, modern design
- Healthcare expertise
- Evidence-based education

### Caring
- The lamp represents compassion
- Patient-centered approach
- Supportive community

### Empowering
- "Opportunities Nourished"
- Growth and development
- Career advancement

### United
- "Nurse United"
- Community-focused
- Collective strength

---

## Logo Philosophy

### Integration Over Separation
The lamp is not a separate icon—it's integrated into the wordmark. This represents:
- Nursing heritage is embedded in everything we do
- Modern platform built on traditional values
- Unity of past and future

### Simplicity & Clarity
- Bold, readable typography
- Uncluttered design
- Professional appearance
- Works at any size

### Meaningful Symbolism
Every element has purpose:
- **Lamp**: Nursing heritage
- **Flame**: Knowledge and care
- **Wordmark**: Brand identity
- **Tagline**: Mission statement

---

## File Formats & Exports

### For Web (Current)
- SVG components in React/TSX
- Responsive and scalable
- Animated (flame flicker)

### For Print (Future)
- Export static SVG (no animation)
- High-resolution PNG (300 DPI)
- Vector PDF for professional printing

### For Social Media
- Square icon variant (1:1 ratio)
- Minimum 512x512px
- Transparent background PNG

---

## Brand Applications

### Primary Use Cases
1. **App splash screen** - Full logo with tagline, white variant
2. **Navigation** - Horizontal logo, appropriate variant
3. **Marketing materials** - Full logo with tagline
4. **Social media** - Icon variant for avatar
5. **Email signatures** - Horizontal logo, 32-40px height

### Special Considerations

**Dark Mode**:
- Always use white variant
- Ensure golden lamp remains visible
- Test on actual dark backgrounds

**Print**:
- Use high-resolution exports
- Test in grayscale (lamp should still be distinguishable)
- Ensure minimum size requirements

**Presentations**:
- Full logo with tagline on title slide
- Horizontal logo in corner of content slides
- Consistent variant throughout

---

## Legal & Protection

### Trademark
NUON™ and the integrated lamp logo are trademarks of [Company Name].

### Usage Restrictions
- Do not modify the lamp design
- Do not change color schemes
- Do not remove the tagline in primary branding
- Do not recreate or approximate the logo
- Do not use for non-NUON purposes

### Approvals
All external use of the NUON logo requires approval from the brand team.

---

## Quick Reference

### Component Import
```tsx
import { NuonLogo, NuonLogoHorizontal, NuonIcon } from './components/NuonLogo';
```

### Props Summary

**NuonLogo**:
- `variant`: 'default' | 'white'
- `showTagline`: boolean
- `className`: string

**NuonLogoHorizontal**:
- `height`: number (px)
- `variant`: 'default' | 'white'
- `className`: string

**NuonIcon**:
- `size`: number (px)
- `variant`: 'default' | 'white'

---

## Resources

- **Live Showcase**: `/components/LogoShowcase.tsx`
- **Detailed Symbolism**: `/NURSING_SYMBOLISM.md`
- **Quick Start**: `/LOGO_README.md`
- **Design Evolution**: `/LOGO_DESIGN_EVOLUTION.md`

---

## Contact

For questions about logo usage or brand guidelines:
- **Brand Team**: [Contact info]
- **Design System**: [Link to design system]
- **Support**: [Support channel]

---

**Brand Guidelines Version**: 3.0  
**Last Updated**: November 2025  
**Next Review**: Q1 2026  
**Status**: ✅ Active & Production Ready
