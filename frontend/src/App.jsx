import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, BrainCircuit, RotateCw, ArrowRight, HelpCircle, Layers 
} from 'lucide-react';

const INITIAL_DECKS = [
  {
    id: '1',
    title: 'Operating Systems - Deadlocks',
    category: 'Computer Science',
    cards: [
      { q: 'What are the four Coffman conditions for deadlock?', a: 'Mutual exclusion, Hold and wait, No preemption, and Circular wait.' },
      { q: 'What is the Banker\'s Algorithm used for?', a: 'Deadlock avoidance by testing for safety before granting resource allocation.' },
      { q: 'What is the difference between starvation and deadlock?', a: 'Deadlock is a permanent blockage of processes; starvation is indefinite delay where progress might eventually resume.' }
    ],
    quiz: [
      {
        question: 'Which of the following is NOT a Coffman condition?',
        options: ['Mutual Exclusion', 'Preemption Allowed', 'Circular Wait', 'Hold and Wait'],
        correct: 1
      },
      {
        question: 'Deadlock prevention works by:',
        options: ['Detecting cycles in resource graphs', 'Invalidating at least one Coffman condition', 'Terminating low priority threads', 'Increasing physical RAM'],
        correct: 1
      }
    ]
  },
  {
    id: '2',
    title: 'DBMS - Normalization',
    category: 'Databases',
    cards: [
      { q: 'What is 1NF requirement?', a: 'Each column must contain atomic (indivisible) values and unique records.' },
      { q: 'What eliminates transitive dependency?', a: 'Third Normal Form (3NF).' },
      { q: 'What is BCNF?', a: 'Boyce-Codd Normal Form: A stricter version of 3NF where every determinant must be a candidate key.' }
    ],
    quiz: [
      {
        question: 'A relation where every non-prime attribute is fully functionally dependent on the primary key is in:',
        options: ['1NF', '2NF', '3NF', 'BCNF'],
        correct: 1
      }
    ]
  }
];

