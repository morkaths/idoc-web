import Image, { type ImageProps } from 'next/image';

/**
 * A wrapper around next/image that automatically handles problematic hosts
 * like Amazon by setting the unoptimized prop to true.
 */
export function AppImage({ src, alt = '', ...props }: ImageProps) {
  const isExternal =
    typeof src === 'string' && (src.startsWith('http://') || src.startsWith('https://'));

  return <Image src={src} alt={alt} {...props} unoptimized={props.unoptimized || isExternal} />;
}
