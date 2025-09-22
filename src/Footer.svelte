<script>
  const year = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="brand-col">
      <h3 class="logo-text"><em>FRC</em> Tree</h3>
      <p class="tagline">Central hub for FIRST Robotics Competition team links.</p>
      <p class="made-by">Made by the <a href="https://team1676.com" target="_blank" rel="noopener noreferrer">Pascack Pi-oneers</a>.</p>
    </div>
    <nav class="links-col">
      <h4>Platform</h4>
      <ul>
        <li><a href="/gallery">Gallery</a></li>
        <li><a href="/search/">Search</a></li>
        <li><a href="/sign_up">Sign Up</a></li>
        <li><a href="/sign_in">Sign In</a></li>
      </ul>
    </nav>
    <nav class="legal-col">
      <h4>Legal</h4>
      <ul>
        <li><a href="/tos">Terms of Service</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
      </ul>
    </nav>
  </div>
  <div class="footer-bottom">
    <span>&copy; {year} FRC Tree. All rights reserved.</span>
  </div>
</footer>

<style>
  .site-footer { margin-top: var(--space-2xl); background: var(--bg-secondary); border-top: 1px solid var(--border-light); padding: var(--space-2xl) 0 var(--space-xl); font-size: .875rem; }
  .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; gap: var(--space-xl); padding: 0 var(--space-lg); grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); }
  .logo-text { margin: 0 0 .5rem; font-size: 1.4rem; }
  .tagline { margin: 0 0 .5rem; color: var(--text-secondary); }
  .made-by { margin: 0; color: var(--text-secondary); }
  .made-by a { color: var(--primary); text-decoration: none; }
  .made-by a:hover { text-decoration: underline; }
  nav h4 { margin: 0 0 .75rem; font-size: .85rem; letter-spacing: .5px; text-transform: uppercase; color: var(--text-muted); }
  nav ul { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: .4rem; }
  nav a { color: var(--text-secondary); text-decoration: none; }
  nav a:hover { color: var(--primary); }
  .footer-bottom { margin-top: var(--space-xl); text-align: center; padding-top: var(--space-md); border-top: 1px solid var(--border-light); color: var(--text-muted); }
  @media (max-width: 640px) { .site-footer { padding: var(--space-xl) 0; } .footer-inner { grid-template-columns: 1fr 1fr; } .brand-col { grid-column: 1 / -1; } }
</style>