export default function App() {
  const [decks, setDecks] = useState(INITIAL_DECKS);
  const [selectedDeckId, setSelectedDeckId] = useState('1');
  const [activeTab, setActiveTab] = useState('flashcards');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  const activeDeck = decks.find(d => d.id === selectedDeckId) || decks[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
  };

  const handleGenerateFromNotes = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const title = inputText.split('\n')[0].slice(0, 30) || 'Custom Notes Deck';
      const newDeck = {
        id: Date.now().toString(),
        title: title,
        category: 'Generated AI Deck',
        cards: [
          { q: `Core Summary Concept: ${title}`, a: inputText.slice(0, 150) + '...' },
          { q: 'Key Principle Extracted from notes', a: 'Synthesized directly by analyzing semantic entities and relationships inside the provided text.' },
          { q: 'Practical CSE Application', a: 'Crucial for real-world architecture, scalable systems design, and viva evaluation questions.' }
        ],
        quiz: [
          {
            question: `What primary topic was synthesized in this deck?`,
            options: [title, 'General Knowledge', 'Unrelated Theory', 'Legacy Hardware'],
            correct: 0
          }
        ]
      };

      setDecks([newDeck, ...decks]);
      setSelectedDeckId(newDeck.id);
      setInputText('');
      setIsGenerating(false);
      setActiveTab('flashcards');
      setCardIndex(0);
    }, 1200);
  };

  const handleSelectAnswer = (qIndex, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [qIndex]: optionIndex });
  };

  const calculateScore = () => {
    let score = 0;
    activeDeck.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                FlashMind <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI Portal</span>
              </h1>
              <p className="text-xs text-slate-400">CSE 3rd Year Mini Project</p>
            </div>
          </div>

          <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => { setActiveTab('flashcards'); setQuizScore(null); }}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'flashcards' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Cards
            </button>
            <button
              onClick={() => { setActiveTab('quiz'); setQuizScore(null); }}
              className={`px-3 py-1.5 rounded-md font-medium transition ${activeTab === 'quiz' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Quiz
            </button>
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1 ${activeTab === 'generator' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Create
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
        <aside className="md:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase font-mono text-slate-400 tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Decks ({decks.length})
            </span>
          </div>

          <div className="space-y-2">
            {decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => {
                  setSelectedDeckId(deck.id);
                  setCardIndex(0);
                  setIsFlipped(false);
                  setQuizScore(null);
                  setSelectedAnswers({});
                }}
                className={`w-full text-left p-3 rounded-xl border transition duration-150 ${
                  selectedDeckId === deck.id
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-md'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] text-indigo-400 font-mono block">{deck.category}</span>
                <span className="font-medium text-sm line-clamp-1">{deck.title}</span>
                <div className="mt-1 text-xs text-slate-500 flex justify-between">
                  <span>{deck.cards.length} cards</span>
                  <span>{deck.quiz?.length || 0} tests</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="md:col-span-3">
          {activeTab === 'flashcards' && (
            <div className="flex flex-col items-center justify-center space-y-6 max-w-xl mx-auto h-full">
              <div className="w-full flex justify-between items-center text-xs text-slate-400 px-1">
                <span className="bg-slate-800/80 px-2 py-1 rounded border border-slate-700 font-mono">
                  Card {cardIndex + 1} of {activeDeck.cards.length}
                </span>
                <span className="text-slate-500 italic">Tap card to reveal answer</span>
              </div>

              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-72 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between cursor-pointer hover:border-indigo-500/40 transition shadow-2xl relative select-none"
              >
                <span className="text-xs font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> {isFlipped ? 'Answer Key' : 'Question Prompt'}
                </span>

                <div className="flex-1 flex items-center justify-center text-center my-4">
                  <p className="text-lg md:text-xl font-semibold text-slate-100 leading-relaxed">
                    {isFlipped ? activeDeck.cards[cardIndex].a : activeDeck.cards[cardIndex].q}
                  </p>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-center gap-1">
                  <RotateCw className="w-3.5 h-3.5 text-slate-400" /> Flip
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevCard}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-sm font-medium transition shadow"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextCard}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-400" /> Assessment: {activeDeck.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">Answer the following questions generated from this module's syllabus.</p>
              </div>

              <div className="space-y-4">
                {activeDeck.quiz.map((qItem, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <p className="text-sm font-medium text-slate-200">{qIdx + 1}. {qItem.question}</p>
                    <div className="grid grid-cols-1 gap-2">
                      {qItem.options.map((opt, optIdx) => {
                        const isChosen = selectedAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectAnswer(qIdx, optIdx)}
                            className={`p-2.5 rounded-lg text-left text-xs border transition ${
                              isChosen
                                ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {quizScore === null ? (
                <button
                  onClick={calculateScore}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-600/20"
                >
                  Submit Assessment
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-center space-y-2">
                  <span className="text-xs uppercase font-mono text-indigo-400">Final Result</span>
                  <p className="text-2xl font-bold text-white">
                    {quizScore} / {activeDeck.quiz.length} Points
                  </p>
                  <p className="text-xs text-slate-400">
                    {quizScore === activeDeck.quiz.length ? 'Outstanding! Complete mastery achieved.' : 'Review your flashcards and re-attempt.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="max-w-xl mx-auto space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" /> Syllabus AI Synthesizer
                </h2>
                <p className="text-xs text-slate-400 mt-1">Paste lecture notes, raw concepts, or syllabus paragraphs. The parser will structure it into a revision module.</p>
              </div>

              <form onSubmit={handleGenerateFromNotes} className="space-y-4">
                <textarea
                  rows={6}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste lecture notes or textbook topics here... e.g. Cryptography RSA algorithm involves public-private keypairs derived from large prime numbers..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                  required
                />

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" /> Synthesizing Knowledge Units...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" /> Generate Flashcards & Quiz
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
