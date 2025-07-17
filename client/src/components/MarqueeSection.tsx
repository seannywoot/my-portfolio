import "../styles/MarqueeSection.css";

function MarqueeSection() {
  const technologies = [
    { name: "Figma", icon: "🎨" },
    { name: "Bun", icon: "🥟" },
    { name: "Hono", icon: "🔥" },
    { name: "React", icon: "⚛️" },
    { name: "Vite", icon: "⚡" },
    { name: "Node.js", icon: "🟢" },
    { name: "VS Code", icon: "💻" },
    { name: "Photoshop", icon: "🖼️" },
    { name: "Lightroom", icon: "📸" },
    { name: "DaVinci Resolve", icon: "🎬" },
  ];

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <h2 className="marquee-title">Technologies I Use</h2>
        <div className="marquee-wrapper">
          <div className="marquee-content">
            {/* First set of technologies */}
            {technologies.map((tech, index) => (
              <div key={`first-${index}`} className="marquee-item">
                <span className="marquee-icon">{tech.icon}</span>
                <span className="marquee-text">{tech.name}</span>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {technologies.map((tech, index) => (
              <div key={`second-${index}`} className="marquee-item">
                <span className="marquee-icon">{tech.icon}</span>
                <span className="marquee-text">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MarqueeSection;