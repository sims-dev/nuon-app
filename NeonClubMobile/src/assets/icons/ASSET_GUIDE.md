# NUON - Complete Asset Download Guide

## 📦 What's Been Created

I've exported **60 SVG icons** from your NUON app as standalone files in the `/icons` directory.

## 🎨 Icon List by Category

### Navigation & UI (11 icons)
- ✅ `home.svg` - Bottom navigation home
- ✅ `chevron-left.svg` - Back navigation (used extensively)
- ✅ `chevron-right.svg` - Forward navigation, list items
- ✅ `bell.svg` - Notifications
- ✅ `settings.svg` - Settings/preferences
- ✅ `search.svg` - Search functionality
- ✅ `filter.svg` - Filtering options
- ✅ `x.svg` - Close buttons
- ✅ `arrow-right.svg` - Action buttons
- ✅ `check.svg` - Checkmarks
- ✅ `check-circle.svg` - Success states

### User & Profile (8 icons)
- ✅ `user.svg` - Single user, profile
- ✅ `users.svg` - Multiple users, mentorship
- ✅ `phone.svg` - Phone authentication, contact
- ✅ `mail.svg` - Email, contact
- ✅ `map-pin.svg` - Location
- ✅ `edit.svg` - Edit profile
- ✅ `log-out.svg` - Logout
- ✅ `briefcase.svg` - Work/profession

### Medical & Education (7 icons)
- ✅ `book-open.svg` - Courses, learning
- ✅ `graduation-cap.svg` - Education, completion
- ✅ `award.svg` - Achievements, certifications
- ✅ `heart.svg` - Healthcare, nursing
- ✅ `trophy.svg` - Championship program
- ✅ `file-check.svg` - Certifications
- ✅ `file-text.svg` - Documents, forms

### Actions & Status (9 icons)
- ✅ `lock.svg` - Locked content
- ✅ `download.svg` - Download certificates
- ✅ `share-2.svg` - Sharing
- ✅ `send.svg` - Send messages, submit
- ✅ `copy.svg` - Copy referral codes
- ✅ `alert-circle.svg` - Warnings, alerts
- ✅ `play.svg` - Video playback
- ✅ `thumbs-up.svg` - Feedback
- ✅ `external-link.svg` - External resources

### Activities & Events (8 icons)
- ✅ `calendar.svg` - Events, scheduling
- ✅ `clock.svg` - Time, duration
- ✅ `video.svg` - Video sessions
- ✅ `mic.svg` - Audio enabled
- ✅ `mic-off.svg` - Audio muted
- ✅ `video-off.svg` - Video disabled
- ✅ `camera.svg` - Camera/photo
- ✅ `lamp.svg` - Nightingale theme

### Commerce & Payment (8 icons)
- ✅ `indian-rupee.svg` - Pricing, payments
- ✅ `credit-card.svg` - Card payment
- ✅ `wallet.svg` - Wallet payment
- ✅ `building-2.svg` - Organizations
- ✅ `shopping-cart.svg` - Purchases
- ✅ `gift.svg` - Referrals, discounts
- ✅ `tag.svg` - Coupon codes
- ✅ `receipt.svg` - Order history

### Communication (6 icons)
- ✅ `message-square.svg` - Messages
- ✅ `message-circle.svg` - Chat
- ✅ `facebook.svg` - Social sharing
- ✅ `twitter.svg` - Social sharing
- ✅ `help-circle.svg` - Help/support

### Special Effects (3 icons)
- ✅ `sparkles.svg` - Celebration, premium features
- ✅ `star.svg` - Ratings, favorites
- ✅ `trending-up.svg` - Progress, growth
- ✅ `image.svg` - Image placeholder

## 📍 Component Usage Map

### Most Used Icons:
1. **chevron-left.svg** - Used in 20+ components for back navigation
2. **calendar.svg** - Activities, Events, Sessions, Bookings
3. **clock.svg** - Time displays across all scheduling
4. **users.svg** - Mentorship, Collaborators, Networking
5. **sparkles.svg** - Splash Screen, Celebration Modal, Premium Features

### By Component:

#### **SplashScreen.tsx**
- sparkles.svg

#### **PhoneOTPAuth.tsx**
- phone.svg
- arrow-right.svg
- sparkles.svg

#### **NurseDetailsForm.tsx**
- user.svg
- briefcase.svg
- building-2.svg
- map-pin.svg
- calendar.svg
- award.svg
- chevron-right.svg

#### **NewDashboard.tsx**
- bell.svg
- chevron-right.svg
- calendar.svg
- book-open.svg
- users.svg
- award.svg
- trending-up.svg
- sparkles.svg
- play.svg
- user.svg

#### **Activities.tsx**
- chevron-left.svg
- search.svg
- filter.svg
- calendar.svg
- clock.svg
- video.svg
- users.svg
- book-open.svg
- map-pin.svg
- indian-rupee.svg

