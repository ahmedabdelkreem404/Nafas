import React from 'react';
import { cx } from './cx';

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  container?: 'normal' | 'wide' | 'none';
  tight?: boolean;
};

export const Section: React.FC<SectionProps> = ({ container = 'normal', tight, className, children, ...props }) => {
  const content = <section className={cx('section', tight && 'section-tight', className)} {...props}>{children}</section>;
  if (container === 'none') return content;
  return React.cloneElement(content, {}, <div className={container === 'wide' ? 'container-wide' : 'container'}>{children}</div>);
};

export default Section;
