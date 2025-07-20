'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [recaptchaReady, setRecaptchaReady] = useState(false);

  useEffect(() => {
    const scriptId = 'recaptcha-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY`;
      script.id = scriptId;
      script.async = true;
      script.onload = () => setRecaptchaReady(true);
      document.body.appendChild(script);
    } else {
      setRecaptchaReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaReady || !window.grecaptcha) {
      alert('reCAPTCHA not ready yet. Please try again.');
      return;
    }

    const token = await window.grecaptcha.execute('YOUR_SITE_KEY', { action: 'submit' });

    const res = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const result = await res.json();
    if (result.success) {
      alert('reCAPTCHA verified! Score: ' + result.score);
    } else {
      alert('Failed reCAPTCHA. Score: ' + result.score);
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-xl mb-4">Contact Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Your Name" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </main>
  );
}
