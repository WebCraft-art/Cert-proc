import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';

export default function Navbar() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-xl font-bold">System Certyfikacji</a>
        </Link>
        
        <div className="flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link href="/dashboard">
                <a className="hover:text-gray-300">Dashboard</a>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <Link href="/auth">
              <a className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                Zaloguj
              </a>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
