// pages/posts/[id].js
// Muestra el detalle de un Post, su autor y sus comentarios
import Link from 'next/link';

export default function PostDetail({ post, user, comments }) {
  return (
    <div className="container">
      {/* Enlace para volver a la página principal */}
      <Link href="/">
        <a>← Volver</a>
      </Link>

      {/* Título y cuerpo del Post */}
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      {/* Información del autor */}
      <section>
        <h2>Autor</h2>
        <p><strong>{user.name}</strong></p>
        <p>Email: {user.email}</p>
      </section>

      {/* Lista de comentarios */}
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
          padding: 2rem;
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

// Obtiene los datos necesarios para el post
export async function getServerSideProps({ params }) {
  const { id } = params;

  // Post
  const resPost = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const post = await resPost.json();

  // Usuario (autor del post)
  const resUser = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`);
  const user = await resUser.json();

  // Comentarios
  const resComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const comments = await resComments.json();

  return {
    props: {
      post,
      user,
      comments
    }
  };
}
