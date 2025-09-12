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
    <h1 class="title"><em>FRC</em> Tree</h1>
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
      <a href="./sign_up" class="btn-cta btn-primary-cta">
        Make a Profile
      </a>
      <a href="./gallery" class="btn-cta btn-outline-cta">
        View Profiles
      </a>
    </div>
  </div>
</div>

<div class="section mission-section">
  <div class="section-content">
    <h2 class="section-title">Mission Statement</h2>
    <div class="section-divider"></div>
    <p class="section-text">
      Our goal with <em>FRC</em> Tree is to make a standardized social media platform for First Robotics Competition teams. We hope our product will induce collaboration and communication between teams, which is one of the <em>FIRST</em> core values we find so important. The features we add to <em>FRC</em> Tree will prioritize ease of use, information-first layout, and customizability for team administrators.
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

  /* Main content styling */
  .main-content {
    min-height: 80vh;
    display: flex;
    align-items: center;
    gap: var(--space-2xl);
    padding: var(--space-2xl);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .main-content.loaded {
    opacity: 1;
    transform: translateY(0);
  }

  .half {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Logo styling */
  .logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-wrapper {
    position: relative;
    width: 100%;
    max-width: 500px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    box-shadow: var(--shadow-xl);
    transition: transform 0.2s ease;
  }

  .logo-wrapper:hover {
    transform: scale(1.02);
  }

  .logo {
    width: 100%;
    height: auto;
    display: block;
  }



  /* Content styling */
  .content-container {
    padding: 3rem;
  }

  .title {
    font-size: 4rem;
    margin: 0 0 var(--space-lg) 0;
    background: linear-gradient(to right, var(--text-primary), var(--primary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: var(--font-weight-bold);
    letter-spacing: 2px;
    opacity: 0;
    animation: slideIn 0.6s ease-out forwards;
    animation-delay: 0.3s;
  }

  .subtitle {
    font-size: 1.25rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 500px;
    opacity: 0;
    animation: slideIn 0.6s ease-out forwards;
    animation-delay: 0.5s;
  }
  
  .no-wrap {
    white-space: nowrap;
  }

  @keyframes slideIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .divider {
    width: 80px;
    height: 2px;
    background: var(--primary);
    margin: var(--space-xl) 0;
    border-radius: var(--radius-full);
    opacity: 0;
    animation: slideIn 0.6s ease-out forwards;
    animation-delay: 0.7s;
  }

  .row {
    display: flex;
    gap: var(--space-lg);
    margin-top: var(--space-lg);
  }

  .info-row {
    flex-direction: column;
    gap: var(--space-md);
    opacity: 0;
    animation: slideIn 0.6s ease-out forwards;
    animation-delay: 0.9s;
  }

  .button-row {
    margin-top: var(--space-xl);
    opacity: 0;
    animation: slideIn 0.6s ease-out forwards;
    animation-delay: 1.1s;
  }

  .info {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .btn-cta {
    flex: 1;
    padding: var(--space-md) var(--space-lg);
    font-size: 1.1rem;
    font-weight: var(--font-weight-medium);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    text-decoration: none;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-primary-cta {
    background: var(--primary);
    color: white;
    border: 1px solid var(--primary);
  }

  .btn-primary-cta:hover {
    background: var(--primary-light);
    border-color: var(--primary-light);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .btn-outline-cta {
    background: transparent;
    color: var(--primary);
    border: 1px solid var(--primary);
  }

  .btn-outline-cta:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  /* Section styling */
  .section {
    padding: var(--space-2xl) 0;
  }

  .section-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }

  .section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: var(--space-lg);
    color: var(--text-primary);
    font-weight: var(--font-weight-bold);
  }

  .section-divider {
    width: 80px;
    height: 2px;
    background: var(--primary);
    margin: 0 auto var(--space-xl) auto;
    border-radius: var(--radius-full);
  }

  .section-text {
    font-size: 1.125rem;
    line-height: 1.7;
    color: var(--text-secondary);
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
  }

  /* Features grid styling */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .features-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--space-lg);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    padding: var(--space-xl);
    background: var(--bg-card);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  }

  .feature-item:hover {
    border-color: var(--border-medium);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  .feature-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .feature-item strong {
    color: var(--primary);
    display: block;
    font-size: 1.1rem;
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-sm);
  }

  .feature-item div {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    .main-content {
      flex-direction: column;
      text-align: center;
      padding: var(--space-xl) var(--space-lg);
    }

    .title {
      font-size: 3rem;
    }

    .row {
      flex-direction: column;
    }

    .features-list {
      grid-template-columns: 1fr;
    }

    .section-content {
      padding: 0 var(--space-md);
    }
  }

</style>
