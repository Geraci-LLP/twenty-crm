import { styled } from '@linaria/react';
import { Bold } from '@tiptap/extension-bold';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Italic } from '@tiptap/extension-italic';
import { Link } from '@tiptap/extension-link';
import { ListKit } from '@tiptap/extension-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { Strike } from '@tiptap/extension-strike';
import { Text } from '@tiptap/extension-text';
import { Underline } from '@tiptap/extension-underline';
import { type Editor, EditorContent, useEditor } from '@tiptap/react';
import { useCallback, useEffect } from 'react';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { isDefined } from 'twenty-shared/utils';

import { type CampaignPersonalizationToken } from '@/campaign/types/CampaignTypes';

// Rich-text editor scoped to the email Text module. Outputs HTML (via
// editor.getHTML()) that renderDesignToHtml drops verbatim into a styled
// <td>. Tokens like {{contact.firstName}} round-trip as plain text — TipTap
// has no special handling for braces, so the server-side substitute() still
// sees literal token strings in the rendered HTML.

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledToolbar = styled.div`
  align-items: center;
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-bottom: none;
  border-radius: ${themeCssVariables.border.radius.sm}
    ${themeCssVariables.border.radius.sm} 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledToolbarButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) =>
    active ? themeCssVariables.background.transparent.medium : 'transparent'};
  border: 1px solid transparent;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  cursor: pointer;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  height: 28px;
  min-width: 28px;
  padding: 0 ${themeCssVariables.spacing[1]};
  &:hover {
    background: ${themeCssVariables.background.transparent.lighter};
  }
`;

const StyledToolbarSeparator = styled.div`
  background: ${themeCssVariables.border.color.medium};
  height: 18px;
  width: 1px;
`;

const StyledTokenSelect = styled.select`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  height: 28px;
  padding: 0 ${themeCssVariables.spacing[1]};
`;

const StyledEditorShell = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: 0 0 ${themeCssVariables.border.radius.sm}
    ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.md};
  min-height: 140px;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};

  .ProseMirror {
    min-height: 120px;
    outline: none;
  }
  .ProseMirror p {
    margin: 0 0 ${themeCssVariables.spacing[2]} 0;
  }
  .ProseMirror p:last-child {
    margin-bottom: 0;
  }
  .ProseMirror ul,
  .ProseMirror ol {
    margin: 0 0 ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[5]};
    padding: 0;
  }
  .ProseMirror a {
    color: ${themeCssVariables.color.blue};
    text-decoration: underline;
  }
`;

type EmailRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  tokens?: ReadonlyArray<CampaignPersonalizationToken>;
};

const promptForLink = (editor: Editor) => {
  const previous = editor.getAttributes('link').href as string | undefined;
  const url = window.prompt('Link URL', previous ?? 'https://');
  if (url === null) return;
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

export const EmailRichTextEditor = ({
  value,
  onChange,
  tokens,
}: EmailRichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      Bold,
      Italic,
      Underline,
      Strike,
      Link.configure({ openOnClick: false, autolink: true }),
      ListKit,
    ],
    content: value || '',
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML());
    },
  });

  // Keep editor content in sync if the value prop changes from the outside
  // (e.g. switching modules in the inspector). Skip if it already matches to
  // avoid clobbering the user's caret while typing.
  useEffect(() => {
    if (!isDefined(editor)) return;
    if (editor.getHTML() !== (value || '')) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, value]);

  const insertToken = useCallback(
    (tokenValue: string) => {
      if (!isDefined(editor)) return;
      editor.chain().focus().insertContent(tokenValue).run();
    },
    [editor],
  );

  if (!isDefined(editor)) return null;

  return (
    <StyledWrapper>
      <StyledToolbar>
        <StyledToolbarButton
          type="button"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <b>B</b>
        </StyledToolbarButton>
        <StyledToolbarButton
          type="button"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <i>I</i>
        </StyledToolbarButton>
        <StyledToolbarButton
          type="button"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <u>U</u>
        </StyledToolbarButton>
        <StyledToolbarButton
          type="button"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </StyledToolbarButton>
        <StyledToolbarSeparator />
        <StyledToolbarButton
          type="button"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          •
        </StyledToolbarButton>
        <StyledToolbarButton
          type="button"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          1.
        </StyledToolbarButton>
        <StyledToolbarSeparator />
        <StyledToolbarButton
          type="button"
          active={editor.isActive('link')}
          onClick={() => promptForLink(editor)}
          title="Link"
        >
          🔗
        </StyledToolbarButton>
        {tokens && tokens.length > 0 ? (
          <>
            <StyledToolbarSeparator />
            <StyledTokenSelect
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  insertToken(e.target.value);
                  e.target.value = '';
                }
              }}
              title="Insert personalization token"
            >
              <option value="">Insert token…</option>
              {tokens.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </StyledTokenSelect>
          </>
        ) : null}
      </StyledToolbar>
      <StyledEditorShell>
        <EditorContent editor={editor} />
      </StyledEditorShell>
    </StyledWrapper>
  );
};
