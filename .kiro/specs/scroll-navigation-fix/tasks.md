# Implementation Plan

- [x] 1. Create scroll configuration constants and types



  - Define TypeScript interfaces for scroll state and configuration
  - Create constants for scroll phase thresholds to replace magic numbers
  - Add proper type definitions for scroll-related functions


  - _Requirements: 3.1, 3.2_

- [ ] 2. Fix horizontal scroll offset calculation function
  - Refactor `getHorizontalOffset()` function to prevent over-scrolling
  - Implement proper bounds checking to ensure Hero Section stays visible


  - Add scroll phase detection logic for better transition control
  - Remove unused `totalScrollHeight` variable
  - _Requirements: 1.1, 2.1, 3.2_



- [ ] 3. Update parallax calculation functions
  - Modify `getPortraitParallax()`, `getQuoteParallax()`, and `getHeroParallax()` functions
  - Ensure parallax effects work within corrected scroll ranges
  - Add bounds checking to prevent parallax elements from moving out of view


  - _Requirements: 1.3, 2.2_

- [ ] 4. Implement scroll event performance optimizations
  - Add throttling to scroll event handler using requestAnimationFrame


  - Cache viewport dimensions to reduce DOM queries
  - Optimize transform calculations for better performance
  - _Requirements: 3.3_



- [ ] 5. Add development debugging helpers
  - Create scroll phase indicator for development mode
  - Add console logging for scroll transitions (development only)
  - Implement visual debugging overlay to show scroll phases



  - _Requirements: 3.1, 3.2_

- [ ] 6. Update CSS scroll container height
  - Ensure `.landing-page__scroll-container` height matches scroll configuration
  - Verify sticky positioning works with new scroll ranges
  - Test horizontal scroll container accommodates corrected calculations
  - _Requirements: 1.2, 2.1_

- [ ] 7. Create unit tests for scroll calculations
  - Write tests for `getHorizontalOffset()` function with various scroll positions
  - Test scroll phase detection logic
  - Verify parallax calculations for different viewport sizes
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 8. Add integration tests for scroll flow
  - Test complete scroll navigation from landing to marquee section
  - Verify smooth transitions between horizontal and vertical scrolling
  - Test responsive behavior across different screen sizes
  - _Requirements: 1.1, 1.3, 2.2_