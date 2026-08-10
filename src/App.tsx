import React, { useState, useMemo, useEffect } from 'react';
import { allQuestions } from './questions';
import { allFRQs } from './frqs';
import type { Question } from './questions';
import type { FRQQuestion } from './frqs';

const UNIT_NAMES: Record<number, string> = {
  1: "🌿 Unit 1: The Living World - Ecosystems",
  2: "🦊 Unit 2: The Living World - Biodiversity",
  3: "👥 Unit 3: Populations",
  4: "🌍 Unit 4: Earth Systems and Resources",
  5: "🌾 Unit 5: Land and Water Use",
  6: "⚡ Unit 6: Energy Resources and Consumption",
  7: "🌫️ Unit 7: Atmospheric Pollution",
  8: "🧪 Unit 8: Aquatic and Terrestrial Pollution",
  9: "🌡️ Unit 9: Global Change"
};

const QUIZ_LENGTH = 15;
const LOCAL_STORAGE_KEY = 'apes_mastery_tracker_v1';

interface UnitProgress {
  attempts: number;
  bestScorePct: number;
  lastTheta: number;
  masteryPct: number;
  frqCompleted?: number;
}

interface ShuffledQuestion extends Question {
  shuffledOptions: string[];
  shuffledCorrectIdx: number;
}

function prepareShuffledQuestion(q: Question): ShuffledQuestion {
  const optionsWithIndex = q.options.map((opt, idx) => ({
    text: opt,
    isOriginalCorrect: idx === q.correct_idx,
  }));

  for (let i = optionsWithIndex.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
  }

  const shuffledOptions = optionsWithIndex.map(o => o.text);
  const shuffledCorrectIdx = optionsWithIndex.findIndex(o => o.isOriginalCorrect);

  return {
    ...q,
    shuffledOptions,
    shuffledCorrectIdx,
  };
}

function calculateProbability(theta: number, a: number, b: number): number {
  return 1 / (1 + Math.exp(-a * (theta - b)));
}

function estimateAPScore(theta: number): number {
  if (theta >= 1.2) return 5;
  if (theta >= 0.4) return 4;
  if (theta >= -0.3) return 3;
  if (theta >= -1.0) return 2;
  return 1;
}

function thetaToMasteryPct(theta: number, scorePct: number): number {
  const thetaScaled = Math.min(Math.max(((theta + 2) / 4) * 100, 0), 100);
  return Math.round(thetaScaled * 0.6 + scorePct * 0.4);
}

// Helper to extract numeric values for topic sorting (e.g. "1.2" -> 1.002, "1.10" -> 1.010)
function getTopicSortValue(topicStr: string): number {
  const match = topicStr.match(/(\d+)\.(\d+)/);
  if (match) {
    const unit = parseInt(match[1], 10);
    const topic = parseInt(match[2], 10);
    return unit * 1000 + topic;
  }
  return 0;
}

