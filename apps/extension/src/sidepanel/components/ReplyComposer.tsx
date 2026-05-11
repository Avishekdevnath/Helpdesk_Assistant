import type { ReplyMode } from '@helpdesk/shared-types';

interface ReplyComposerProps {
  reply: string;
  mode: ReplyMode | null;
  isGenerating: boolean;
  canGenerate: boolean;
  canInsert: boolean;
  canSave: boolean;
  onGenerate: () => void;
  onReplyChange: (reply: string) => void;
  onInsert: () => void;
  onSave: () => void;
}

const modeLabels: Record<ReplyMode, string> = {
  full_answer: 'Full answer',
  hint_assignment: 'Assignment hint',
  hint_practice: 'Practice hint',
};

export function ReplyComposer(props: ReplyComposerProps) {
  return (
    <section className="panel-section composer">
      <div className="section-heading">
        <h2>Reply</h2>
        {props.mode ? <span className="mode-badge">{modeLabels[props.mode]}</span> : null}
      </div>
      <button
        type="button"
        className="primary-button"
        disabled={!props.canGenerate || props.isGenerating}
        onClick={props.onGenerate}
      >
        {props.isGenerating ? 'Generating...' : props.reply ? 'Regenerate' : 'Generate reply'}
      </button>
      <label className="field-label" htmlFor="reply-text">
        Editable reply
      </label>
      <textarea
        id="reply-text"
        value={props.reply}
        onChange={(event) => props.onReplyChange(event.target.value)}
        placeholder="Generated reply will appear here."
      />
      <div className="button-row">
        <button type="button" className="secondary-button" disabled={!props.canInsert} onClick={props.onInsert}>
          Insert
        </button>
        <button type="button" className="success-button" disabled={!props.canSave} onClick={props.onSave}>
          Save to KB
        </button>
      </div>
    </section>
  );
}
