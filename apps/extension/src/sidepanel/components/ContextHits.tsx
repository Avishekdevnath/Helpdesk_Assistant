import type { GenerateReplyResponse } from '@helpdesk/shared-types';

interface ContextHitsProps {
  reply: GenerateReplyResponse | null;
}

export function ContextHits({ reply }: ContextHitsProps) {
  return (
    <section className="panel-section">
      <details>
        <summary>Context used</summary>
        <div className="hit-group">
          <h3>KB hits</h3>
          {reply?.kbHits.length ? (
            <ul>
              {reply.kbHits.map((hit) => (
                <li key={hit.id}>{hit.title}</li>
              ))}
            </ul>
          ) : (
            <p>No KB context used.</p>
          )}
        </div>
        <div className="hit-group">
          <h3>Question hits</h3>
          {reply?.questionHits.length ? (
            <ul>
              {reply.questionHits.map((hit) => (
                <li key={hit.id}>{hit.questionText}</li>
              ))}
            </ul>
          ) : (
            <p>No matching assignment or practice question.</p>
          )}
        </div>
      </details>
    </section>
  );
}
