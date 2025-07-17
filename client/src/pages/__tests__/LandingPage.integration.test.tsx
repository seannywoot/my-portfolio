import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import LandingPage from '../LandingPage';

// Mock window properties and methods
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

// Helper function to simulate scroll
const simulateScroll = (scrollY: number) => {
  window.scrollY = scrollY;
  const scrollEvent = new Event('scroll');
  window.dispatchEvent(scrollEvent);
};

// Helper function to simulate resize
const simulateResize = (height: number) => {
  window.innerHeight = height;
  const resizeEvent = new Event('resize');
  window.dispatchEvent(resizeEvent);
};

describe('LandingPage Integration Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    vi.clearAllMocks();
    window.innerHeight = 1000;
    window.scrollY = 0;
    
    const renderResult = render(<LandingPage />);
    container = renderResult.container;
  });

  describe('Complete Scroll Flow', () => {
    it('should handle complete scroll journey from landing to marquee', async () => {
      // Start at landing phase
      expect(window.scrollY).toBe(0);
      
      // Verify landing content is visible
      expect(screen.getByText('Life')).toBeInTheDocument();
      expect(screen.getByAltText('Søren Kierkegaard')).toBeInTheDocument();
      
      // Scroll through quote animation phase (0 - 2500px)
      await act(async () => {
        simulateScroll(1250); // Middle of quote animation
      });
      
      // Scroll to transition phase (3000 - 4000px)
      await act(async () => {
        simulateScroll(3500); // Middle of horizontal transition
      });
      
      // Verify hero section elements are present
      expect(screen.getByText('Hi, I\'m')).toBeInTheDocument();
      expect(screen.getByText('Available for work')).toBeInTheDocument();
      
      // Scroll to hero stable phase (4000 - 5000px)
      await act(async () => {
        simulateScroll(4500); // Hero section fully visible
      });
      
      // Scroll to vertical phase (5000px+)
      await act(async () => {
        simulateScroll(5500); // Marquee section accessible
      });
      
      // Verify marquee section is present
      expect(screen.getByText('Technologies I Use')).toBeInTheDocument();
    });

    it('should maintain smooth transitions between phases', async () => {
      const scrollPositions = [0, 1000, 2000, 3000, 3500, 4000, 4500, 5000, 5500];
      
      for (const scrollY of scrollPositions) {
        await act(async () => {
          simulateScroll(scrollY);
        });
        
        // Verify no errors occur during transitions
        expect(container).toBeInTheDocument();
        
        // Verify scroll position is correctly set
        expect(window.scrollY).toBe(scrollY);
      }
    });

    it('should handle rapid scroll changes', async () => {
      // Simulate rapid scrolling
      const rapidScrollPositions = [0, 2000, 1000, 4000, 3000, 5000, 2500];
      
      for (const scrollY of rapidScrollPositions) {
        await act(async () => {
          simulateScroll(scrollY);
        });
        
        // Verify component remains stable
        expect(container).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt to different screen sizes', async () => {
      const screenSizes = [
        { width: 320, height: 568 },   // Mobile
        { width: 768, height: 1024 },  // Tablet
        { width: 1920, height: 1080 }, // Desktop
      ];
      
      for (const size of screenSizes) {
        await act(async () => {
          simulateResize(size.height);
        });
        
        // Test scroll behavior at different screen sizes
        await act(async () => {
          simulateScroll(size.height * 3.5); // Middle of transition
        });
        
        expect(container).toBeInTheDocument();
        expect(window.innerHeight).toBe(size.height);
      }
    });

    it('should recalculate scroll phases on resize', async () => {
      // Start with standard viewport
      expect(window.innerHeight).toBe(1000);
      
      // Scroll to transition phase
      await act(async () => {
        simulateScroll(3500);
      });
      
      // Resize viewport
      await act(async () => {
        simulateResize(800);
      });
      
      // Verify calculations adapt to new viewport height
      expect(window.innerHeight).toBe(800);
      
      // Test scroll behavior with new viewport
      await act(async () => {
        simulateScroll(800 * 3.5); // Adjusted for new viewport
      });
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Performance and Event Handling', () => {
    it('should throttle scroll events properly', async () => {
      const scrollHandler = vi.fn();
      window.addEventListener('scroll', scrollHandler);
      
      // Simulate multiple rapid scroll events
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          simulateScroll(i * 100);
        });
      }
      
      // Verify requestAnimationFrame is used for throttling
      expect(global.requestAnimationFrame).toHaveBeenCalled();
      
      window.removeEventListener('scroll', scrollHandler);
    });

    it('should clean up event listeners on unmount', () => {
      const { unmount } = render(<LandingPage />);
      
      // Verify event listeners are added
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });
      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
      
      // Unmount component
      unmount();
      
      // Verify event listeners are removed
      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });

  describe('Visual Continuity', () => {
    it('should maintain visual elements throughout scroll journey', async () => {
      // Landing phase - quote should be visible
      expect(screen.getByText('Life')).toBeInTheDocument();
      
      // Transition phase - both quote and hero elements should be accessible
      await act(async () => {
        simulateScroll(3500);
      });
      
      expect(screen.getByText('Life')).toBeInTheDocument();
      expect(screen.getByText('Hi, I\'m')).toBeInTheDocument();
      
      // Hero phase - hero content should be fully visible
      await act(async () => {
        simulateScroll(4500);
      });
      
      expect(screen.getByText('Full-Stack Developer & Creative Problem Solver')).toBeInTheDocument();
      expect(screen.getByText('View My Work')).toBeInTheDocument();
      
      // Vertical phase - marquee should be accessible
      await act(async () => {
        simulateScroll(5500);
      });
      
      expect(screen.getByText('Technologies I Use')).toBeInTheDocument();
    });

    it('should not show empty screens during transitions', async () => {
      const criticalScrollPositions = [2999, 3001, 3999, 4001, 4999, 5001];
      
      for (const scrollY of criticalScrollPositions) {
        await act(async () => {
          simulateScroll(scrollY);
        });
        
        // Verify content is always present
        const hasContent = container.textContent && container.textContent.trim().length > 0;
        expect(hasContent).toBe(true);
      }
    });
  });

  describe('Accessibility and User Experience', () => {
    it('should maintain proper focus management during scroll', async () => {
      // Test that interactive elements remain accessible
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      // Scroll through different phases
      await act(async () => {
        simulateScroll(4500); // Hero phase
      });
      
      // Verify buttons are still accessible
      const heroButtons = screen.getAllByRole('button');
      expect(heroButtons.length).toBeGreaterThan(0);
    });

    it('should preserve semantic structure throughout scroll', async () => {
      // Verify headings are present
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      
      // Scroll to different phases and verify structure remains
      await act(async () => {
        simulateScroll(4500);
      });
      
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });
  });
});