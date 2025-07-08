// Editor.js (with Chat Panel)
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import ChatPanel from './ChatPanel';

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  [{ color: [] }, { background: [] }],
  ['link', 'image'],
  ['clean'],
];

const Editor = () => {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    console.log("🚀 Connecting to Socket.io...");
    const s = io('http://localhost:3001');
    setSocket(s);

    return () => {
      console.log("❌ Disconnecting socket...");
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    console.log("📩 Requesting document from backend...");
    socket.once('load-document', document => {
      console.log("✅ Document loaded from backend");
      quill.setContents(document);
      quill.enable();
    });

    socket.emit('get-document', documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = delta => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);
    return () => socket.off('receive-changes', handler);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [socket, quill]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  const wrapperRef = useCallback(wrapper => {
    console.log("🧱 Quill wrapper mounted");
    if (!wrapper) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div className="container" ref={wrapperRef}></div>
      <ChatPanel roomId={documentId} username="Guest" />
    </div>
  );
};

export default Editor;
