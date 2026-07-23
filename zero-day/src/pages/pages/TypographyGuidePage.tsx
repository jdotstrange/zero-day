import { Icon, Icons } from '@/components/common'
import { useLocale } from '@/i18n'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  FormField,
  Input,
  Label,
  Select,
  Textarea,
} from '@/components/ui'

export default function TypographyGuidePage() {
  const { t } = useLocale()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-2 text-secondary-900 dark:text-white">{t('typography.title')}</h1>
        <p className="text-body-sm text-secondary-600 dark:text-secondary-400 mt-2">
          {t('typography.subtitle')}
        </p>
        <p className="text-caption text-secondary-500 dark:text-secondary-400 mt-1">
          {t('brand.name')} - {t('typography.route_info')} <code>/pages/typography</code>
        </p>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900 dark:text-white">{t('typography.marketing_display')}</h2>
        <div className="space-y-6">
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-display-hero</div>
            <div className="text-display-hero text-secondary-900 dark:text-white">{t('typography.display_hero')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-display-section</div>
            <div className="text-display-section text-secondary-900 dark:text-white">{t('typography.display_section')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-display-price</div>
            <div className="text-display-price text-secondary-900 dark:text-white">{t('typography.display_price')}</div>
          </div>

          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-lead</div>
            <p className="text-lead text-secondary-600 dark:text-secondary-400 max-w-3xl">
              {t('typography.lead_text')}
            </p>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900 dark:text-white">{t('typography.headings')}</h2>

        <div className="space-y-4">
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.heading-1</div>
            <div className="heading-1 text-secondary-900 dark:text-white">{t('typography.heading_1')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.heading-2</div>
            <div className="heading-2 text-secondary-900 dark:text-white">{t('typography.heading_2')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.heading-3</div>
            <div className="heading-3 text-secondary-900 dark:text-white">{t('typography.heading_3')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.heading-4</div>
            <div className="heading-4 text-secondary-900 dark:text-white">{t('typography.heading_4')}</div>
          </div>
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.heading-5</div>
            <div className="heading-5 text-secondary-900 dark:text-white">{t('typography.heading_5')}</div>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900 dark:text-white">{t('typography.body_ui_text')}</h2>

        <div className="space-y-3">
          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-body</div>
            <p className="text-body text-secondary-600 dark:text-secondary-400">
              {t('typography.body_text')}
            </p>
          </div>

          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-body-sm</div>
            <p className="text-body-sm text-secondary-600 dark:text-secondary-400">
              {t('typography.body_sm_text')}
            </p>
          </div>

          <div>
            <div className="text-caption text-secondary-500 dark:text-secondary-400">.text-caption</div>
            <p className="text-caption text-secondary-500 dark:text-secondary-400">
              {t('typography.caption_text')}
            </p>
          </div>

          <div className="pt-2">
            <div className="text-caption text-secondary-500 dark:text-secondary-400 mb-2">{t('typography.ui_micro_sizes')}</div>
            <div className="flex flex-wrap gap-3">
              <span className="text-ui px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200">.text-ui</span>
              <span className="text-ui-sm px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200">.text-ui-sm</span>
              <span className="text-ui-xs px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200">.text-ui-xs</span>
              <span className="text-ui-2xs px-3 py-1 rounded-lg bg-surface-100 dark:bg-surface-800 text-secondary-700 dark:text-secondary-200">.text-ui-2xs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card rounded-xl p-6 space-y-5">
        <h2 className="heading-4 text-secondary-900 dark:text-white">{t('typography.emphasis')}</h2>

        <p className="text-body text-secondary-600 dark:text-secondary-400">
          {t('typography.emphasis_sentence')} <strong>{t('typography.strong')}</strong>, <b>{t('typography.bold')}</b>, and{' '}
          <span className="text-strong text-secondary-900 dark:text-white">{t('typography.span_with_strong')}</span>.
        </p>

        <p className="text-body-sm text-secondary-600 dark:text-secondary-400">
          {t('typography.emphasis_note')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('typography.ui_components')}</CardTitle>
          <CardDescription>{t('typography.ui_components_subtitle')}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="space-y-3">
            <p className="text-label text-secondary-500 dark:text-secondary-400">{t('typography.ui_buttons')}</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">{t('typography.ui_btn_primary')}</Button>
              <Button variant="secondary">{t('typography.ui_btn_secondary')}</Button>
              <Button variant="outline">{t('typography.ui_btn_outline')}</Button>
              <Button variant="ghost">{t('typography.ui_btn_ghost')}</Button>
              <Button variant="danger">{t('typography.ui_btn_danger')}</Button>
              <Button variant="primary" loading>{t('typography.ui_btn_loading')}</Button>
              <Button variant="outline" size="sm">
                <Icon icon={Icons.plus} />
                {t('typography.ui_btn_primary')}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-label text-secondary-500 dark:text-secondary-400">{t('typography.ui_badges')}</p>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <FormField label={t('typography.ui_field_label')} htmlFor="ui-demo-input" hint={t('typography.ui_field_hint')}>
              <Input id="ui-demo-input" placeholder={t('typography.ui_field_placeholder')} />
            </FormField>

            <FormField
              label={t('typography.ui_field_select')}
              htmlFor="ui-demo-select"
              error={t('typography.ui_field_error')}
            >
              <Select id="ui-demo-select" error defaultValue="">
                <option value="" disabled>{t('typography.ui_field_select_placeholder')}</option>
                <option value="a">Option A</option>
                <option value="b">Option B</option>
              </Select>
            </FormField>

            <FormField label={t('typography.ui_field_textarea')} htmlFor="ui-demo-textarea" className="lg:col-span-2">
              <Textarea id="ui-demo-textarea" rows={3} placeholder={t('typography.ui_field_placeholder')} />
            </FormField>

            <div className="flex items-center gap-2 lg:col-span-2">
              <Checkbox id="ui-demo-checkbox" defaultChecked />
              <Label htmlFor="ui-demo-checkbox">{t('typography.ui_checkbox_label')}</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="primary">{t('typography.ui_save')}</Button>
          <Button variant="outline">{t('typography.ui_cancel')}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
