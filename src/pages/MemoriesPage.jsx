import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { db } from '@/utils/database';

export function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');

  // ⭐ LOAD DATA SAAT MOUNT
  useEffect(() => {
    const saved = storage.getItem('memories');
    if (saved) {
      setMemories(saved);
      console.log('✅ Loaded memories from local storage:', saved);
    }
  }, []);

  // ⭐ TAMBAH MEMORY BARU
  const addMemory = async () => {
    if (!newMemory.trim()) return;

    const memory = {
      id: Date.now(),
      text: newMemory,
      date: new Date().toLocaleDateString('id-ID')
    };

    // Update state (display instant)
    const updated = [...memories, memory];
    setMemories(updated);

    // Save to localStorage (cepat, offline-ready)
    storage.setItem('memories', updated);
    
    // Backup to IndexedDB (untuk keamanan)
    await db.save('memories', memory);

    // Clear input
    setNewMemory('');

    console.log('✅ Memory saved!', memory);
  };

  // ⭐ HAPUS MEMORY
  const deleteMemory = (id) => {
    const updated = memories.filter(m => m.id !== id);
    setMemories(updated);
    storage.setItem('memories', updated);
    console.log('✅ Memory deleted');
  };

  // ⭐ CLEAR SEMUA
  const clearAll = () => {
    if (window.confirm('Yakin hapus semua memories?')) {
      setMemories([]);
      storage.removeItem('memories');
      console.log('✅ All memories cleared');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-600">💕 Our Memories</h1>

      {/* Input */}
      <div className="mb-6 bg-pink-50 p-4 rounded-lg">
        <textarea
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          placeholder="Tulis memory spesial untuk dia..."
          className="w-full p-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 resize-none"
          rows={3}
        />
        <button
          onClick={addMemory}
          className="mt-3 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition font-semibold"
        >
          💝 Add Memory
        </button>
      </div>

      {/* Display Memories */}
      <div className="space-y-3">
        {memories.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Belum ada memories... mulai tulis! 💫</p>
        ) : (
          memories.map(memory => (
            <div
              key={memory.id}
              className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-800">{memory.text}</p>
              <div className="flex justify-between items-center mt-3">
                <small className="text-gray-600">{memory.date}</small>
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Storage Info */}
      {memories.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
          <p>📊 Stored Locally:</p>
          <p>• {memories.length} memories</p>
          <p>• Storage size: {storage.getSize()} KB</p>
          <button
            onClick={clearAll}
            className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            🗑️ Clear All
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          💾 Semua data disimpan di HP Anda secara lokal. Tidak perlu internet untuk mengakses! ✅
        </p>
      </div>
    </div>
  );
}