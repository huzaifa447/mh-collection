# Login/Signup UI Improvement Plan

**Information Gathered:**
- Current Login.tsx: Basic form toggle, luxury-input styling, pt-24 (navbar offset).
- Uses AuthContext, react-hot-toast, Framer Motion, Lucide icons.
- Matches site theme: bg-primary-light, accent-white/silver, luxury-btn.
- Home.tsx has slide banner - reuse for background.

**Plan:**
1. **src/pages/Login.tsx** - Luxury redesign:
   - Fullscreen hero with slideimages banner (no overlay text).
   - Dual glassmorphism cards (login left, signup right, slide toggle).
   - Animated float labels, field glow focus.
   - Particle background effect.
   - Premium gradient buttons w/ pulse.
   - Responsive: mobile stack cards.
2. **No dependencies** - uses existing styling system.

**Followup:** Test responsive + auth flow.
