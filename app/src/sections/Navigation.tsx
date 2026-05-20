import { Link } from 'react-router';

export default function Navigation() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1.25rem 2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 245, 240, 0.9)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Link
        to="/admin"
        style={{
          fontSize: '0.7rem',
          fontWeight: 300,
          letterSpacing: '0.1em',
          textDecoration: 'none',
          color: '#3d2b1f',
          opacity: 0.5,
          transition: 'opacity 0.3s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.opacity = '0.5'; }}
      >
        edit
      </Link>
    </nav>
  );
}
