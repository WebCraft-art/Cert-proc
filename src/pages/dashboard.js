import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import CertificateList from '../components/CertificateList';
import Link from 'next/link';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/auth');
    }
  }, [currentUser, router]);

  if (!currentUser) return null;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Panel użytkownika</h1>
          <Link href="/certificates/new">
            <a className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Nowy certyfikat
            </a>
          </Link>
        </div>
        
        <CertificateList userId={currentUser.uid} />
      </div>
    </div>
  );
}
