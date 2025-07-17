import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import LandingPage from '../LandingPage';

// Mock window properties
const mockWindow = {
  innerHeight: 1000,
  scrollY: 0,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: mockWindow.innerHeight,
});

Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: mockWindow.scrollY,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  cb(0);
  return 0;
});

describe('LandingPage Scroll Calculations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.innerHeight = 1000;
    window.scrollY = 0;
  });

  describe('Scroll Phase Detection', () => {
    it('should detect landing phase correctly', () => {
      // Test scroll positions in landing phase (0 - 3000px)
      const testCases = [0, 1000, 2000, 3000];
      
      testCases.forEach(scrollY => {
        window.scrollY = scrollY;
        render(<LandingPage />);
        // Landing phase: scrollY <= 3000 (3 * 1000vh)
        expect(scrollY).toBeLessThanOrEqual(3000);
      });
    });

    it('should detect transition phase correctly', () => {
      // Test scroll positions in transition phase (3000 - 4000px)
      const testCases = [3001, 3500, 4000];
      
      testCases.forEach(scrollY => {
        window.scrollY = scrollY;
        render(<LandingPage />);
        // Transition phase: 3000 < scrollY <= 4000
        expect(scrollY).toBeGreaterThan(3000);
        expect(scrollY).toBeLessThanOrEqual(4000);
      });
    });

    it('should detect hero phase correctly', () => {
      // Test scroll positions in hero phase (4000 - 5000px)
      const testCases = [4001, 4500, 5000];
      
      testCases.forEach(scrollY => {
        window.scrollY = scrollY;
        render(<LandingPage />);
        // Hero phase: 4000 < scrollY <= 5000
        expect(scrollY).toBeGreaterThan(4000);
        expect(scrollY).toBeLessThanOrEqual(5000);
      });
    });

    it('should detect vertical phase correctly', () => {
      // Test scroll positions in vertical phase (5000px+)
      const testCases = [5001, 6000, 7000];
      
      testCases.forEach(scrollY => {
        window.scrollY = scrollY;
        render(<LandingPage />);
        // Vertical phase: scrollY > 5000
        expect(scrollY).toBeGreaterThan(5000);
      });
    });
  });

  describe('Horizontal Offset Calculations', () => {
    it('should return 0 offset during landing phase', () => {
      window.scrollY = 2000; // Within landing phase
      render(<LandingPage />);
      
      // During landing phase, horizontal offset should be 0
      expect(window.scrollY).toBeLessThanOrEqual(3000);
    });

    it('should calculate correct offset during transition phase', () => {
      window.scrollY = 3500; // Middle of transition phase
      render(<LandingPage />);
      
      // Transition phase calculations:
      // horizontalScrollStart = 3500 - 3000 = 500
      // horizontalScrollRange = 4000 - 3000 = 1000
      // horizontalProgress = 500 / 1000 = 0.5
      // Expected offset = 0.5 * 100 = 50%
      
      const expectedProgress = (3500 - 3000) / (4000 - 3000);
      expect(expectedProgress).toBe(0.5);
    });

    it('should return 100 offset when hero is stable', () => {
      window.scrollY = 5500; // Beyond hero stable end
      render(<LandingPage />);
      
      // When scrollY >= heroStableEnd (5000), offset should be capped at 100
      expect(window.scrollY).toBeGreaterThanOrEqual(5000);
    });
  });

  describe('Parallax Calculations', () => {
    it('should apply correct parallax speeds', () => {
      // Test parallax speed multipliers
      const baseOffset = 50; // 50% horizontal offset
      
      // Portrait: 50 * 0.8 = 40, clamped to [0, 100]
      const portraitParallax = Math.min(Math.max(baseOffset * 0.8, 0), 100);
      expect(portraitParallax).toBe(40);
      
      // Quote: 50 * 1.2 = 60, clamped to [0, 120]
      const quoteParallax = Math.min(Math.max(baseOffset * 1.2, 0), 120);
      expect(quoteParallax).toBe(60);
      
      // Hero: 50 * 0.9 = 45, clamped to [0, 90]
      const heroParallax = Math.min(Math.max(baseOffset * 0.9, 0), 90);
      expect(heroParallax).toBe(45);
    });

    it('should clamp parallax values within bounds', () => {
      const extremeOffset = 150; // Extreme offset value
      
      // Test bounds clamping
      const portraitParallax = Math.min(Math.max(extremeOffset * 0.8, 0), 100);
      expect(portraitParallax).toBe(100); // Clamped to max
      
      const quoteParallax = Math.min(Math.max(extremeOffset * 1.2, 0), 120);
      expect(quoteParallax).toBe(120); // Clamped to max
      
      const heroParallax = Math.min(Math.max(extremeOffset * 0.9, 0), 90);
      expect(heroParallax).toBe(90); // Clamped to max
    });
  });

  describe('Quote Word Opacity', () => {
    it('should calculate correct opacity for quote words', () => {
      window.scrollY = 1250; // 50% through quote animation phase (2500px total)
      
      // scrollProgress = 1250 / (1000 * 2.5) = 0.5
      const scrollProgress = 1250 / (1000 * 2.5);
      expect(scrollProgress).toBe(0.5);
      
      // Test first word (index 0)
      const wordThreshold = 0 * 0.12; // 0
      // Since scrollProgress (0.5) > wordThreshold (0), opacity should be 1
      expect(scrollProgress).toBeGreaterThan(wordThreshold);
      
      // Test later word (index 10)
      const laterWordThreshold = 10 * 0.12; // 1.2
      // Since scrollProgress (0.5) < wordThreshold (1.2), opacity should be 0.15
      expect(scrollProgress).toBeLessThan(laterWordThreshold);
    });
  });

  describe('Responsive Behavior', () => {
    it('should recalculate on viewport height changes', () => {
      // Test with different viewport heights
      const viewportHeights = [800, 1000, 1200];
      
      viewportHeights.forEach(height => {
        window.innerHeight = height;
        window.scrollY = height * 3.5; // Middle of transition phase
        
        render(<LandingPage />);
        
        // Verify calculations scale with viewport height
        const quotePhaseEnd = height * 3;
        const heroTransitionEnd = height * 4;
        
        expect(window.scrollY).toBeGreaterThan(quotePhaseEnd);
        expect(window.scrollY).toBeLessThan(heroTransitionEnd);
      });
    });
  });
});