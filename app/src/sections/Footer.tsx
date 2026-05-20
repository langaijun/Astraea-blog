export default function Footer() {
  const links = [
    { label: 'Astraea', url: 'https://www.get-astraea.com/' },
    { label: 'Hush', url: 'https://www.hushforsleep.com/' },
  ];

  return (
    <footer
      style={{
        padding: '3rem 2rem 4rem',
        borderTop: '1px solid rgba(61, 43, 31, 0.06)',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
          display: 'flex',
          gap: '2rem',
          alignItems: 'center',
        }}
      >
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.75rem',
              color: '#a09288',
              textDecoration: 'none',
              letterSpacing: '0.05em',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#c1784a'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.color = '#a09288'; }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
