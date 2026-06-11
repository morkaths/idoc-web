import React from 'react';

type OfficeViewerProps = {
  fileUrl: string;
};

export function OfficeViewer({ fileUrl }: OfficeViewerProps) {
  return (
    <iframe
      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
      width='100%'
      height='100%'
      title='Book file'
      className='h-full w-full border-none'
    />
  );
}
