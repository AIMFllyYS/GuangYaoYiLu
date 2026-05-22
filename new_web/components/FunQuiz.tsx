"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { quizQuestions } from "@/lib/content";

const scoreKey = "guangyao-quiz-best";

export function FunQuiz() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(Number(localStorage.getItem(scoreKey) || "0"));
  }, []);

  const question = quizQuestions[index];
  const answered = selected !== null;
  const isCorrect = selected === question.answer;

  function choose(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    if (optionIndex === question.answer) setScore((value) => value + 1);
  }

  function next() {
    const nextIndex = index + 1;
    const nextScore = score + (isCorrect ? 0 : 0);
    if (nextIndex >= quizQuestions.length) {
      const finalScore = Math.max(nextScore, score);
      if (finalScore > best) {
        setBest(finalScore);
        localStorage.setItem(scoreKey, String(finalScore));
      }
      setIndex(0);
      setSelected(null);
      setScore(0);
      return;
    }
    setIndex(nextIndex);
    setSelected(null);
  }

  function reset() {
    setIndex(0);
    setSelected(null);
    setScore(0);
  }

  return (
    <div className="quiz-shell">
      <div className="quiz-top">
        <div>
          <p className="eyebrow">Mini quiz</p>
          <h3>中药趣味问答互动小游戏</h3>
        </div>
        <div className="score-pill">
          {score}/{quizQuestions.length}
          <small>最佳 {best}</small>
        </div>
      </div>

      <div className="quiz-progress" aria-label="答题进度">
        {quizQuestions.map((item, itemIndex) => (
          <span key={item.question} className={itemIndex <= index ? "active" : ""} />
        ))}
      </div>

      <h4>{question.question}</h4>
      <div className="quiz-options">
        {question.options.map((option, optionIndex) => {
          const state =
            answered && optionIndex === question.answer ? "right" : answered && optionIndex === selected ? "wrong" : "";
          return (
            <button key={option} className={state} onClick={() => choose(optionIndex)}>
              <span>{option}</span>
              {state === "right" && <CheckCircle2 aria-hidden="true" />}
              {state === "wrong" && <XCircle aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={isCorrect ? "answer-box right" : "answer-box wrong"}>
          <strong>{isCorrect ? "答对了" : "再想一步"}</strong>
          <p>{question.explain}</p>
        </div>
      )}

      <div className="quiz-actions">
        <button onClick={reset}>
          <RotateCcw aria-hidden="true" />
          重来
        </button>
        <button className="primary-action" onClick={next} disabled={!answered}>
          {index + 1 >= quizQuestions.length ? "完成并记录" : "下一题"}
        </button>
      </div>
    </div>
  );
}
