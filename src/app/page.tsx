import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/case-analysis');
  return null; // redirect will ensure this is not rendered
}
