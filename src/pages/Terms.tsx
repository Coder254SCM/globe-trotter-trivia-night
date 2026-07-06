import { Link } from "react-router-dom";

const Terms = () => (
  <main className="max-w-3xl mx-auto px-4 py-10 prose prose-slate dark:prose-invert">
    <h1>Terms of Service</h1>
    <p><em>Last updated: {new Date().toLocaleDateString()}</em></p>

    <p>These Terms of Service ("Terms") govern your use of Global Quiz Game
    ("the App"), operated from Kenya. By creating an account or using the App
    you agree to these Terms.</p>

    <h2>1. Eligibility</h2>
    <p>You must be at least 13 years old to use the App. If you are under the
    age of majority in your country you may only use the App with the consent
    of a parent or guardian.</p>

    <h2>2. Accounts</h2>
    <p>You are responsible for the activity that happens under your account and
    for keeping your credentials secure. You may delete your account at any
    time from the <Link to="/account">Account</Link> page.</p>

    <h2>3. Acceptable use</h2>
    <p>Do not upload unlawful, harmful, harassing, or infringing content. Do
    not attempt to disrupt, reverse-engineer, or gain unauthorized access to
    the App or its infrastructure.</p>

    <h2>4. User-submitted content</h2>
    <p>Community-submitted questions may be reviewed, edited, or removed by
    moderators. By submitting content you grant us a non-exclusive, worldwide,
    royalty-free license to display and distribute it within the App.</p>

    <h2>5. Disclaimer</h2>
    <p>The App is provided "as is" without warranties of any kind. Quiz
    content is provided for educational and entertainment purposes and may
    contain inaccuracies.</p>

    <h2>6. Limitation of liability</h2>
    <p>To the maximum extent permitted by law, we are not liable for any
    indirect, incidental, or consequential damages arising from your use of
    the App.</p>

    <h2>7. Governing law</h2>
    <p>These Terms are governed by the laws of the Republic of Kenya. Any
    dispute shall be subject to the exclusive jurisdiction of the courts of
    Kenya.</p>

    <h2>8. Changes</h2>
    <p>We may update these Terms from time to time. Continued use of the App
    after changes take effect constitutes acceptance of the updated Terms.</p>

    <h2>9. Contact</h2>
    <p>Questions about these Terms: <a href="mailto:scmcoded@gmail.com">scmcoded@gmail.com</a></p>

    <p><Link to="/">← Back home</Link></p>
  </main>
);

export default Terms;
