import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';

function getInitials(name?: string) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || '?';
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AuthorAvatar({ src, name }: { src?: string; name?: string }) {
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={src || undefined}
        alt={name || 'avatar'}
        onError={e => {
          const img = e.target as HTMLImageElement;
          img.onerror = null;
          img.src = '';
        }}
      />
      <AvatarFallback className="text-xs">{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}