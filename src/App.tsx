import { useState, useMemo } from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  BookOpen, 
  BarChart3, 
  Sparkles
} from 'lucide-react'
import unit1Data from './questions/unit1.json'

// Question Interface
interface Question {
  id: string | number
  unit: number
  topic: string
  prompt: string
  options: string[]
  correct_idx: number
  explanation: string
  difficulty_b?: number
}

export default function App() {
  // Defensive Question Loader & Normalizer
  const allQuestions: Question[] = useMemo(() => {
    // Safely extract the questions array regardless of root object wrapping
    const rawList: any[] = Array.isArray(unit1Data)
      ? unit1Data
      : (unit1Data as any)?.questions && Array.isArray((unit1Data as any).questions)
      ? (unit1Data as any).questions
      : []

    return rawList.map((q, idx) => ({
      id: q.id ?? `q-${idx}`,
      unit: q.unit ?? 1,
      topic: q.topic ?? '1.1 Ecosystem Interactions',
      prompt: q.prompt ?? q.question ?? 'Question prompt missing',
      options: Array.isArray(q.options) ? q.options : [],
      correct_idx: q.correct_idx ?? q.correctIndex ?? 0,
      explanation: q.explanation ?? 'No explanation provided.',
      difficulty_b: q.difficulty_b ?? q.difficulty
    }))
  }, [])

  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 })

  const filteredQuestions = useMemo(() => {
    if (selectedUnit === 'all') return allQuestions
    return allQuestions.filter((q) => q.unit === selectedUnit)
  }, [selectedUnit, allQuestions])

  const currentQuestion: Question | undefined = filteredQuestions[currentIndex]

  const handleUnitChange = (unit: number | 'all') => {
    setSelectedUnit(unit)
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
  }

  const handleSelectOption = (index: number) => {
    if (isAnswered || !currentQuestion) return
    setSelectedOption(index)
    setIsAnswered(true)

    const isCorrect = index === currentQuestion.correct_idx
    setScore((prev) => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
      streak: isCorrect ? prev.streak + 1 : 0,
    }))
  }

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsAnswered(false)
    setScore({ correct: 0, total: 0, streak: 0 })
  }

  const getDifficultyBadge = (b?: number) => {
    if (b === undefined) return null
    if (b < -0.2) return { label: 'Easy', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    if (b <= 0.4) return { label: 'Medium', color: 'bg-amber-100 text-amber-800 border-amber-300' }
    return { label: 'Hard (AP Level)', color: 'bg-rose-100 text-rose-800 border-rose-300' }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Header Bar */}
      <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-300" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">APES Adaptive Review</h1>
              <p className="text-xs text-emerald-200">AP Environmental Science Practice</p>
            </div>
          </div>

          {/* Real-time Stats */}
          <div className="flex items-center gap-6 bg-emerald-900/60 px-4 py-2 rounded-lg text-sm font-medium border border-emerald-700/50">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-300" />
              <span>Score: {score.correct}/{score.total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Streak: {score.streak}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-300" />
              <span>
                {score.total > 0 ? `${Math.round((score.correct / score.total) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-6">
        {/* Unit Selector Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Filter by Unit:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', name: 'All Units' },
              { id: 1, name: 'U1: Ecosystems' },
              { id: 2, name: 'U2: Biodiversity' },
              { id: 3, name: 'U3: Populations' },
              { id: 4, name: 'U4: Earth Systems' },
              { id: 5, name: 'U5: Land/Water' },
              { id: 6, name: 'U6: Energy' },
              { id: 7, name: 'U7: Air Pollution' },
              { id: 8, name: 'U8: Aquatic/Terrestrial' },
              { id: 9, name: 'U9: Global Change' },
            ].map((unit) => (
              <button
                key={unit.id}
                onClick={() => handleUnitChange(unit.id as number | 'all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                  selectedUnit === unit.id
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {unit.name}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Question Header */}
            <div className="bg-slate-100/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                  Unit {currentQuestion.unit}
                </span>
                <span className="text-xs font-medium text-slate-600">
                  {currentQuestion.topic}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {getDifficultyBadge(currentQuestion.difficulty_b) && (
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                      getDifficultyBadge(currentQuestion.difficulty_b)?.color
                    }`}
                  >
                    {getDifficultyBadge(currentQuestion.difficulty_b)?.label}
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  Q {currentIndex + 1} of {filteredQuestions.length}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Question Text */}
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 leading-relaxed mb-6">
                {currentQuestion.prompt}
              </h2>

              {/* Multiple Choice Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((optionText, idx) => {
                  let optionStyle =
                    'border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-800'

                  if (isAnswered) {
                    if (idx === currentQuestion.correct_idx) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium ring-2 ring-emerald-500/20'
                    } else if (idx === selectedOption) {
                      optionStyle =
                        'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                          isAnswered && idx === currentQuestion.correct_idx
                            ? 'bg-emerald-600 text-white'
                            : isAnswered && idx === selectedOption
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="flex-1 text-sm md:text-base">{optionText}</span>

                      {isAnswered && idx === currentQuestion.correct_idx && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQuestion.correct_idx && (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-5 rounded-xl border mb-6 transition-all ${
                    selectedOption === currentQuestion.correct_idx
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-slate-100 border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    {selectedOption === currentQuestion.correct_idx ? (
                      <span className="text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                      </span>
                    ) : (
                      <span className="text-rose-700 flex items-center gap-1.5">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Explanation: </strong>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
                </button>

                {isAnswered && (
                  <button
                    onClick={handleNext}
                    disabled={currentIndex >= filteredQuestions.length - 1}
                    className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {currentIndex < filteredQuestions.length - 1 ? (
                      <>
                        Next Question <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Unit Completed!'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-slate-200">
            <p className="text-slate-600 mb-4 font-medium">
              No questions found for the selected unit filter.
            </p>
            <button
              onClick={() => handleUnitChange('all')}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-800 transition"
            >
              Show All Units
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
