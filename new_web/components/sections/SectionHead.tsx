import { cn } from "@/lib/utils";

type SectionHeadProps = {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
  className?: string;
};

export function SectionHead({ eyebrow, title, description, compact, className }: SectionHeadProps) {
  return (
    <div className={cn("relative max-w-3xl", compact ? "mb-8" : "mb-12", className)}>
      {/* 顶部微标线：带有精致的金色圆点和学术装饰横线 */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary sm:text-xs">
          {eyebrow}
        </span>
        <span className="h-px flex-1 max-w-[40px] bg-[#b98f46]/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#b98f46]" />
      </div>

      {/* 标题：中式典雅的衬线大字 */}
      <h2 className="mt-4 font-serif text-[1.75rem] font-black leading-tight tracking-tight text-foreground md:text-[2.25rem] text-balance text-pretty">
        {title}
      </h2>

      {/* 描述：字重与行高优化 */}
      {description && (
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
