import { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { DashboardPageHeader } from '@/components/dashboard'
import { Button, Card } from '@/components/ui'
import { cn } from '@/components/ui/cn'
import { useLocale } from '@/i18n'

export function EditorPage() {
  const { t } = useLocale()
  const [html, setHtml] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: t('forms.editor.placeholder'),
      }),
    ],
    content:
      '<h2>Rich Text Editor</h2><p>This is a free WYSIWYG editor powered by <strong>Tiptap</strong>.</p><ul><li>Bold / italic / headings</li><li>Lists & quotes</li><li>Undo / redo</li></ul>',
    editorProps: {
      attributes: {
        class:
          'min-h-[260px] rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-secondary-900 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-white',
      },
    },
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.getHTML())
    },
  })

  const toolbarButton = (active: boolean) =>
    cn(active && 'border-theme-primary bg-theme-primary text-white hover:brightness-95')

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={t('nav.editor')}
        subtitle={t('forms.editor.subtitle')}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="rounded-xl xl:col-span-2">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('bold'))}
              onClick={() => editor?.chain().focus().toggleBold().run()}
              disabled={!editor}
            >
              {t('forms.editor.bold')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('italic'))}
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              disabled={!editor}
            >
              {t('forms.editor.italic')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('strike'))}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
              disabled={!editor}
            >
              {t('forms.editor.strike')}
            </Button>

            <div className="mx-1 h-7 w-px bg-surface-200 dark:bg-surface-700" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('heading', { level: 2 }))}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              disabled={!editor}
            >
              H2
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('heading', { level: 3 }))}
              onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
              disabled={!editor}
            >
              H3
            </Button>

            <div className="mx-1 h-7 w-px bg-surface-200 dark:bg-surface-700" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('bulletList'))}
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              disabled={!editor}
            >
              {t('forms.editor.bullet_list')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('orderedList'))}
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              disabled={!editor}
            >
              {t('forms.editor.numbered_list')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={toolbarButton(!!editor?.isActive('blockquote'))}
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              disabled={!editor}
            >
              {t('forms.editor.quote')}
            </Button>

            <div className="mx-1 h-7 w-px bg-surface-200 dark:bg-surface-700" />

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor}
            >
              {t('forms.editor.undo')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor}
            >
              {t('forms.editor.redo')}
            </Button>
          </div>

          <EditorContent editor={editor} />
        </Card>

        <Card className="rounded-xl xl:col-span-1">
          <h2 className="heading-5 text-secondary-900 dark:text-white">{t('forms.editor.output_html')}</h2>
          <p className="mt-1 text-body-sm text-secondary-500 dark:text-secondary-400">
            {t('forms.editor.output_desc')}
          </p>

          <div className="mt-4">
            <pre className="max-h-[420px] overflow-auto rounded-xl border border-surface-200 bg-surface-100 p-4 text-xs leading-relaxed text-secondary-800 dark:border-surface-700 dark:bg-surface-900 dark:text-secondary-200">
              {html || '—'}
            </pre>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default EditorPage
