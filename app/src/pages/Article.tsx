import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { getPostBySlug } from '../data/posts';
import type { BlogPost } from '../data/posts';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug).then(p => setPost(p || null));
    }
  }, [slug]);

  if (!post) {
    return (
      <div style={{ minHeight: '100vh', padding: '6rem 2rem', textAlign: 'center' }}>
        <Navigation />
        <p style={{ color: '#8a7a6e', marginTop: '10rem' }}>文章不存在</p>
        <Link to="/" style={{ color: '#c1784a', textDecoration: 'none', fontSize: '0.875rem' }}>
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />

      <article
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '2rem 2rem 10rem',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '0.75rem',
            color: '#a09288',
            textDecoration: 'none',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '1.5rem',
          }}
        >
          {'<-'} All posts
        </Link>

        <span
          style={{
            fontSize: '0.7rem',
            color: '#a09288',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '0.75rem',
          }}
        >
          {post.date}
        </span>

        <h1
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 400,
            color: '#3d2b1f',
            lineHeight: 1.35,
            margin: '0 0 2.5rem 0',
            wordBreak: 'keep-all',
          }}
        >
          {post.title}
        </h1>

        <div
          style={{
            color: '#3d2b1f',
            fontSize: '0.95rem',
            lineHeight: 2,
            fontWeight: 300,
          }}
        >
          {post.content.split('\n\n').map((para, i) => (
            <p key={i} style={{ marginBottom: '1.5rem', textAlign: 'justify', wordBreak: 'keep-all' }}>
              {para}
            </p>
          ))}
        </div>

        <div
          style={{
            marginTop: '5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(61, 43, 31, 0.06)',
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: '0.75rem',
              color: '#a09288',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            {'<-'} Back to posts
          </Link>
        </div>
      </article>
      <Footer />
    </div>
  );
}
