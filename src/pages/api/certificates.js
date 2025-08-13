import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const querySnapshot = await getDocs(collection(db, 'certificates'));
      const certificates = [];
      querySnapshot.forEach((doc) => {
        certificates.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(certificates);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const docRef = await addDoc(collection(db, 'certificates'), {
        ...req.body,
        createdAt: new Date(),
      });
      res.status(201).json({ id: docRef.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      await updateDoc(doc(db, 'certificates', req.query.id), req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
