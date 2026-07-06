import { Link } from "react-router-dom";

const Privacy = () => (
  <main className="max-w-3xl mx-auto px-4 py-10 prose prose-slate dark:prose-invert">
    <h1>Privacy Policy</h1>
    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

    <p>This Privacy Policy explains how Global Quiz Game ("we", "us") collects
    and uses your information. We operate from Kenya and aim to comply with
    the Kenyan Data Protection Act, 2019 and, where applicable, the GDPR.</p>

    <h2>1. Information we collect</h2>
    <ul>
      <li><strong>Account data:</strong> email address, username, hashed password (via Supabase Auth).</li>
      <li><strong>Gameplay data:</strong> quiz sessions, scores, streaks, achievements, submitted questions and votes.</li>
      <li><strong>Technical data:</strong> device type, browser, IP address, and log data collected automatically for security and analytics.</li>
    </ul>

    <h2>2. How we use your information</h2>
    <ul>
      <li>To provide and personalize the quiz experience.</li>
      <li>To operate leaderboards, multiplayer rooms, and community moderation.</li>
      <li>To secure the App and prevent abuse.</li>
      <li>To communicate important service messages.</li>
    </ul>

    <h2>3. Legal basis</h2>
    <p>We process your data on the basis of contract (to provide the service
    you signed up for), legitimate interests (security, product improvement),
    and your consent where required.</p>

    <h2>4. Sharing</h2>
    <p>We do not sell your personal data. We share limited data with
    infrastructure providers (Supabase for database, authentication and edge
    functions; Lovable AI Gateway for AI features) strictly to operate the
    App.</p>

    <h2>5. Data retention</h2>
    <p>We retain account and gameplay data for as long as your account is
    active. When you delete your account, your personal data and gameplay
    records are permanently deleted (see Section 7).</p>

    <h2>6. Your rights</h2>
    <p>You have the right to access, correct, export, or delete your personal
    data. You can exercise most of these rights from the
    <Link to="/account"> Account</Link> page or by emailing us.</p>

    <h2>7. Account & data deletion</h2>
    <p>Visit <Link to="/account">/account</Link> and choose "Delete my
    account". This immediately and permanently removes your authentication
    record, profile, stats, quiz sessions, submitted questions, votes, and
    room participation. This action cannot be undone.</p>

    <h2>8. Children's privacy</h2>
    <p>The App is not directed at children under 13, and we do not knowingly
    collect data from them.</p>

    <h2>9. Security</h2>
    <p>Passwords are hashed by Supabase Auth. Database access is protected by
    Row Level Security policies. No system is 100% secure — please use a
    strong, unique password.</p>

    <h2>10. Contact</h2>
    <p>Data protection questions: <a href="mailto:scmcoded@gmail.com">scmcoded@gmail.com</a></p>

    <p><Link to="/">← Back home</Link></p>
  </main>
);

export default Privacy;
