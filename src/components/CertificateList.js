import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CertificateList({ userId }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const q = query(
          collection(db, 'certificates'),
          where('createdBy', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const certs = [];
        querySnapshot.forEach((doc) => {
          certs.push({ id: doc.id, ...doc.data() });
        });
        
        setCertificates(certs);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [userId]);

  if (loading) return <p>Ładowanie...</p>;

  return (
    <div className="space-y-4">
      {certificates.length === 0 ? (
        <p>Brak certyfikatów</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="border p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-lg">{cert.clientName}</h3>
              <p className="text-gray-600">{cert.clientEmail}</p>
              <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                cert.status === 'approved' ? 'bg-green-100 text-green-800' :
                cert.status === 'rejected' ? 'bg-red-100 text-red-800' :
                cert.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {cert.status === 'approved' ? 'Zatwierdzony' :
                 cert.status === 'rejected' ? 'Odrzucony' :
                 cert.status === 'pending' ? 'Oczekuje' : 'Wersja robocza'}
              </div>
              <div className="mt-4 flex space-x-2">
                <Link href={`/certificates/${cert.id}`}>
                  <a className="text-blue-500 hover:underline">Edytuj</a>
                </Link>
                <button 
                  onClick={() => router.push(`/certificates/${cert.id}/verify`)}
                  className="text-green-500 hover:underline"
                >
                  Weryfikuj
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
