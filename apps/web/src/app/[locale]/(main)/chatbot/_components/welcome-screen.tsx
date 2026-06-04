'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { PROMPT_SUGGESTIONS, ORB_THEME_COLORS } from '@/components/chat/data/chatbot-data';
import { useTheme } from '@/context/theme-provider';
import SiriOrb from '@/components/siri-orb';
import { HighlightedText } from '@repo/ui/components/highlighted-text';

interface WelcomeScreenProps {
  onSendSuggestedPrompt: (promptText: string) => void;
}

export const WelcomeScreen = ({ onSendSuggestedPrompt }: WelcomeScreenProps) => {
  const t = useTranslations('chatbot');
  const { resolvedMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = resolvedMode === 'dark';

  const orbColors = {
    ...(isDark ? ORB_THEME_COLORS.dark : ORB_THEME_COLORS.light),
    bg: 'var(--background)',
  };

  return (
    <div className='mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center overflow-y-auto p-4 text-center'>
      <div className='mb-6 flex h-[128px] w-[128px] items-center justify-center'>
        {mounted ? (
          <SiriOrb size='128px' colors={orbColors} />
        ) : (
          <div className='h-[128px] w-[128px]' />
        )}
      </div>
      <h2 className='text-foreground text-2xl sm:text-3xl font-bold tracking-tight'>
        {t.rich('welcomeTitle', {
          highlight1: (chunks) => (
            <HighlightedText delay={0.2} from='left'>
              {chunks}
            </HighlightedText>
          ),
          highlight2: (chunks) => (
            <HighlightedText delay={0.4} from='left'>
              {chunks}
            </HighlightedText>
          ),
        })}
      </h2>
      <p className='text-muted-foreground mt-2 max-w-md text-sm'>{t('welcomeSubtitle')}</p>

      {/* Suggestions Grid */}
      <div className='mt-8 grid w-full max-w-xl grid-cols-1 gap-3.5 md:grid-cols-2'>
        {PROMPT_SUGGESTIONS.map((item, idx) => {
          const title = t(`prompts.${item.id}.title`);
          const desc = t(`prompts.${item.id}.desc`);

          return (
            <div
              key={idx}
              onClick={() => onSendSuggestedPrompt(desc)}
              className='border-border/70 hover:border-primary/50 bg-background/50 hover:bg-muted/40 group flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-300'
            >
              <div className='bg-primary/5 group-hover:bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors'>
                <item.icon className='h-4 w-4' />
              </div>
              <div>
                <h4 className='text-foreground group-hover:text-primary text-xs font-semibold transition-colors'>
                  {title}
                </h4>
                <p className='text-muted-foreground mt-0.5 line-clamp-2 text-[11px] leading-relaxed'>
                  {desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
