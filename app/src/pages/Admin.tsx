// @ts-nocheck
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getLocalPosts, saveLocalPosts, deleteLocalPost, slugify } from '../data/posts';

type Mode = 'list' | 'form';

export default function Admin() {
  const [mode, setMode] = useState<Mode>('list');
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState('');
  const [msg, setMsg] = useState('');
  const [exported, setExported] = useState(false);

  useEffect(() => {
    setPosts(getLocalPosts());
  }, []);

  useEffect(() => {
    if (mode === 'form' && !editingId) {
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setContent('');
    }
  }, [mode, editingId]);

  function handleSave() {
    if (!title.trim() || !content.trim()) {
      setMsg('标题和内容不能为空');
      setTimeout(() => setMsg(''), 2000);
      return;
    }
    const allPosts = getLocalPosts();
    if (editingId) {
      const idx = allPosts.findIndex((p) => p.id === editingId);
      if (idx >= 0) {
        allPosts[idx] = {
          ...allPosts[idx],
          title: title.trim(),
          date,
          content: content.trim(),
          slug: slugify(title.trim()),
        };
        setMsg('已保存');
      }
    } else {
      allPosts.unshift({
        id: Date.now().toString(),
        title: title.trim(),
        date,
        content: content.trim(),
        slug: slugify(title.trim()),
      });
      setMsg('已发布');
    }
    saveLocalPosts(allPosts);
    setPosts(allPosts);
    setTimeout(() => {
      setMsg('');
      setMode('list');
      setEditingId('');
    }, 800);
  }

  function handleDelete(id) {
    if (confirm('确定删除？')) {
      deleteLocalPost(id);
      setPosts(getLocalPosts());
    }
  }

  function handleExport() {
    const json = JSON.stringify(getLocalPosts(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'posts.json';
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setMsg('已导出 posts.json');
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(61,43,31,0.06)' }}>
        <span style={{ fontSize: '0.7rem', color: '#a09288' }}>管理后台</span>
      </nav>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        {msg && <div style={{ padding: '0.75rem 1rem', backgroundColor: '#3d2b1f', color: '#faf5f0', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{msg}</div>}

        {mode === 'list' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#3d2b1f', margin: 0 }}>全部文章</h1>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {posts.length > 0 && (
                  <button onClick={handleExport} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#c1784a', color: '#faf5f0', border: 'none', fontSize: '0.75rem', letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 300 }}>
                    导出 JSON
                  </button>
                )}
                <button onClick={() => { setMode('form'); setEditingId(''); setExported(false); }} style={{ padding: '0.5rem 1.25rem', backgroundColor: '#3d2b1f', color: '#faf5f0', border: 'none', fontSize: '0.75rem', letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 300 }}>
                  写文章
                </button>
              </div>
            </div>

            {posts.map((post) => (
              <div key={post.id} style={{ padding: '0.875rem 0', borderBottom: '1px solid rgba(61,43,31,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontSize: '0.65rem', color: '#a09288', display: 'block', marginBottom: '0.2rem' }}>{post.date}</span>
                  <span style={{ fontSize: '0.9rem', color: '#3d2b1f', fontWeight: 400, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {post.title}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, marginLeft: '1rem' }}>
                  <button onClick={() => { setEditingId(post.id); setTitle(post.title); setDate(post.date); setContent(post.content); setMode('form'); setExported(false); }} style={{ fontSize: '0.7rem', color: '#a09288', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>编辑</button>
                  <button onClick={() => handleDelete(post.id)} style={{ fontSize: '0.7rem', color: '#c1784a', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>删除</button>
                </div>
              </div>
            ))}

            {posts.length === 0 && <p style={{ color: '#a09288', textAlign: 'center', padding: '4rem 0' }}>还没有文章，点击「写文章」开始</p>}

            {exported && (
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0ebe5', borderRadius: '2px' }}>
                <p style={{ fontSize: '0.75rem', color: '#3d2b1f', margin: 0, lineHeight: 1.6 }}>
                  posts.json 已下载。请将文件放到项目的 <code style={{ background: '#e0d8d0', padding: '0.1rem 0.3rem' }}>public/</code> 目录覆盖原文件，然后提交到 Git 部署。
                </p>
              </div>
            )}
          </>
        )}

        {mode === 'form' && (
          <>
            <button onClick={() => { setMode('list'); setEditingId(''); }} style={{ fontSize: '0.75rem', color: '#a09288', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1.5rem' }}>
              {'<-'} 返回列表
            </button>

            <h1 style={{ fontSize: '1.25rem', fontWeight: 400, color: '#3d2b1f', margin: '0 0 1.5rem 0' }}>
              {editingId ? '编辑文章' : '写文章'}
            </h1>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#a09288', marginBottom: '0.4rem' }}>标题</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="文章标题" style={input} />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#a09288', marginBottom: '0.4rem' }}>日期</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={input} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', color: '#a09288', marginBottom: '0.4rem' }}>正文（空行分段）</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="在这里写正文..." rows={18} style={{ ...input, resize: 'vertical', lineHeight: 1.8 }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#3d2b1f', color: '#faf5f0', border: 'none', fontSize: '0.8rem', letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 300 }}>
                {editingId ? '保存' : '发布'}
              </button>
              <button onClick={() => { setMode('list'); setEditingId(''); }} style={{ padding: '0.6rem 1.5rem', backgroundColor: 'transparent', color: '#8a7a6e', border: '1px solid rgba(61,43,31,0.12)', fontSize: '0.8rem', letterSpacing: '0.05em', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 300 }}>
                取消
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const input = {
  width: '100%',
  padding: '0.65rem 0.75rem',
  border: '1px solid rgba(61,43,31,0.12)',
  backgroundColor: 'transparent',
  color: '#3d2b1f',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  fontWeight: 300,
  outline: 'none',
  boxSizing: 'border-box' as const,
};
