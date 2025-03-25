// pages/index.js
// Página principal que muestra 10 posts aleatorios
import PostCard from '../components/PostCard';

export default function Home({ posts }) {
  return (
    <div className="container">
      <h1>Posts Aleatorios</h1>

      {/* Grid con tarjetas de Post */}
      <div className="posts-grid">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <style jsx>{`
        .container {
          padding: 2rem;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}

// Esta función se ejecuta en el servidor en cada request
export async function getServerSideProps() {
  // Obtener todos los posts desde JSONPlaceholder
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const allPosts = await res.json();

  // Selecciona 10 posts aleatorios
  const shuffled = allPosts.sort(() => 0.5 - Math.random());
  const posts = shuffled.slice(0, 10);

  return {
    props: { posts }
  };
}
