import Link from 'next/link';

export default function PostDetail({ post, user, comments }) {
  return (
    <div className="container">
      <Link href="/">
        <a>← Volver al listado</a>
      </Link>

      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <section>
        <h2>Autor</h2>
        <p>
          <strong>{user.name}</strong> ({user.email})
        </p>
      </section>

      <section>
        <h2>Comentarios</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              <strong>{comment.name}</strong> ({comment.email})
            </p>
            <p>{comment.body}</p>
          </div>
        ))}
      </section>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 2rem auto;
          font-family: Arial, sans-serif;
        }
        a {
          text-decoration: none;
          color: #0070f3;
        }
        h1 {
          margin-top: 1rem;
        }
        section {
          margin-top: 2rem;
        }
        .comment {
          border: 1px solid #ddd;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
}

// Genera rutas dinámicas en build time
export async function getStaticPaths() {
  const resPosts = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await resPosts.json();

  const paths = posts.map((post) => ({
    params: { id: String(post.id) },
  }));

  return {
    paths,
    fallback: false,
  };
}

// Trae datos en build time para cada post
export async function getStaticProps({ params }) {
  const { id } = params;

  // Datos del post
  const resPost = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await resPost.json();

  // Datos del autor (usuario)
  const resUser = await fetch(
    `https://jsonplaceholder.typicode.com/users/${post.userId}`
  );
  const user = await resUser.json();

  // Comentarios del post
  const resComments = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}/comments`
  );
  const comments = await resComments.json();

  return {
    props: {
      post,
      user,
      comments,
    },
  };
}
