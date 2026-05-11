import type { PostContext } from '../../types';

interface PostContextCardProps {
  context: PostContext | null;
}

export function PostContextCard({ context }: PostContextCardProps) {
  const state = !context?.title || !context.body ? 'Not detected' : context.hasCommentBox ? 'Detected' : 'Partial';

  return (
    <section className="panel-section">
      <div className="section-heading">
        <h2>Current post</h2>
        <span className={`status status-${state.toLowerCase().replace(' ', '-')}`}>{state}</span>
      </div>
      <h3 className="post-title">{context?.title || 'No post title found'}</h3>
      <p className="post-body">{context?.body || 'Open a Phitron helpdesk post and refresh detection.'}</p>
    </section>
  );
}
