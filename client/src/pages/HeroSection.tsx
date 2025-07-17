import "../styles/HeroSection.css";

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-image-section">
          <div className="hero-image-placeholder">
            <div className="image-placeholder-content">
              <svg
                className="image-placeholder-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <span className="image-placeholder-text">Your Photo</span>
            </div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-text">Available for work</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="hero-name">[Your Name]</span>
          </h1>

          <p className="hero-subtitle">
            Full-Stack Developer & Creative Problem Solver
          </p>

          <p className="hero-description">
            I craft digital experiences that blend beautiful design with robust
            functionality. Passionate about modern web technologies and turning
            ideas into reality.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">View My Work</button>
            <button className="btn-secondary">Get In Touch</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client Satisfaction</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-avatar">
            <div className="avatar-placeholder">
              <svg
                className="avatar-icon"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="floating-elements">
            <div className="floating-card card-1">React</div>
            <div className="floating-card card-2">TypeScript</div>
            <div className="floating-card card-3">Node.js</div>
            <div className="floating-card card-4">Design</div>
          </div>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}

export default HeroSection;
