# NUON Logo System

## Overview

The NUON logo features a clean, modern wordmark with Florence Nightingale's lamp integrated directly into the letter "U", symbolizing the platform's deep connection to nursing heritage.

### Tagline
**"Nurse United, Opportunities Nourished"**
- **Nurse United**: Emphasizes community and bringing nurses together
- **Opportunities Nourished**: Represents our commitment to cultivating professional growth

---

## What Makes It Special

- **Integrated Lamp Design** 🏮 - The iconic nursing lamp is built into the "U" of NUON
- **Animated flame** 🔥 - Gentle flickering representing the eternal light of care and knowledge
- **Clean Wordmark** ✍️ - Bold, professional typography that's instantly recognizable
- **Meaningful Tagline** 💬 - "Nurse United, Opportunities Nourished" captures our mission
- **Functional Details** ⚙️ - Handle, reservoir, spout, and wick showing authentic lamp design
- **Versatile Design** 🎨 - Works beautifully on light and dark backgrounds

---

## Logo Variants

### 1. Full Logo (Default)
- **When to use**: Primary applications, splash screens, marketing materials
- **Includes**: NUON wordmark + integrated lamp + tagline
- **Variants**: Default (dark text) and White (light backgrounds)

### 2. Horizontal Logo
- **When to use**: Navigation bars, headers, email signatures
- **Includes**: NUON wordmark + lamp (no tagline)
- **Best for**: Space-constrained areas

### 3. Icon Only
- **When to use**: App icons, favicons, social media avatars
- **Includes**: Just the "U" with lamp
- **Size**: Works from 32px to 128px+

---

## Usage Examples

```tsx
import { NuonLogo, NuonLogoHorizontal, NuonIcon } from './components/NuonLogo';

// Full logo with tagline
<NuonLogo variant="default" showTagline={true} />

// Full logo without tagline
<NuonLogo variant="white" showTagline={false} />

// Horizontal for headers
<NuonLogoHorizontal height={40} variant="default" />

// Icon for app icon
<NuonIcon size={64} variant="default" />
```

---

## Color Variants

### Default
- **Background**: Light (white/gray)
- **Text**: Dark gray (#2D3748)
- **Lamp**: Golden gradient (#FDB913 → #D4A03A)

### White
- **Background**: Dark (purple/blue/gradient)
- **Text**: White (#FFFFFF)
- **Lamp**: Golden gradient (same)

---

## Best Practices

### ✅ DO:
- Use the provided variants for different contexts
- Maintain clear space around the logo
- Use the full logo with tagline for primary branding
- Scale proportionally
- Use on appropriate backgrounds (contrast matters)

### ❌ DON'T:
- Stretch or distort the logo
- Change the lamp colors
- Recreate the logo from scratch
- Use low-resolution versions
- Place on busy backgrounds

---

## Nursing Heritage

The lamp integrated into the "U" is Florence Nightingale's iconic oil lamp, representing:
- 🏮 **"The Lady with the Lamp"** - nursing heritage since 1854
- 🔥 **Light of knowledge** - continuous learning and education
- ✨ **Hope and healing** - the light nurses bring to patients
- 🤲 **Dedication** - commitment to care in all circumstances

---

## File Structure

```
/components/NuonLogo.tsx
  ├── NuonLogo (full logo with optional tagline)
  ├── NuonLogoHorizontal (compact for headers)
  └── NuonIcon (just U with lamp)
```

---

## Quick Reference

| Component | Use Case | Props |
|-----------|----------|-------|
| `NuonLogo` | Primary branding, splash | `variant`, `showTagline`, `className` |
| `NuonLogoHorizontal` | Headers, nav bars | `height`, `variant`, `className` |
| `NuonIcon` | App icon, favicon | `size`, `variant` |

---

## Platform Integration

### Splash Screen
```tsx
<NuonLogo variant="white" showTagline={true} />
```

### Authentication
```tsx
<NuonIcon size={96} variant="white" />
```

### Dashboard Header
```tsx
<NuonLogoHorizontal height={40} variant="default" />
```

### Loading States
```tsx
<NuonIcon size={64} variant="default" />
```

---

## Brand Voice

The logo should always communicate:
- **Professional** - Clean, modern design
- **Caring** - The lamp represents compassion
- **United** - Community-focused mission
- **Growth** - Opportunities for advancement
- **Heritage** - Respect for nursing history

---

## Support

For questions about logo usage, refer to:
- `/LOGO_GUIDE.md` - Detailed brand guidelines
- `/components/LogoShowcase.tsx` - Visual examples
- `/NURSING_SYMBOLISM.md` - Deep dive into meaning

---

**Version**: 3.0 (Wordmark Integration)  
**Last Updated**: November 2025  
**Status**: ✅ Production Ready
