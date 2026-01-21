import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('HomePage');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blueblack-900 to-blueblack-600 dark:from-white dark:to-slate-300">
        {t('title')}
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        {t('subtitle')}
      </p>
    </div>
  );
}
