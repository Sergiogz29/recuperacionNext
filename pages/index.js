import Link from 'next/link';

export default function Home({ posts }) {
  return (
    <div className="container">
      <h1>Listado de Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <a>{post.title}</a>
            </Link>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 2rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 1rem;
          border-bottom: 1px solid #ddd;
          padding-bottom: 0.5rem;
        }
        a {
          text-decoration: none;
          color: #0070f3;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// Usa SSG: getStaticProps en vez de getServerSideProps
export async function getStaticProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}
