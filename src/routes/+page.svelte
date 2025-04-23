<script>
    import { docTitle } from "$lib/frontendutil";
  import Tree from "../Tree.svelte";
  import { onMount } from 'svelte';
  import logoFull from "$lib/assets/LinkTreeLogo-01.png";
  
  let loaded = false;
  let logoContainer;
  let glitchInterval;
  
  docTitle("Home");

  onMount(() => {
    setTimeout(() => {
      loaded = true;
    }, 100);
    
    // Only keep the occasional glitch effect
    if (typeof window !== 'undefined') {
      // Add occasional glitch effect
      glitchInterval = setInterval(() => {
        const logo = logoContainer?.querySelector('.logo');
        if (!logo) return;
        
        // Add glitch class
        logo.classList.add('glitch-effect');
        
        // Remove it after a short time
        setTimeout(() => {
          logo.classList.remove('glitch-effect');
        }, 200);
      }, 5000);
      
      return () => {
        clearInterval(glitchInterval);
      };
    }
  });
</script>

<div class="main-content {loaded ? 'loaded' : ''}">
  <div class="half logo-container" bind:this={logoContainer}>
    <div class="logo-wrapper">
      <img alt="Linktree Logo" src={logoFull} class="logo">
      <div class="grid-overlay"></div>
    </div>
  </div>
  <div class="half content-container">
    <h1 class="title">FRTree</h1>
    <p class="subtitle">An innovative social media hub for FRC Teams, by the <span class="no-wrap">Pascack Pi-oneers</span></p>
    <div class="divider"></div>
    <div class="row info-row">
      <p class="info">
        Create a customized digital profile to showcase all your social media presence and projects
      </p>
      <p class="info">
        Connect with thousands of FRC teams through our comprehensive database
      </p>
    </div>
    <div class="row button-row">
      <button onclick={() => window.location.href="./sign_up"} class="btn btn-1-outline btn-cta">
        <span class="btn-text">Make a Profile</span>
        <span class="btn-glow"></span>
      </button>
      <button onclick={() => window.location.href="./gallery"} class="btn btn-1-outline btn-cta">
        <span class="btn-text">View Profiles</span>
        <span class="btn-glow"></span>
      </button>
    </div>
  </div>
</div>

<div class="section mission-section">
  <div class="section-content">
    <h2 class="section-title">Mission Statement</h2>
    <div class="section-divider"></div>
    <p class="section-text">
      Our goal with FRTree is to make a standardized social media platform for First Robotics Competition teams. We hope our product will induce collaboration and communication between teams, which is one of the FIRST core values we find so important. The features we add to FRTree will prioritize ease of use, information-first layout, and customizability for team administrators.
    </p>
  </div>
</div>

<div class="section features-section">
  <div class="section-content">
    <h2 class="section-title">Features</h2>
    <div class="section-divider"></div>

    <div class="features-grid" style="grid-template-columns: 100%;">
      <!--<div class="features-image-container">
        <img class="features-img" src={logoFull} alt="features-img">
        <div class="image-overlay"></div>
      </div>-->
      <div class="features-list-container">
        <ul class="features-list">
          <li class="feature-item">
            <span class="feature-icon">🔍</span>
            <div>
              <strong>Advanced Search Engine:</strong> Find teams by code, name, or keywords with our intelligent search system.
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon">📊</span>
            <div>
              <strong>Comprehensive Team Profiles:</strong> Access team details, location data, awards, and administrator-set links.
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon">🔗</span>
            <div>
              <strong>Integrated Contact System:</strong> Connect through social media profiles, websites, blogs, and custom links.
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-icon">🔐</span>
            <div>
              <strong>Secure Administrator Portal:</strong> Customize your team's page with themes, descriptions, and dynamic content.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

