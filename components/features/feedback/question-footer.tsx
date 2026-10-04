import { ArrowLeft, ArrowRight } from 'lucide-react';
import { copy } from '@/config/copy';
import { Button } from '@/components/ui/button';

const t = copy.flow.question;

/** Back and Skip are always visible. Next appears once there is an answer. */
export function QuestionFooter({
  answered,
  onBack,
  onSkip,
  onNext,
}: {
  answered: boolean;
  onBack: () => void;
  onSkip: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={onBack} className="px-3">
        <ArrowLeft className="size-4" aria-hidden />
        {t.back}
      </Button>
      <div className="flex-1" />
      <Button variant="secondary" onClick={onSkip}>
        {t.skip}
      </Button>
      {answered && (
        <Button onClick={onNext} className="min-w-28">
          {t.next}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      )}
    </div>
  );
}
