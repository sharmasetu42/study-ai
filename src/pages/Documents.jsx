// ============================================================
//  Documents.jsx  –  Connected to real backend
//  - Fetches documents from GET /api/documents
//  - Uploads via POST /api/documents/upload
//  - Deletes via DELETE /api/documents/:id
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Search, Filter, RefreshCw } from 'lucide-react';

import Card from '../components/Card';
import Button from '../components/Button';
import DocumentCard from '../components/DocumentCard';
import UploadBox from '../components/UploadBox';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../components/Toast';

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from '../services/documentService';

import { documents as mockDocs } from '../data/mockData';

const Documents = () => {
  const { showToast, ToastContainer } = useToast();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadModal, setUpload] = useState(false);
  const [selectedFile, setFile] = useState(null);
  const [searchQuery, setSearch] = useState('');
  const [filterStatus, setFilter] = useState('All');

  // ── Fetch all documents ──────────────────────────────────
  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocs(data);
    } catch {
      // Fallback to mock data if backend not running
      setDocs(mockDocs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  // ── Handle file upload ────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile) { showToast('Please select a PDF file first.', 'warning'); return; }
    setUploading(true);
    try {
      const newDoc = await uploadDocument(selectedFile);
      setDocs(prev => [newDoc, ...prev]);
      setUpload(false);
      setFile(null);
      showToast(`"${selectedFile.name}" uploaded! Processing…`, 'success');

      // Poll every 3s until status changes to Ready
      const poll = setInterval(async () => {
        try {
          const fresh = await getDocuments();
          const updated = fresh.find(d => d._id === newDoc._id);
          if (updated?.status === 'Ready') {
            setDocs(fresh);
            clearInterval(poll);
            showToast(`"${selectedFile.name}" is ready!`, 'success');
          }
        } catch { clearInterval(poll); }
      }, 3000);

      // Stop polling after 30s regardless
      setTimeout(() => clearInterval(poll), 30000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ── Handle delete ─────────────────────────────────────────
  const handleDelete = async (doc) => {
    try {
      await deleteDocument(doc._id || doc.id);
      setDocs(prev => prev.filter(d => (d._id || d.id) !== (doc._id || doc.id)));
      showToast(`"${doc.name}" deleted.`, 'default');
    } catch {
      showToast('Delete failed.', 'error');
    }
  };

  // ── Filter ────────────────────────────────────────────────
  const filtered = docs.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFilter = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchFilter;
  });

  const statusOptions = ['All', 'Ready', 'Processing', 'Error'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--gray-900)' }}>My Study Material</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginTop: 4 }}>Your uploaded documents and study resources</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" icon={<RefreshCw size={14} />} onClick={fetchDocs} disabled={loading}>
            Refresh
          </Button>
          <Button variant="primary" icon={<Upload size={15} />} onClick={() => setUpload(true)}>
            + Upload PDF
          </Button>
        </div>
      </div>

      {/* Upload area card */}
      <Card padding="20px">
        <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 12 }}>Upload a new document</p>
        <UploadBox onFileSelect={(f) => { setFile(f); setUpload(true); }} />
      </Card>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid var(--gray-300)', borderRadius: 'var(--radius-xl)', padding: '8px 14px', flex: 1, minWidth: 200 }}>
          <Search size={15} color="var(--gray-400)" />
          <input value={searchQuery} onChange={e => setSearch(e.target.value)} placeholder="Search documents…"
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.88rem', color: 'var(--gray-700)', background: 'transparent' }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Filter size={16} color="var(--gray-400)" style={{ alignSelf: 'center' }} />
          {statusOptions.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1.5px solid', borderColor: filterStatus === s ? 'var(--primary-400)' : 'var(--gray-300)', background: filterStatus === s ? 'var(--primary-50)' : '#fff', color: filterStatus === s ? 'var(--primary-700)' : 'var(--gray-600)', fontSize: '0.8rem', fontWeight: filterStatus === s ? 600 : 400, cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p style={{ fontSize: '0.83rem', color: 'var(--gray-500)' }}>
        {loading ? 'Loading…' : `${filtered.length} document${filtered.length !== 1 ? 's' : ''} found`}
      </p>

      {/* Document grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <LoadingSpinner size={32} />
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 16 }}>
          {filtered.map(doc => (
            <DocumentCard
              key={doc._id || doc.id}
              doc={{ ...doc, id: doc._id || doc.id }}
              onAskAI={() => showToast(`Opening AI Tutor for "${doc.name}"`, 'success')}
              onOpen={() => showToast(`Opening "${doc.name}"…`, 'default')}
              onDelete={() => handleDelete(doc)}
            />
          ))}
        </div>
      ) : (
        <Card padding="40px" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>📂</p>
          <p style={{ fontWeight: 600, color: 'var(--gray-700)' }}>No documents found</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: 4 }}>Upload a PDF to get started.</p>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadModal} onClose={() => { setUpload(false); setFile(null); }} title="Upload Study Material" maxWidth="500px">
        <UploadBox onFileSelect={setFile} />
        {selectedFile && (
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-800)' }}>Ready to upload: {selectedFile.name}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--primary-600)', marginTop: 3 }}>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <Button variant="outline" onClick={() => { setUpload(false); setFile(null); }}>Cancel</Button>
          <Button variant="primary" icon={<Upload size={14} />} onClick={handleUpload} disabled={!selectedFile} loading={uploading}>
            {uploading ? 'Uploading…' : 'Upload PDF'}
          </Button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Documents;