<style>

  .logo {
    width: 100%;
    max-width: 600px;
    margin: 0px auto;
  }
  /* Main content styling */
  .main-content {
    min-height: 80vh;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0;
    /* Remove or override the page-specific background */
    /* background: linear-gradient(135deg, var(--color2) 0%, var(--color5) 100%); */
    background: transparent !important;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .main-content.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .main-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(0, 195, 255, 0.05) 40%, rgba(0, 195, 255, 0.05) 60%, transparent 70%);
    background-size: 200% 200%;
    animation: shimmer 10s infinite linear;
    pointer-events: none;
  }

  @keyframes shimmer {
    0% { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  .half {
    width: 50%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  /* Logo styling */
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1000px;
  }

  .logo-wrapper {
    position: relative;
    width: 80%;
    height: auto;
    overflow: hidden;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform-style: preserve-3d;
    transition: transform 0.2s ease;
  }

  .logo {
    width: 100%;
    height: auto;
    position: relative;
    z-index: 2;
    transition: transform 0.3s ease;
    transform-origin: center center;
    filter: brightness(1.1) contrast(1.1);
  }

  /* Remove the glow-effect */
  /* Removed unused selectors (.glow-effect & .glitch-effect)
  .glow-effect { ... }
  .glitch-effect { ... }
  */

  /* Remove scan line effect - it's completely gone */

  /* Grid overlay */
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      linear-gradient(rgba(0, 195, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 195, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 3;
    pointer-events: none;
  }

  /* Glitch effect */
  @keyframes glitch {
    0% { 
      transform: translate(0);
      filter: hue-rotate(0deg);
    }
    20% { 
      transform: translate(-5px, 5px);
      filter: hue-rotate(70deg) brightness(1.3);
    }
    40% { 
      transform: translate(5px, -5px); 
      filter: hue-rotate(-70deg) contrast(1.5);
    }
    60% { 
      transform: translate(0);
      filter: hue-rotate(0deg);
    }
    70% { 
      transform: translate(3px, -3px);
      filter: hue-rotate(40deg) brightness(0.8);
    }
    80% { 
      transform: translate(-3px, 3px); 
      filter: invert(0.1) hue-rotate(-40deg);
    }
    100% { 
      transform: translate(0);
      filter: hue-rotate(0deg);
    }
  }

  .glitch-effect {
    animation: glitch 0.2s ease-in-out;
  }

  .logo-wrapper:hover {
    transform: translateZ(10px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  .logo-wrapper:hover .logo {
    filter: brightness(1.2) contrast(1.2);
  }

  /* Remove the automatic animation */
  .logo-wrapper {
    transform: rotateY(0deg) rotateX(0deg);
  }

  /* Content styling */
  .content-container {
    padding: 3rem;
  }

  .title {
    font-size: 5em;
    margin: 0;
    background: linear-gradient(to right, #ffffff, var(--color1));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: uppercase;
    letter-spacing: 3px;
    font-weight: 800;
    position: relative;
    animation: slideIn 0.8s ease-out forwards;
    opacity: 0;
    animation-delay: 0.3s;
    transform: translateY(20px);
  }

  .subtitle {
    font-size: 1.2em;
    margin-top: 1rem;
    color: #c5d8ff;
    max-width: 90%;
    line-height: 1.5;
    opacity: 0;
    animation: slideIn 0.8s ease-out forwards;
    animation-delay: 0.6s;
    transform: translateY(20px);
  }
  
  .no-wrap {
    white-space: nowrap;
  }

  @keyframes slideIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .divider {
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, var(--color1), transparent);
    margin: 1.5rem 0;
    position: relative;
    opacity: 0;
    animation: expandWidth 1s ease-out forwards;
    animation-delay: 0.9s;
  }

  @keyframes expandWidth {
    0% { width: 0; opacity: 0; }
    100% { width: 50%; opacity: 1; }
  }

  .row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .info-row {
    opacity: 0;
    animation: fadeIn 0.8s ease-out forwards;
    animation-delay: 1.2s;
  }

  .button-row {
    margin-top: 2rem;
    opacity: 0;
    animation: fadeIn 0.8s ease-out forwards;
    animation-delay: 1.5s;
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .info {
    font-size: 1.1em;
    color: #a9c2ff;
    width: 48%;
    line-height: 1.6;
    margin-bottom: 10px;
  }

  .btn-cta {
    width: 95%;
    font-size: 1.2em;
    padding: 0.8em 1em;
    position: relative;
    overflow: hidden;
    border: 2px solid var(--color1);
    background-color: transparent;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .btn-text {
    position: relative;
    z-index: 3;
    transition: all 0.3s ease;
  }

  .btn-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, var(--color1) 0%, transparent 70%);
    opacity: 0;
    transition: transform 0.5s ease, opacity 0.5s ease;
    z-index: 1;
  }

  .btn-cta:hover .btn-glow {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.4;
  }

  .btn-cta:hover {
    box-shadow: 0 0 20px var(--color-glow);
    color: white;
  }

  /* Section styling */
  .section {
    width: 100%;
    padding: 4rem 0;
    display: flex;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .mission-section {
    /* Remove or override the page-specific background */
    /* background: linear-gradient(135deg, var(--color3) 0%, var(--color4) 100%); */
    background: transparent !important;
  }

  .features-section {
    /* Remove or override the page-specific background */
    /* background: linear-gradient(135deg, var(--color2) 0%, var(--color3) 100%); */
    background: transparent !important;
  }

  .section-content {
    width: 80%;
    max-width: 1200px;
    animation: fadeInUp 1s ease-out;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .section-title {
    text-align: center;
    font-size: 2.5em;
    margin: 20px 0;
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .section-divider {
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, transparent, var(--color1), transparent);
    margin: 1rem auto 2rem;
    border-radius: 3px;
  }

  .section-text {
    font-size: 1.25em;
    line-height: 1.8;
    color: #d4e5ff;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
  }

  /* Features grid styling */
  .features-grid {
    display: grid;
    grid-template-columns: 35% 65%;
    gap: 2rem;
    margin-top: 2rem;
    align-items: center;
  }

  .features-image-container {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 195, 255, 0.3);
  }

  .features-img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.5s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 195, 255, 0.2) 0%, rgba(123, 44, 191, 0.2) 100%);
    z-index: 1;
  }

  .features-image-container:hover .features-img {
    transform: scale(1.05);
  }

  .features-list-container {
    padding: 1rem;
  }

  .features-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(22, 33, 62, 0.5);
    border-radius: 8px;
    border-left: 3px solid var(--color1);
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    transform: translateX(5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    background: rgba(22, 33, 62, 0.8);
  }

  .feature-icon {
    font-size: 1.5em;
    margin-right: 1rem;
    background: linear-gradient(135deg, var(--color1) 0%, var(--color-accent) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .feature-item strong {
    color: var(--color1);
    display: block;
    margin-bottom: 5px;
    font-size: 1.1em;
  }

  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
    }

    .half {
      width: 100%;
      padding: 2rem 1rem;
    }
    
    .row {
      flex-direction: column;
      gap: 1rem;
    }

    .info {
      width: 100%;
    }

    .section-content {
      width: 90%;
    }
  }

</style>