export default function App() {
  const [appMode, setAppMode] = useState<'mcq' | 'frq'>('mcq');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Persistence State
  const [unitProgressData, setUnitProgressData] = useState<Record<number, UnitProgress>>({});

  // FRQ Practice State
  const [selectedFrq, setSelectedFrq] = useState<FRQQuestion | null>(null);
  const [studentFrqAnswers, setStudentFrqAnswers] = useState<Record<string, string>>({});
  const [showFrqRubric, setShowFrqRubric] = useState<boolean>(false);
  const [selfEarnedPoints, setSelfEarnedPoints] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setUnitProgressData(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Could not load progress from localStorage", err);
    }
  }, []);

  const saveUnitProgress = (unitNum: number, finalScorePct: number, finalTheta: number) => {
    const existing = unitProgressData[unitNum] || { attempts: 0, bestScorePct: 0, lastTheta: 0, masteryPct: 0, frqCompleted: 0 };
    const calculatedMastery = thetaToMasteryPct(finalTheta, finalScorePct);

    const updatedUnit: UnitProgress = {
      ...existing,
      attempts: existing.attempts + 1,
      bestScorePct: Math.max(existing.bestScorePct, finalScorePct),
      lastTheta: finalTheta,
      masteryPct: Math.max(existing.masteryPct, calculatedMastery),
    };

    const newProgressData = { ...unitProgressData, [unitNum]: updatedUnit };
    setUnitProgressData(newProgressData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgressData));
    } catch (err) {
      console.error("Could not save progress to localStorage", err);
    }
  };

  const saveFrqCompletion = (unitNum: number) => {
    const existing = unitProgressData[unitNum] || { attempts: 0, bestScorePct: 0, lastTheta: 0, masteryPct: 0, frqCompleted: 0 };
    const updatedUnit: UnitProgress = {
      ...existing,
      frqCompleted: (existing.frqCompleted || 0) + 1,
    };
    const newProgressData = { ...unitProgressData, [unitNum]: updatedUnit };
    setUnitProgressData(newProgressData);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgressData));
    } catch (err) {
      console.error("Could not save FRQ progress", err);
    }
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset all unit progress data?")) {
      setUnitProgressData({});
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // MCQ Quiz Session State
  const [sessionQuestions, setSessionQuestions] = useState<ShuffledQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  
  // IRT Tracking
  const [theta, setTheta] = useState<number>(0.0);
  const [availablePool, setAvailablePool] = useState<Question[]>([]);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

  const unitQuestions = useMemo(() => {
    return allQuestions.filter(q => q.unit === selectedUnit);
  }, [selectedUnit]);

  const unitFrqs = useMemo(() => {
    return allFRQs.filter(f => f.unit === selectedUnit);
  }, [selectedUnit]);

  const targetQuizSize = Math.min(QUIZ_LENGTH, unitQuestions.length);
  const currentQuestion = sessionQuestions[currentStep];

  const pickNextQuestion = (
    pool: Question[],
    counts: Record<string, number>,
    currentTheta: number
  ) => {
    if (pool.length === 0) return null;

    let minTopicCount = Infinity;
    pool.forEach(q => {
      const count = counts[q.topic] || 0;
      if (count < minTopicCount) minTopicCount = count;
    });

    const candidates = pool.filter(q => (counts[q.topic] || 0) === minTopicCount);

    let bestQ = candidates[0];
    let minDiff = Math.abs(bestQ.difficulty_b - currentTheta);

    for (let i = 1; i < candidates.length; i++) {
      const diff = Math.abs(candidates[i].difficulty_b - currentTheta);
      if (diff < minDiff) {
        minDiff = diff;
        bestQ = candidates[i];
      }
    }

    const updatedPool = pool.filter(q => q.id !== bestQ.id);
    const updatedCounts = { ...counts, [bestQ.topic]: (counts[bestQ.topic] || 0) + 1 };

    return { nextQ: bestQ, updatedPool, updatedCounts };
  };

  const handleStartQuiz = () => {
    if (unitQuestions.length === 0) return;

    const pool = [...unitQuestions];
    const initialCounts: Record<string, number> = {};
    const initialTheta = 0.0;

    const selection = pickNextQuestion(pool, initialCounts, initialTheta);
    if (!selection) return;

    const firstShuffledQ = prepareShuffledQuestion(selection.nextQ);

    setAvailablePool(selection.updatedPool);
    setTopicCounts(selection.updatedCounts);
    setSessionQuestions([firstShuffledQ]);
    setTheta(initialTheta);
    setCurrentStep(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizStarted(true);
    setQuizCompleted(false);
  };

  const handleStartFrq = (frq: FRQQuestion) => {
    setSelectedFrq(frq);
    setStudentFrqAnswers({});
    setShowFrqRubric(false);
    setSelfEarnedPoints({});
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.shuffledCorrectIdx;
    setIsAnswerSubmitted(true);
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOption }));

    const prob = calculateProbability(theta, currentQuestion.discrimination_a, currentQuestion.difficulty_b);
    const actualScore = isCorrect ? 1 : 0;
    const newTheta = theta + 0.5 * (actualScore - prob);
    setTheta(newTheta);
  };

  const scoreStats = useMemo(() => {
    let totalCorrect = 0;
    const topicBreakdown: Record<string, { correct: number; total: number }> = {};

    sessionQuestions.forEach(q => {
      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[q.topic].total += 1;

      if (userAnswers[q.id] === q.shuffledCorrectIdx) {
        totalCorrect += 1;
        topicBreakdown[q.topic].correct += 1;
      }
    });

    return { totalCorrect, totalQuestions: sessionQuestions.length, topicBreakdown };
  }, [sessionQuestions, userAnswers]);

  const handleNextQuestion = () => {
    if (currentStep < targetQuizSize - 1) {
      const nextStep = currentStep + 1;

      if (nextStep >= sessionQuestions.length) {
        const selection = pickNextQuestion(availablePool, topicCounts, theta);
        if (selection) {
          const nextShuffledQ = prepareShuffledQuestion(selection.nextQ);
          setAvailablePool(selection.updatedPool);
          setTopicCounts(selection.updatedCounts);
          setSessionQuestions(prev => [...prev, nextShuffledQ]);
        }
      }

      setCurrentStep(nextStep);
      const nextQ = sessionQuestions[nextStep];
      const prevAnswer = nextQ ? userAnswers[nextQ.id] : undefined;
      setSelectedOption(prevAnswer !== undefined ? prevAnswer : null);
      setIsAnswerSubmitted(prevAnswer !== undefined);
    } else {
      const finalScorePct = Math.round((scoreStats.totalCorrect / scoreStats.totalQuestions) * 100);
      saveUnitProgress(selectedUnit, finalScorePct, theta);
      setQuizCompleted(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      const prevQ = sessionQuestions[prevStep];
      const prevAnswer = userAnswers[prevQ.id];
      setSelectedOption(prevAnswer !== undefined ? prevAnswer : null);
      setIsAnswerSubmitted(prevAnswer !== undefined);
    }
  };

  const totalPossibleFrqPoints = useMemo(() => {
    if (!selectedFrq) return 0;
    return selectedFrq.parts.reduce((sum, part) => sum + part.points, 0);
  }, [selectedFrq]);

  const totalEarnedFrqPoints = useMemo(() => {
    return Object.values(selfEarnedPoints).reduce((sum, pts) => sum + pts, 0);
  }, [selfEarnedPoints]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>AP Environmental Science Review Engine</h1>
        <p style={styles.subtitle}>Adaptive Multiple-Choice & FRQ Diagnostics</p>

        {/* Global Mode Switcher */}
        <div style={styles.tabBar}>
          <button
            onClick={() => { setAppMode('mcq'); setSelectedFrq(null); setQuizStarted(false); }}
            style={appMode === 'mcq' ? styles.tabActive : styles.tabInactive}
          >
            📊 Adaptive MCQ Practice
          </button>
          <button
            onClick={() => { setAppMode('frq'); setQuizStarted(false); }}
            style={appMode === 'frq' ? styles.tabActive : styles.tabInactive}
          >
            ✍️ FRQ Self-Assessment
          </button>
        </div>
      </header>

      {/* Mode 1: Multiple Choice Mode */}
      {appMode === 'mcq' && (
        !quizStarted ? (
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Select Practice Unit</h2>
              {Object.keys(unitProgressData).length > 0 && (
                <button onClick={handleResetProgress} style={styles.resetBtn}>
                  Reset Progress
                </button>
              )}
            </div>
            
            <div style={styles.unitList}>
              {Object.entries(UNIT_NAMES).map(([uNum, uName]) => {
                const unitNum = Number(uNum);
                const isSelected = selectedUnit === unitNum;
                const progress = unitProgressData[unitNum];
                const mastery = progress ? progress.masteryPct : 0;

                return (
                  <button
                    key={uNum}
                    onClick={() => setSelectedUnit(unitNum)}
                    style={isSelected ? styles.unitBtnActive : styles.unitBtn}
                  >
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: progress ? '6px' : '0' }}>
                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{uName}</span>
                        {progress && (
                          <span style={isSelected ? styles.masteryTextActive : styles.masteryTextInactive}>
                            {mastery}% Mastery
                          </span>
                        )}
                      </div>
                      {progress && (
                        <div style={styles.miniProgressTrack}>
                          <div
                            style={{
                              ...styles.miniProgressBar,
                              width: `${mastery}%`,
                              backgroundColor: isSelected ? '#ffffff' : '#0284c7'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={styles.infoBox}>
              <strong style={{ display: 'block', marginBottom: '6px', fontSize: '1rem' }}>
                Adaptive Quiz Rules:
              </strong>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>
                • 15 Questions that adapt in real-time to your performance level.<br />
                • Topics are evenly sampled across Unit {selectedUnit}.<br />
                • Mastery progress is saved automatically.
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={unitQuestions.length === 0}
              style={unitQuestions.length > 0 ? styles.primaryBtn : styles.disabledBtn}
            >
              Start Unit {selectedUnit} MCQ Quiz ({unitQuestions.length} Questions)
            </button>
          </div>
        ) : !quizCompleted ? (
          /* Active MCQ Quiz View */
          currentQuestion ? (
            <div style={styles.card}>
              <div style={styles.metaRow}>
                <span style={styles.badge}>Unit {currentQuestion.unit}</span>
                <span style={styles.topicTag}>{currentQuestion.topic}</span>
              </div>

              <div style={styles.progressContainer}>
                <div
                  style={{
                    ...styles.progressBar,
                    width: `${((currentStep + 1) / targetQuizSize) * 100}%`
                  }}
                />
              </div>
              <div style={styles.progressText}>
                Question {currentStep + 1} of {targetQuizSize}
              </div>

              <h2 style={styles.prompt}>{currentQuestion.prompt}</h2>

              {/* Black Option Boxes */}
              <div style={styles.optionsList}>
                {currentQuestion.shuffledOptions.map((optionText, idx) => {
                  let btnStyle = { ...styles.optionBtn };
                  if (selectedOption === idx) {
                    btnStyle = { ...btnStyle, ...styles.optionSelected };
                  }
                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.shuffledCorrectIdx) {
                      btnStyle = { ...btnStyle, ...styles.optionCorrect };
                    } else if (selectedOption === idx) {
                      btnStyle = { ...btnStyle, ...styles.optionIncorrect };
                    }
                  }

                  let badgeBg = '#000000';
                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.shuffledCorrectIdx) {
                      badgeBg = '#16a34a';
                    } else if (selectedOption === idx) {
                      badgeBg = '#dc2626';
                    } else {
                      badgeBg = '#94a3b8';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      style={btnStyle}
                      disabled={isAnswerSubmitted}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: badgeBg,
                          color: '#ffffff',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          marginRight: '12px',
                          flexShrink: 0,
                        }}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1, marginTop: '2px' }}>{optionText}</span>
                    </button>
                  );
                })}
              </div>

              <div style={styles.actionRow}>
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentStep === 0}
                  style={currentStep === 0 ? styles.disabledNavBtn : styles.navBtn}
                >
                  Previous
                </button>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    style={selectedOption !== null ? styles.submitBtn : styles.disabledBtn}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button onClick={handleNextQuestion} style={styles.submitBtn}>
                    {currentStep === targetQuizSize - 1 ? "View Diagnostic Results" : "Next Question"}
                  </button>
                )}
              </div>

              {isAnswerSubmitted && (
                <div
                  style={{
                    ...styles.explanationBox,
                    borderLeftColor: selectedOption === currentQuestion.shuffledCorrectIdx ? '#16a34a' : '#dc2626'
                  }}
                >
                  <h4
                    style={{
                      ...styles.explanationTitle,
                      color: selectedOption === currentQuestion.shuffledCorrectIdx ? '#15803d' : '#b91c1c'
                    }}
                  >
                    {selectedOption === currentQuestion.shuffledCorrectIdx ? "Correct!" : "Incorrect"}
                  </h4>
                  <p style={styles.explanationBody}>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          ) : null
        ) : (
          /* MCQ Results View */
          <div style={styles.card}>
            <h2 style={styles.prompt}>Unit {selectedUnit} Practice Complete!</h2>
            
            <div style={styles.scoreBox}>
              <p style={styles.scoreText}>
                Score: <strong>{scoreStats.totalCorrect}</strong> / {scoreStats.totalQuestions} (
                {((scoreStats.totalCorrect / scoreStats.totalQuestions) * 100).toFixed(0)}%)
              </p>
              <p style={styles.apScoreText}>
                Estimated AP Exam Score: <strong>{estimateAPScore(theta)}</strong> / 5
              </p>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#0369a1' }}>
                ✓ Progress saved automatically
              </p>
            </div>

            <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Topic Mastery Breakdown</h3>
            <div style={styles.breakdownListVertical}>
              {Object.entries(scoreStats.topicBreakdown)
                .sort(([topicA], [topicB]) => {
                  const valA = getTopicSortValue(topicA);
                  const valB = getTopicSortValue(topicB);
                  if (valA !== 0 && valB !== 0) return valA - valB;
                  return topicA.localeCompare(topicB, undefined, { numeric: true, sensitivity: 'base' });
                })
                .map(([tName, data]) => {
                  const pct = Math.round((data.correct / data.total) * 100);
                  return (
                    <div key={tName} style={styles.topicRowCard}>
                      <div style={{ flex: 1, paddingRight: '12px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#1f2937' }}>{tName}</strong>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span
                          style={{
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            color: pct >= 70 ? '#15803d' : pct >= 50 ? '#d97706' : '#b91c1c'
                          }}
                        >
                          {pct}%
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280', marginLeft: '8px' }}>
                          ({data.correct}/{data.total} Correct)
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <button onClick={() => setQuizStarted(false)} style={styles.primaryBtn}>
              Select Another Unit
            </button>
          </div>
        )
      )}

      {/* Mode 2: FRQ Practice Mode */}
      {appMode === 'frq' && (
        !selectedFrq ? (
          <div style={styles.card}>
            <h2 style={{ marginTop: 0, fontSize: '1.25rem', marginBottom: '16px' }}>Select Unit for FRQ Practice</h2>
            
            <div style={styles.unitList}>
              {Object.entries(UNIT_NAMES).map(([uNum, uName]) => {
                const unitNum = Number(uNum);
                const isSelected = selectedUnit === unitNum;
                const frqCount = allFRQs.filter(f => f.unit === unitNum).length;

                return (
                  <button
                    key={uNum}
                    onClick={() => setSelectedUnit(unitNum)}
                    style={isSelected ? styles.unitBtnActive : styles.unitBtn}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{uName}</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                        {frqCount} FRQ{frqCount !== 1 ? 's' : ''} Available
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Available Prompts for Unit {selectedUnit}</h3>
            {unitFrqs.length === 0 ? (
              <div style={styles.infoBox}>
                No sample FRQs currently loaded for Unit {selectedUnit}. Select Unit 1 or Unit 4 to try a prompt!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {unitFrqs.map(frq => (
                  <div key={frq.id} style={styles.frqCardItem}>
                    <div>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', color: '#0369a1' }}>{frq.title}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.4' }}>
                        {frq.scenario}
                      </p>
                    </div>
                    <button
                      onClick={() => handleStartFrq(frq)}
                      style={styles.frqStartBtn}
                    >
                      Practice FRQ →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Active FRQ Prompt & Rubric Workspace */
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={styles.badge}>Unit {selectedFrq.unit} Free Response</span>
              <button
                onClick={() => setSelectedFrq(null)}
                style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', fontWeight: '600' }}
              >
                ← Back to FRQ List
              </button>
            </div>

            <h2 style={{ fontSize: '1.3rem', margin: '0 0 12px 0', color: '#111827' }}>{selectedFrq.title}</h2>
            
            {/* Scenario Callout */}
            <blockquote style={styles.scenarioBlock}>
              <strong>Exam Scenario:</strong> {selectedFrq.scenario}
            </blockquote>

            {/* Questions Workspace */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              {selectedFrq.parts.map((part) => {
                const studentText = studentFrqAnswers[part.id] || '';

                return (
                  <div key={part.id} style={styles.frqPartBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ color: '#0284c7', fontSize: '1rem' }}>{part.label}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: '600' }}>
                        [{part.points} Point{part.points > 1 ? 's' : ''}]
                      </span>
                    </div>

                    <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#1f2937', lineHeight: '1.5' }}>
                      {part.prompt}
                    </p>

                    {/* Student Response Area */}
                    <textarea
                      value={studentText}
                      onChange={(e) => setStudentFrqAnswers({ ...studentFrqAnswers, [part.id]: e.target.value })}
                      placeholder="Type your structured FRQ draft response here..."
                      rows={4}
                      style={styles.frqTextarea}
                    />

                    {/* Revealed Scoring Rubric Section */}
                    {showFrqRubric && (
                      <div style={styles.rubricBox}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#15803d', fontSize: '0.95rem' }}>
                          ✓ College Board Scoring Criteria:
                        </h4>
                        <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px', fontSize: '0.9rem', color: '#166534' }}>
                          {part.rubricCriteria.map((crit, cIdx) => (
                            <li key={cIdx} style={{ marginBottom: '4px' }}>{crit}</li>
                          ))}
                        </ul>

                        <strong style={{ display: 'block', fontSize: '0.9rem', color: '#334155', marginBottom: '4px' }}>
                          Sample Benchmark Response:
                        </strong>
                        <div style={styles.sampleAnswerText}>"{part.sampleAnswer}"</div>

                        {/* Self Evaluation Selector */}
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Self-Graded Score:</span>
                          {Array.from({ length: part.points + 1 }).map((_, pt) => (
                            <button
                              key={pt}
                              onClick={() => setSelfEarnedPoints({ ...selfEarnedPoints, [part.id]: pt })}
                              style={(selfEarnedPoints[part.id] ?? 0) === pt ? styles.pointBtnActive : styles.pointBtn}
                            >
                              {pt} / {part.points} pts
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Rubric Reveal Toggle */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {!showFrqRubric ? (
                <button
                  onClick={() => setShowFrqRubric(true)}
                  style={styles.primaryBtn}
                >
                  Reveal College Board Rubric & Self-Grade Response
                </button>
              ) : (
                <div style={{ width: '100%' }}>
                  <div style={styles.scoreSummaryBox}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0369a1' }}>
                      FRQ Self-Assessment Score: {totalEarnedFrqPoints} / {totalPossibleFrqPoints} Points
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      saveFrqCompletion(selectedFrq.unit);
                      setSelectedFrq(null);
                    }}
                    style={{ ...styles.primaryBtn, marginTop: '12px' }}
                  >
                    Complete FRQ & Save Results
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '850px',
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: '#1f2937',
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '2.1rem',
    fontWeight: '800',
    margin: 0,
    color: '#111827',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '6px',
    fontSize: '1rem',
  },
  tabBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
  },
  tabActive: {
    padding: '8px 18px',
    borderRadius: '20px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
  },
  tabInactive: {
    padding: '8px 18px',
    borderRadius: '20px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  unitList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  unitBtn: {
    display: 'flex',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    transition: 'all 0.15s ease',
  },
  unitBtnActive: {
    display: 'flex',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #0284c7',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
    boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
  },
  masteryTextInactive: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#0284c7',
  },
  masteryTextActive: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  miniProgressTrack: {
    height: '4px',
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '4px',
  },
  miniProgressBar: {
    height: '100%',
    transition: 'width 0.3s ease',
  },
  resetBtn: {
    fontSize: '0.8rem',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '16px',
    borderRadius: '8px',
    color: '#0369a1',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
  },
  metaRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '14px',
  },
  badge: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  topicTag: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '500',
  },
  progressContainer: {
    height: '6px',
    backgroundColor: '#e5e7eb',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '10px',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0284c7',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'right',
    fontSize: '0.8rem',
    color: '#6b7280',
    marginTop: '4px',
  },
  prompt: {
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#111827',
    margin: '16px 0 20px 0',
    lineHeight: '1.5',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
    padding: '14px 16px',
    borderRadius: '8px',
    border: '2px solid #000000',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontSize: '0.95rem',
    fontWeight: '500',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  optionSelected: {
    border: '2px solid #000000',
    backgroundColor: '#f1f5f9',
  },
  optionCorrect: {
    border: '2px solid #16a34a',
    backgroundColor: '#f0fdf4',
    color: '#14532d',
  },
  optionIncorrect: {
    border: '2px solid #dc2626',
    backgroundColor: '#fef2f2',
    color: '#7f1d1d',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  },
  navBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: '600',
  },
  disabledNavBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    color: '#9ca3af',
    cursor: 'not-allowed',
    fontWeight: '600',
  },
  submitBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '700',
  },
  disabledBtn: {
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    cursor: 'not-allowed',
    fontWeight: '700',
    width: '100%',
  },
  primaryBtn: {
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    cursor: 'pointer',
    fontWeight: '700',
    width: '100%',
    fontSize: '0.95rem',
  },
  explanationBox: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #0284c7',
  },
  explanationTitle: {
    margin: '0 0 6px 0',
    fontSize: '0.95rem',
    fontWeight: '700',
  },
  explanationBody: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#334155',
    lineHeight: '1.5',
  },
  scoreBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
    margin: '16px 0',
  },
  scoreText: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#0369a1',
  },
  apScoreText: {
    margin: '8px 0 0 0',
    fontSize: '1.1rem',
    color: '#0c4a6e',
  },
  breakdownListVertical: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  topicRowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
  },
  frqCardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    gap: '16px',
  },
  frqStartBtn: {
    padding: '8px 14px',
    borderRadius: '6px',
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
    flexShrink: 0,
  },
  scenarioBlock: {
    margin: '12px 0',
    padding: '14px',
    backgroundColor: '#f8fafc',
    borderLeft: '4px solid #0284c7',
    borderRadius: '4px',
    fontSize: '0.95rem',
    color: '#334155',
    lineHeight: '1.5',
  },
  frqPartBox: {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa',
  },
  frqTextarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  rubricBox: {
    marginTop: '14px',
    paddingTop: '14px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f0fdf4',
    padding: '14px',
    borderRadius: '6px',
  },
  sampleAnswerText: {
    fontStyle: 'italic',
    fontSize: '0.88rem',
    color: '#1e293b',
    backgroundColor: '#ffffff',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    margin: '4px 0 10px 0',
  },
  pointBtn: {
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  pointBtnActive: {
    padding: '4px 10px',
    borderRadius: '4px',
    border: '1px solid #15803d',
    backgroundColor: '#15803d',
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '700',
  },
  scoreSummaryBox: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center',
  },
};