# Design Document

## Overview

The scroll navigation fix addresses the timing and calculation issues in the LandingPage component's horizontal-to-vertical scroll transition. The main problem is in the `getHorizontalOffset()` function where the scroll phases are miscalculated, causing the Hero Section to scroll too far and creating empty space before the Marquee Section becomes accessible.

## Architecture

The solution involves refactoring the scroll calculation logic in the LandingPage component to ensure proper phase transitions:

1. **Landing Phase** (0 - 3vh): Quote animation and initial content
2. **Transition Phase** (3vh - 4vh): Horizontal scroll from landing to hero
3. **Hero Phase** (4vh - 5vh): Hero section fully visible and stable
4. **Vertical Phase** (5vh+): Transition to vertical scrolling for Marquee section

## Components and Interfaces

### LandingPage Component Updates

**Current Issues:**
- `totalScrollHeight` variable is declared but unused
- `heroPhaseEnd` is set to 5vh but the horizontal scroll range calculation doesn't account for proper hero visibility
- The horizontal offset calculation causes the hero section to scroll past the viewport

**Proposed Changes:**
- Fix scroll phase calculations to ensure Hero Section remains fully visible
- Adjust horizontal scroll range to prevent over-scrolling
- Remove unused variables and clean up the code
- Ensure smooth transition from horizontal to vertical scrolling

### Scroll Calculation Functions

#### `getHorizontalOffset()` Function Redesign
```typescript
const getHorizontalOffset = () => {
  const quotePhaseEnd = window.innerHeight * 3;
  const heroTransitionEnd = window.innerHeight * 4;
  const heroStableEnd = window.innerHeight * 5;

  if (scrollY <= quotePhaseEnd) return 0;
  if (scrollY >= heroStableEnd) return 100; // Hero fully visible, stop horizontal scroll

  const horizontalScrollStart = scrollY - quotePhaseEnd;
  const horizontalScrollRange = heroTransitionEnd - quotePhaseEnd;
  const horizontalProgress = Math.min(horizontalScrollStart / horizontalScrollRange, 1);

  return horizontalProgress * 100;
};
```

#### Parallax Function Updates
- Maintain existing parallax effects but ensure they work within the corrected scroll ranges
- Ensure all parallax calculations respect the new horizontal offset limits

## Data Models

### Scroll State Interface
```typescript
interface ScrollState {
  scrollY: number;
  phase: 'landing' | 'transition' | 'hero' | 'vertical';
  horizontalProgress: number;
  isHeroFullyVisible: boolean;
}
```

### Scroll Configuration
```typescript
const SCROLL_CONFIG = {
  QUOTE_PHASE_END: 3, // viewport heights
  HERO_TRANSITION_END: 4, // viewport heights  
  HERO_STABLE_END: 5, // viewport heights
  TOTAL_SCROLL_HEIGHT: 6 // viewport heights
};
```

## Error Handling

### Scroll Calculation Safeguards
- Add bounds checking to prevent scroll values from exceeding expected ranges
- Implement fallback values for edge cases where viewport dimensions are unavailable
- Add console warnings for debugging scroll phase transitions in development mode

### Performance Considerations
- Throttle scroll event handlers to prevent excessive calculations
- Use `requestAnimationFrame` for smooth scroll-based animations
- Cache viewport dimensions to avoid repeated DOM queries

## Testing Strategy

### Unit Tests
- Test scroll calculation functions with various scroll positions
- Verify phase transitions occur at correct scroll thresholds
- Test parallax calculations for different viewport sizes

### Integration Tests
- Test complete scroll flow from landing to marquee section
- Verify smooth transitions between horizontal and vertical scrolling
- Test responsive behavior across different screen sizes

### Manual Testing Scenarios
1. **Slow Scroll Test**: Scroll slowly through entire page to verify smooth transitions
2. **Fast Scroll Test**: Scroll quickly to ensure no phases are skipped
3. **Mobile Responsive Test**: Test on various mobile devices and screen sizes
4. **Browser Compatibility Test**: Test across different browsers (Chrome, Firefox, Safari, Edge)

## Implementation Notes

### CSS Updates Required
- Ensure `.landing-page__scroll-container` height matches the total scroll height calculation
- Verify sticky positioning works correctly with the new scroll ranges
- Test that horizontal scroll container width accommodates the corrected offset calculations

### JavaScript/TypeScript Updates
- Remove unused `totalScrollHeight` variable
- Add proper TypeScript types for scroll configuration
- Implement proper cleanup for scroll event listeners
- Add development-mode debugging helpers

### Performance Optimizations
- Implement scroll event throttling using `requestAnimationFrame`
- Cache frequently accessed DOM measurements
- Optimize transform calculations to reduce reflow/repaint cycles