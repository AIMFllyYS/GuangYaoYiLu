"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, RotateCcw, XCircle, Award, Sparkles } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { quizQuestions } from "@/lib/content";

const scoreKey = "guangyao-quiz-best";

export function FunQuiz() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [flash, setFlash] = useState<"right" | "wrong" | null>(null);

  const updateQuizUrlParams = (quizIdx: number) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("quizIndex", String(quizIdx));
    const newRelativePathQuery = window.location.pathname + "?" + params.toString() + window.location.hash;
    window.history.replaceState(null, "", newRelativePathQuery);
  };

  useEffect(() => {
    setBest(Number(localStorage.getItem(scoreKey) || "0"));
    
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const quizParam = params.get("quizIndex");
      if (quizParam) {
        const parsed = parseInt(quizParam, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < quizQuestions.length) {
          setIndex(parsed);
        }
      }
    }
  }, []);

  const question = quizQuestions[index];
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  function choose(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    const correct = optionIndex === question.answer;
    if (correct) setScore((value) => value + 1);
    setFlash(correct ? "right" : "wrong");
    window.setTimeout(() => setFlash(null), 220);
  }

  function next() {
    const nextIndex = index + 1;
    if (nextIndex >= quizQuestions.length) {
      const finalScore = score + (isCorrect ? 0 : 0);
      if (finalScore > best) {
        setBest(finalScore);
        localStorage.setItem(scoreKey, String(finalScore));
      }
      setIndex(0);
      setSelected(null);
      setScore(0);
      updateQuizUrlParams(0);
      return;
    }
    setIndex(nextIndex);
    setSelected(null);
    updateQuizUrlParams(nextIndex);
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    updateQuizUrlParams(0);
  }

  return (
    <Reveal>
      <Card
        className={cn(
          "relative overflow-hidden border border-primary/10 bg-white/45 backdrop-blur-md shadow-sm rounded-2xl p-6 transition-all duration-300 sm:p-8",
          flash === "right" && "bg-secondary/40 border-primary/30 shadow-[0_8px_30px_rgba(45,106,69,0.05)]",
          flash === "wrong" && "bg-destructive/5 border-destructive/20 shadow-[0_8px_30px_rgba(174,38,43,0.03)]"
        )}
      >
        {/* 朱印或顶角装饰 */}
        <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-[#b98f46]" />
        <div className="absolute top-0 right-0 h-2 w-2 border-t border-r border-[#b98f46]" />

        <CardHeader className="flex flex-col items-start justify-between gap-4 space-y-0 p-0 pb-6 border-b border-primary/5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#b98f46]">
              <Sparkles className="size-3.5" />
              <span>Imperial Examination / 岐黄科考</span>
            </div>
            <CardTitle className="mt-2 font-serif text-xl font-bold text-foreground">
              中药现代与传统趣味问答
            </CardTitle>
          </div>
          
          {/* 太医院徽章式积分牌 */}
          <div className="flex items-center gap-3 rounded-xl border border-[#b98f46]/35 bg-[#f6f1e2]/45 px-4 py-2 text-center shadow-inner">
            <Award className="size-5 text-[#b98f46] shrink-0" />
            <div className="text-left leading-none">
              <div className="text-base font-bold tabular-nums text-foreground">
                {score} / {quizQuestions.length}
              </div>
              <div className="text-[10px] text-muted-foreground/80 mt-1 font-semibold">
                最高得分 {best}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-0 pt-6">
          {/* 进度条指示器 */}
          <div className="flex gap-2" aria-label={`答题进度：第 ${index + 1} 题，共 ${quizQuestions.length} 题`}>
            {quizQuestions.map((item, itemIndex) => (
              <span
                key={item.question}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  itemIndex < index && "bg-primary/80",
                  itemIndex === index && "bg-[#b98f46] scale-y-[1.12]",
                  itemIndex > index && "bg-primary/5 border border-primary/5"
                )}
              />
            ))}
          </div>

          {/* 问题展示（国风大字） */}
          <div className="space-y-4">
            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-primary/70">
              QUESTION {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="font-serif text-base font-bold leading-relaxed text-foreground sm:text-lg text-pretty">
              {question.question}
            </h4>
          </div>

          {/* 选项列表（带 hover 与反馈态） */}
          <div className="grid gap-3">
            {question.options.map((option, optionIndex) => {
              const state =
                answered && optionIndex === question.answer
                  ? "right"
                  : answered && optionIndex === selected
                    ? "wrong"
                    : "";
              return (
                <motion.button
                  key={option}
                  type="button"
                  className={cn(
                    "flex min-h-[48px] items-center justify-between gap-4 rounded-xl border border-primary/10 bg-white/50 px-5 py-3.5 text-left text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99]",
                    state === "right" && "border-primary bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5",
                    state === "wrong" && "border-destructive/30 bg-destructive/5 text-destructive font-semibold"
                  )}
                  onClick={() => choose(optionIndex)}
                  whileTap={reduce ? undefined : { scale: 0.98 }}
                >
                  <span className="font-serif leading-normal">{option}</span>
                  {state === "right" && <CheckCircle2 className="size-4.5 text-primary shrink-0" aria-hidden="true" />}
                  {state === "wrong" && <XCircle className="size-4.5 text-destructive shrink-0" aria-hidden="true" />}
                </motion.button>
              );
            })}
          </div>

          {/* 传统“朱批”释义栏 */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "relative rounded-xl border p-5 shadow-inner backdrop-blur-md flex items-start gap-4",
                isCorrect 
                  ? "border-primary/20 bg-primary/[0.02]" 
                  : "border-destructive/20 bg-destructive/[0.01]"
              )}
            >
              {/* 国风虚线框 */}
              <div className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-primary/30" />
              <div className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-primary/30" />

              <div className="relative shrink-0 hidden sm:block">
                <Image
                  src="/images/mascot/yaoguang-assistant.png"
                  width={48}
                  height={48}
                  alt="瑶光点评"
                  className="size-12 object-contain drop-shadow-[0_4px_10px_rgba(45,106,69,0.15)]"
                />
              </div>

              <div className="space-y-1">
                <strong className={cn(
                  "font-serif text-sm font-bold block",
                  isCorrect ? "text-primary" : "text-destructive"
                )}>
                  {isCorrect ? "🌿 瑶光点评：妙哉！此答切中肯綮。" : "🌿 瑶光点评：差之毫厘，且看此解。"}
                </strong>
                <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground/90 sm:text-sm text-pretty">
                  {question.explain}
                </p>
              </div>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-3 border-t border-primary/5 pt-5">
            <Button variant="outline" onClick={reset} className="rounded-xl border-primary/10 bg-white/40 hover:bg-primary/5 text-xs h-10 font-semibold text-muted-foreground/80">
              <RotateCcw aria-hidden="true" className="size-3.5 mr-1" />
              重考
            </Button>
            <Button onClick={next} disabled={!answered} className="rounded-xl h-10 text-xs font-semibold px-5">
              {index + 1 >= quizQuestions.length ? "完成科考" : "下一题"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Reveal>
  );
}
