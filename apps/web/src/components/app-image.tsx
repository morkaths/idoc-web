import Image, { type ImageProps } from 'next/image';

const UNOPTIMIZED_HOSTS = ['amazon.com'];

/**
 * A wrapper around next/image that automatically handles problematic hosts
 * like Amazon by setting the unoptimized prop to true.
 */
export function AppImage({ src, alt = "", ...props }: ImageProps) {
  const isUnoptimized = typeof src === 'string' &&
    UNOPTIMIZED_HOSTS.some(host => src.includes(host));

  return (
    <Image
      src={src}
      alt={alt}
      {...props}
      unoptimized={props.unoptimized || isUnoptimized}
    />
  );
}
