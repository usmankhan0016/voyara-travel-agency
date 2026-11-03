interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 sm:mb-12 md:flex-row md:items-end">
      <div>
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-brand-orange">
          {eyebrow}
        </span>
        <h2 className="max-w-xl text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          {title}
        </h2>
      </div>
      <p className="max-w-md text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p>
    </div>
  );
}
