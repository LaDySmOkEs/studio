'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function HomePage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute('6Ley_YIrAAAAAE8lgRwA6FIn-kd9a7xvSvlTfnYR', { action: 'homepage' })
          .then((token) => {
            console.log('reCAPTCHA token:', token);

            // Example: Send token to your backend API route
            fetch('/api/verify-recaptcha', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token }),
            })
              .then((res) => res.json())
              .then((data) => {
                console.log('reCAPTCHA verification response:', data);
              });
          });
      });
    }
  }, []);

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js?render=6Ley_YIrAAAAAE8lgRwA6FIn-kd9a7xvSvlTfnYR"
        strategy="afterInteractive"
      />
      <main className="p-8">
        <h1 className="text-3xl font-bold">Welcome to Studio</h1>
        <p>This page is protected by reCAPTCHA v3.</p>
      </main>
    </>
  );
}
