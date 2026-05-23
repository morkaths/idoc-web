import { useNavigate, useRouter, type ErrorComponentProps } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean;
} & Partial<ErrorComponentProps>;

export function GeneralError({ className, minimal = false, error }: GeneralErrorProps) {
  const navigate = useNavigate();
  const { history } = useRouter();

  const handleGoBack = () => {
    history.go(-1);
  };

  const handleGoHome = () => {
    navigate({ to: '/' });
  };

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && <h1 className='text-[7rem] leading-tight font-bold'>500</h1>}
        <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
        <p className='text-muted-foreground max-w-[80vw] overflow-auto text-center'>
          {error?.message || 'We apologize for the inconvenience. Please try again later.'}
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button onClick={handleGoBack} variant='outline'>
              Go Back
            </Button>
            <Button onClick={handleGoHome}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  );
}
