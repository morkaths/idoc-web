'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'motion/react';
import { type Testimonial, TESTIMONIALS } from './data/testimonial-data';

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

export default function Page() {
  return (
    <section className='relative py-10'>
      <div className='mx-auto max-w-5xl'>
        <div className='mx-auto flex max-w-sm flex-col items-center justify-center gap-2'>
          <div className='flex justify-center'>
            <div className='rounded-lg border px-4 py-1'>Testimonials</div>
          </div>
          <h2 className='text-center text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl lg:font-extrabold'>
            What our users say
          </h2>
          <p className='text-muted-foreground text-center text-sm'>
            See what our customers have to say about us.
          </p>
        </div>

        <div className='mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]'>
          <TestimonialsColumn duration={16} testimonials={firstColumn} />
          <TestimonialsColumn
            className='hidden md:block'
            duration={20}
            testimonials={secondColumn}
          />
          <TestimonialsColumn
            className='hidden lg:block'
            duration={18}
            testimonials={thirdColumn}
          />
        </div>
      </div>
    </section>
  );
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => (
  <div className={props.className}>
    <motion.div
      animate={{
        translateY: '-50%',
      }}
      className='flex flex-col gap-6 pb-6'
      transition={{
        duration: props.duration || 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: 'linear',
        repeatType: 'loop',
      }}
    >
      {[
        ...new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={`column-${index}`}>
            {props.testimonials.map(({ text, image, name, role }) => (
              <div
                className='bg-card dark:bg-card/20 dark:shadow-foreground/10 w-full max-w-xs rounded-3xl border p-8 shadow-lg'
                key={name}
              >
                <div>{text}</div>
                <div className='mt-5 flex items-center gap-2'>
                  <Image
                    alt={name}
                    className='h-10 w-10 rounded-full'
                    height={40}
                    src={image}
                    width={40}
                  />
                  <div className='flex flex-col'>
                    <div className='leading-5 font-medium tracking-tight'>{name}</div>
                    <div className='leading-5 tracking-tight opacity-60'>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        )),
      ]}
    </motion.div>
  </div>
);
