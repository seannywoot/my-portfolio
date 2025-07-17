import { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import MarqueeSection from "../components/MarqueeSection";
import "../styles/LandingPage.css";

// Scroll configuration constants
const SCROLL_CONFIG = {
  QUOTE_PHASE_END: 3, // viewport heights
  HERO_TRANSITION_END: 4, // viewport heights  
  HERO_STABLE_END: 5, // viewport heights
  TOTAL_SCROLL_HEIGHT: 6, // viewport heights
  QUOTE_ANIMATION_END: 2.5, // viewport heights for quote word animation
} as const;

// Parallax speed multipliers
const PARALLAX_CONFIG = {
  PORTRAIT_SPEED: 0.8, // Portrait moves slower (80% speed)
  QUOTE_SPEED: 1.2, // Quote moves faster (120% speed)
  HERO_SPEED: 0.9, // Hero section moves at 90% speed
} as const;

// Quote animation configuration
const QUOTE_CONFIG = {
  WORD_THRESHOLD_MULTIPLIER: 0.12,
  TRANSITION_DURATION: 0.08,
  BASE_OPACITY: 0.15,
  FULL_OPACITY: 1,
} as const;

// TypeScript interfaces
interface ScrollState {
  scrollY: number;
  phase: 'landing' | 'transition' | 'hero' | 'vertical';
  horizontalProgress: number;
  isHeroFullyVisible: boolean;
}

interface ScrollPhaseInfo {
  phase: ScrollState['phase'];
  progress: number;
  isTransitioning: boolean;
}

function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Split the quote into words for progressive animation
  const quoteWords = [
    "Life",
    "can",
    "only",
    "be",
    "understood",
    "backwards",
    "but",
    "it",
    "must",
    "be",
    "lived",
    "forward",
  ];

  const getWordOpacity = (index: number) => {
    const scrollProgress = scrollY / (viewportHeight * SCROLL_CONFIG.QUOTE_ANIMATION_END);
    const wordThreshold = index * QUOTE_CONFIG.WORD_THRESHOLD_MULTIPLIER;

    if (scrollProgress < wordThreshold) {
      return QUOTE_CONFIG.BASE_OPACITY;
    } else if (scrollProgress < wordThreshold + QUOTE_CONFIG.TRANSITION_DURATION) {
      const transitionProgress = (scrollProgress - wordThreshold) / QUOTE_CONFIG.TRANSITION_DURATION;
      return QUOTE_CONFIG.BASE_OPACITY + (QUOTE_CONFIG.FULL_OPACITY - QUOTE_CONFIG.BASE_OPACITY) * transitionProgress;
    } else {
      return QUOTE_CONFIG.FULL_OPACITY;
    }
  };

  // Get current scroll phase for debugging
  const getScrollPhase = (): ScrollState['phase'] => {
    const quotePhaseEnd = viewportHeight * SCROLL_CONFIG.QUOTE_PHASE_END;
    const heroTransitionEnd = viewportHeight * SCROLL_CONFIG.HERO_TRANSITION_END;
    const heroStableEnd = viewportHeight * SCROLL_CONFIG.HERO_STABLE_END;

    if (scrollY <= quotePhaseEnd) return 'landing';
    if (scrollY <= heroTransitionEnd) return 'transition';
    if (scrollY <= heroStableEnd) return 'hero';
    return 'vertical';
  };

  // Horizontal scroll with parallax layers
  const getHorizontalOffset = () => {
    const quotePhaseEnd = viewportHeight * SCROLL_CONFIG.QUOTE_PHASE_END;
    const heroTransitionEnd = viewportHeight * SCROLL_CONFIG.HERO_TRANSITION_END;
    const heroStableEnd = viewportHeight * SCROLL_CONFIG.HERO_STABLE_END;

    if (scrollY <= quotePhaseEnd) return 0;
    if (scrollY >= heroStableEnd) return 100; // Hero fully visible, stop horizontal scroll

    const horizontalScrollStart = scrollY - quotePhaseEnd;
    const horizontalScrollRange = heroTransitionEnd - quotePhaseEnd;
    const horizontalProgress = Math.min(horizontalScrollStart / horizontalScrollRange, 1);

    // Development debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Scroll Debug:', {
        scrollY,
        phase: getScrollPhase(),
        horizontalProgress: horizontalProgress * 100,
        quotePhaseEnd,
        heroTransitionEnd,
        heroStableEnd
      });
    }

    return horizontalProgress * 100;
  };

  // Horizontal parallax effects for different layers during transition
  const getPortraitParallax = () => {
    const baseOffset = getHorizontalOffset();
    const parallaxOffset = baseOffset * PARALLAX_CONFIG.PORTRAIT_SPEED;
    // Ensure parallax doesn't exceed bounds
    return Math.min(Math.max(parallaxOffset, 0), 100);
  };

  const getQuoteParallax = () => {
    const baseOffset = getHorizontalOffset();
    const parallaxOffset = baseOffset * PARALLAX_CONFIG.QUOTE_SPEED;
    // Ensure parallax doesn't exceed bounds
    return Math.min(Math.max(parallaxOffset, 0), 120);
  };

  const getHeroParallax = () => {
    const baseOffset = getHorizontalOffset();
    const parallaxOffset = baseOffset * PARALLAX_CONFIG.HERO_SPEED;
    // Ensure parallax doesn't exceed bounds
    return Math.min(Math.max(parallaxOffset, 0), 90);
  };

  return (
    <div className="landing-page">
      {/* Horizontal scroll container */}
      <div className="landing-page__scroll-container">
        <div className="landing-page__sticky-wrapper">
          <div
            className="landing-page__content-wrapper"
            style={{
              transform: `translateX(-${getHorizontalOffset()}vw)`,
            }}
          >
            {/* Landing Page Content with Horizontal Parallax */}
            <div
              className="landing-page__main-content"
              style={{
                transform: `translateX(-${getPortraitParallax()}vw)`,
              }}
            >
              {/* Portrait Image */}
              <div className="landing-page__portrait-container">
                <img
                  src="/portrait_upscayl_4x_upscayl-standard-4x 1.png"
                  alt="Søren Kierkegaard"
                  className="landing-page__portrait"
                />
              </div>

              {/* Quote Text with Faster Parallax */}
              <div
                className="landing-page__quote"
                style={{
                  transform: `translateX(-${getQuoteParallax()}vw)`,
                }}
              >
                <div className="landing-page__quote-line">
                  {quoteWords.slice(0, 4).map((word, index) => (
                    <span
                      key={index}
                      className="landing-page__quote-word"
                      style={{
                        opacity: getWordOpacity(index),
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <div className="landing-page__quote-line">
                  {quoteWords.slice(4, 6).map((word, index) => (
                    <span
                      key={index + 4}
                      className="landing-page__quote-word"
                      style={{
                        opacity: getWordOpacity(index + 4),
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <div className="landing-page__quote-line">
                  {quoteWords.slice(6, 11).map((word, index) => (
                    <span
                      key={index + 6}
                      className="landing-page__quote-word"
                      style={{
                        opacity: getWordOpacity(index + 6),
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <div className="landing-page__quote-forward">
                  <span
                    className="landing-page__quote-forward-word"
                    style={{
                      opacity: getWordOpacity(11),
                    }}
                  >
                    forward
                  </span>
                  <span
                    className="landing-page__quote-arrows"
                    style={{
                      opacity: getWordOpacity(12),
                    }}
                  >
                    &gt;&gt;&gt;
                  </span>
                </div>
                <div className="landing-page__author">-Søren Kierkegaard</div>
              </div>
            </div>

            {/* Hero Section with Parallax */}
            <div
              className="landing-page__hero-container"
              style={{
                transform: `translateX(-${getHeroParallax()}vw)`,
              }}
            >
              <HeroSection />
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Section - Outside horizontal scroll, back to vertical scrolling */}
      <MarqueeSection />
    </div>
  );
}

export default LandingPage;
