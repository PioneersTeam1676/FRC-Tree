<script>
  import { docTitle } from "$lib/frontendutil";
  docTitle("Privacy Policy");
</script>

<section class="legal-wrapper">
  <h1>Privacy Policy</h1>
  <p class="update-note">Last updated: {new Date().toISOString().split('T')[0]}</p>

  <h2>1. Overview</h2>
  <p>This Privacy Policy explains how FRC Tree collects, uses, and protects information related to FIRST Robotics Competition team profiles and administrator accounts.</p>

  <h2>2. Information We Collect</h2>
  <ul>
    <li><strong>Account Data:</strong> Email address, hashed password, associated team number.</li>
    <li><strong>Team Profile Data:</strong> Public description, colors, media links, location text, and social / external links you add.</li>
    <li><strong>Technical Data:</strong> Basic server logs (IP, timestamp, user agent) for security and debugging.</li>
  </ul>

  <h2>3. How We Use Information</h2>
  <ul>
    <li>Provide and display team pages.</li>
    <li>Authenticate administrators and secure access.</li>
    <li>Detect abuse, spam, or malicious activity.</li>
    <li>Improve reliability and user experience.</li>
  </ul>

  <h2>4. Cookies</h2>
  <p>Session cookies are used for authentication. They are required for secure access to the editor and administrative features.</p>

  <h2>5. Data Sharing</h2>
  <p>We do not sell personal data. Limited data may be shared for security, compliance, or if legally required.</p>

  <h2>6. Security</h2>
  <p>Passwords are stored using salted hashes. No plaintext passwords are stored. Despite safeguards, no system can guarantee absolute security.</p>

  <h2>7. Data Retention</h2>
  <p>Account and team data are retained while the team page remains active. You may request removal of a team profile or account via official contact methods.</p>

  <h2>8. Third-Party Links</h2>
  <p>Team pages may include external links. We are not responsible for the privacy practices of external sites.</p>

  <h2>9. Children</h2>
  <p>This platform is intended for team representatives. If you believe an account has been created by someone not authorized, please contact us.</p>

  <h2>10. Policy Changes</h2>
  <p>We may update this Privacy Policy periodically. Continued use after changes constitutes acceptance.</p>

  <h2>11. Contact</h2>
  <p>Questions? Visit <a href="https://team1676.com" target="_blank" rel="noopener noreferrer">team1676.com</a>.</p>
</section>

<style>
  .legal-wrapper { max-width: 900px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg); line-height: 1.6; }
  h1 { font-size: 2.4rem; margin-bottom: var(--space-lg); }
  h2 { margin-top: var(--space-xl); font-size: 1.3rem; color: var(--primary); }
  p, li { font-size: .95rem; color: var(--text-secondary); }
  ul { padding-left: 1.25rem; margin-top: .5rem; }
  .update-note { font-size: .75rem; color: var(--text-muted); margin-top: -.75rem; margin-bottom: var(--space-sm); }
  a { color: var(--primary); }
</style>
