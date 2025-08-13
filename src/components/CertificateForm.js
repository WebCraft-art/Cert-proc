import { useState } from 'react';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export default function CertificateForm({ certificate = null }) {
  const [formData, setFormData] = useState({
    clientName: certificate?.clientName || '',
    clientEmail: certificate?.clientEmail || '',
    certificateData: certificate?.certificateData || '',
    status: certificate?.status || 'draft',
  });
  
  const router = useRouter();
  const isEdit = !!certificate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'certificates', certificate.id), formData);
        toast.success('Certyfikat zaktualizowany');
      } else {
        await addDoc(collection(db, 'certificates'), {
          ...formData,
          createdAt: new Date(),
          createdBy: router.query.userId,
        });
        toast.success('Certyfikat utworzony');
      }
      router.push('/dashboard');
    } catch (error) {
      toast.error('Błąd: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Nazwa klienta</label>
        <input
          type="text"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2">Email klienta</label>
        <input
          type="email"
          name="clientEmail"
          value={formData.clientEmail}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2">Dane certyfikatu</label>
        <textarea
          name="certificateData"
          value={formData.certificateData}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          rows="5"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="draft">Wersja robocza</option>
          <option value="pending">Oczekuje na weryfikację</option>
          <option value="approved">Zatwierdzony</option>
          <option value="rejected">Odrzucony</option>
        </select>
      </div>
      
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isEdit ? 'Aktualizuj' : 'Utwórz'} certyfikat
      </button>
    </form>
  );
}
