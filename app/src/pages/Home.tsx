import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getPosts, excerpt, type BlogPost } from '../data/posts';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navigation />

      <section
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          padding: '2rem 2rem 8rem',
        }}
      >
        {posts.map((post) => (
          <article
            key={post.id}
            style={{
              marginBottom: '2.5rem',
              paddingBottom: '2.5rem',
              borderBottom: '1px solid rgba(61, 43, 31, 0.06)',
            }}
          >
            <Link
              to={`/p/${post.slug}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#a09288',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                {formatDate(post.date)}
              </span>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 400,
                  color: '#3d2b1f',
                  lineHeight: 1.5,
                  margin: '0 0 0.6rem 0',
                  wordBreak: 'keep-all',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c1784a'; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#3d2b1f'; }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 300,
                  color: '#8a7a6e',
                  lineHeight: 1.85,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'keep-all',
                }}
              >
                {excerpt(post.content)}
              </p>
            </Link>
          </article>
        ))}
      </section>
      <Footer />
    </div>
  );
}
