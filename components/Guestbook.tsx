import React, { useState, useEffect } from 'react';
import { db, auth } from '../src/services/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import ScrambleText from './ScrambleText';
import { MessageSquare, LogIn, LogOut, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestbookMessage {
  id: string;
  text: string;
  authorName: string;
  authorId: string;
  createdAt: any;
}

const Guestbook: React.FC = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestbookMessage[];
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    if (newMessage.length > 500) {
        alert("Message too long (max 500 characters)");
        return;
    }

    try {
      await addDoc(collection(db, 'guestbook'), {
        text: newMessage.trim(),
        authorName: user.displayName || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error adding message', error);
      alert('Error adding message');
    }
  };

  return (
    <section className="p-8 md:p-24 bg-bg text-fg border-t border-fg overflow-hidden relative" id="guestbook">
      <div className="absolute -top-10 -right-10 text-[20vw] opacity-[0.03] pointer-events-none select-none font-serif italic font-bold">
        Sign
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4"><ScrambleText text="Guestbook" /></h2>
                <p className="font-mono text-sm opacity-60">Leave a public message or stamp of approval!</p>
            </div>
            {user ? (
                <button onClick={handleSignOut} className="flex items-center gap-2 font-mono text-xs border border-fg px-3 py-1 hover:bg-fg hover:text-bg transition-colors">
                    <LogOut size={14} /> SIGN OUT
                </button>
            ) : (
                <button onClick={handleSignIn} className="flex items-center gap-2 font-mono text-xs border border-fg px-3 py-1 bg-fg text-bg hover:bg-bg hover:text-fg transition-colors">
                    <LogIn size={14} /> SIGN IN WITH GOOGLE
                </button>
            )}
        </div>

        {user && (
          <form onSubmit={handleSubmit} className="mb-12 flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message..."
              maxLength={500}
              className="flex-1 bg-transparent border-b-2 border-fg outline-none font-mono py-2 text-lg focus:border-opacity-50 transition-colors"
            />
            <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="flex items-center justify-center border-2 border-fg p-3 hover:bg-fg hover:text-bg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-fg"
            >
              <Send size={20} />
            </button>
          </form>
        )}

        <div className="space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-l-2 border-fg pl-6 py-2 relative"
              >
                <div className="absolute left-[-2px] top-0 w-[2px] h-4 bg-fg" />
                <p className="font-sans text-lg mb-2">{msg.text}</p>
                <div className="font-mono text-xs opacity-50 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={12} /> {msg.authorName}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {messages.length === 0 && (
             <div className="font-mono text-sm opacity-40 italic">No messages yet. Be the first!</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Guestbook;