#### **MentorshipSessions.tsx**
- calendar.svg
- clock.svg
- video.svg
- chevron-left.svg
- search.svg
- filter.svg

#### **Payment.tsx**
- chevron-left.svg
- credit-card.svg
- wallet.svg
- building-2.svg
- check-circle.svg
- indian-rupee.svg
- gift.svg
- tag.svg
- x.svg
- alert-circle.svg

#### **VideoSession.tsx**
- chevron-left.svg
- video.svg
- mic.svg
- mic-off.svg
- video-off.svg
- phone.svg
- message-square.svg
- users.svg
- clock.svg
- camera.svg

#### **Profile.tsx**
- chevron-right.svg
- user.svg
- bell.svg
- lock.svg
- help-circle.svg
- file-text.svg
- log-out.svg
- edit.svg
- mail.svg
- phone.svg
- map-pin.svg
- award.svg
- graduation-cap.svg
- receipt.svg
- share-2.svg
- gift.svg

## 🎨 How to Use These Icons

### Option 1: Direct SVG Use
```html
<img src="/icons/sparkles.svg" alt="Sparkles" class="w-6 h-6 text-purple-500" />
```

### Option 2: Inline SVG (Best for Styling)
Copy the SVG code directly into your HTML/JSX for full color control:
```jsx
<svg className="w-6 h-6 text-cyan-400" ...>
  {/* SVG paths */}
</svg>
```

### Option 3: CSS Background
```css
.icon-sparkles {
  background-image: url('/icons/sparkles.svg');
  background-size: contain;
  width: 24px;
  height: 24px;
}
```

### Option 4: Convert to PNG
Use online tools like:
- https://svgtopng.com/
- https://cloudconvert.com/svg-to-png
- Figma (import SVG, export as PNG)

## 🎨 Customizing Colors

All icons use `currentColor` which means they inherit the text color:

**In Tailwind:**
```jsx
<img src="/icons/bell.svg" className="text-pink-500" />
```

**In CSS:**
```css
.my-icon {
  color: #ff00ff; /* Neon pink */
}
```

**Direct SVG Edit:**
Change `stroke="currentColor"` to `stroke="#ff00ff"` in the SVG file.

## 🎨 NUON Color Palette

Use these colors when customizing icons:

```css
/* NUON Colors */
--blue: #2563eb      /* Blue-600 */
--purple: #9333ea    /* Purple-600 */
--pink: #ec4899      /* Pink-500 */
--cyan: #06b6d4      /* Cyan-500 */
--orange: #f97316    /* Orange-500 */

/* Backgrounds */
--dark: #0f172a      /* Slate-900 */
--card: #1e293b      /* Slate-800 */
```

## 📥 Images from Unsplash

Your app uses Unsplash for photos. Here's how to download them:

### Images Currently in Use:

1. **Nurse Photos** - Search: "nurse professional"
2. **Medical Education** - Search: "medical training"
3. **Video Conferencing** - Search: "video call"
4. **Achievement/Celebration** - Search: "celebration confetti"
5. **Learning/Books** - Search: "online learning"
6. **Healthcare Team** - Search: "healthcare team"

### Download from Unsplash:
1. Visit https://unsplash.com
2. Search for the image theme
3. Click the image
4. Click "Download free" button
5. Attribution: Add "Photo by [Photographer] on Unsplash" when using

## 🛠️ Batch Processing

### Download All Icons as ZIP:
1. In your development environment, navigate to `/icons`
2. Select all `.svg` files
3. Right-click → "Download" (or use command line)

### Convert All to PNG at Once:
**Using ImageMagick (Command Line):**
```bash
cd icons
for file in *.svg; do
  convert -background none -density 300 "$file" "${file%.svg}.png"
done
```

**Using Inkscape (Command Line):**
```bash
cd icons
for file in *.svg; do
  inkscape "$file" --export-type=png --export-dpi=300
done
```

## 📱 Export for Different Sizes

### iOS App Icons:
- 20x20, 29x29, 40x40, 58x58, 60x60, 76x76, 80x80, 87x87, 120x120, 152x152, 167x167, 180x180, 1024x1024

### Android App Icons:
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

### Web Favicons:
- 16x16, 32x32, 48x48, 180x180 (Apple Touch), 192x192, 512x512

## 🎯 Icon Design Specifications

All icons follow Lucide design system standards:
- **Stroke Width:** 2px
- **View Box:** 24x24
- **Style:** Outline/stroke based
- **Corners:** Rounded (stroke-linecap="round")
- **Joins:** Rounded (stroke-linejoin="round")

## 📦 Complete File List

Total: **60 SVG files** created in `/icons/` directory

You now have a complete, downloadable icon library for your NUON app! 🎉

---

**Need Help?**
- Lucide Icons: https://lucide.dev
- SVG Tutorial: https://developer.mozilla.org/en-US/docs/Web/SVG
- Unsplash: https://unsplash.com
