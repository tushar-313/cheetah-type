import {useState ,useRef, useEffect} from 'react'
import axios from 'axios'

type QuoteApiResponse = {
  quote: string;
  author: string;
}

function App() {
  const PREFETCH_BUFFER = 220;
  const FALLBACK_PARAGRAPH = "practice daily and focus on accuracy before speed. consistency builds muscle memory and confidence.";
  const [input, setInput] = useState<string>("");
  const [timeLeft, setTimeLeft]= useState<number>(30);
  const [totalTime, setTotalTime] = useState(30)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] =useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState<number>(30);
  const [isTimerHighlighted, setIsTimerHighlighted] = useState<boolean>(false);
  const [displayWpm, setDisplayWpm] = useState<number>(0);
  const [displayMistakes, setDisplayMistakes] = useState<number>(0);
  const [displayAccuracy, setDisplayAccuracy] = useState<number>(0);

  const [paragraph, setParagraph] = useState<string>("");

 
   async function getNewQuote(){
    if(loading) return ;
    setLoading(true);
    try {
      const res = await axios.get<QuoteApiResponse>("https://dummyjson.com/quotes/random")
      const nextQuote = res.data.quote?.trim().toLowerCase()
      if(nextQuote){
        setParagraph(prev => `${prev} ${nextQuote}`.trim())
      }
    } catch {
      setParagraph((prev) => prev || FALLBACK_PARAGRAPH)
    } finally {
      setLoading(false)
    }

}
useEffect(() => {
  getNewQuote();
}, [])

  useEffect(() => {
  if(!isRunning) return

  const interval = setInterval(() => {
    setTimeLeft((prev) => prev - 1)
  }, 1000)

  return () => clearInterval(interval)

}, [isRunning]);

useEffect(() => {

  if(timeLeft === 0){
    setIsRunning(false)
    setFinished(true)
  }

}, [timeLeft])

function calculateWPM(){
  const timeSpent = (totalTime - timeLeft) / 60
  if(timeSpent <= 0) return 0
  const words = (input.length- calculateMistakes()) / 5
  return Math.round(words / timeSpent)
}
const finalWpm = calculateWPM()
function calculateMistakes(){
  let mistakes = 0
  for(let i = 0; i < input.length; i++){
    if(input[i] !== paragraph[i]){
      mistakes++
    }
  }
  return mistakes
}
const finalMistakes = calculateMistakes()
function restart(){

  setInput("")
  setTimeLeft(totalTime)
  setIsRunning(false)
  setFinished(false)
  setParagraph("")
  getNewQuote()
}
  function calculateAccuracy(){
  const total = input.length
  if(total === 0) return 0

  const mistakes = calculateMistakes()
  const correct = total - mistakes

  return Math.round((correct / total) * 100)
}
const finalAccuracy = calculateAccuracy()
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  function handleTimerChange(nextTime: number){
    setActiveTimer(nextTime)
    setTotalTime(nextTime)
    setTimeLeft(nextTime)
    setInput("")
    setIsRunning(false)
    setFinished(false)
    setIsTimerHighlighted(true)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if(!isTimerHighlighted) return
    const timeout = setTimeout(() => setIsTimerHighlighted(false), 550)
    return () => clearTimeout(timeout)
  }, [isTimerHighlighted])

  useEffect(() => {
    const container = textContainerRef.current
    if(!container) return

    const currentCaret = container.querySelector('[data-caret="true"]')
    if(currentCaret instanceof HTMLElement){
      currentCaret.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [input, paragraph])

  useEffect(() => {
    if(!finished){
      setDisplayWpm(0)
      setDisplayMistakes(0)
      setDisplayAccuracy(0)
      return
    }

    const duration = 1800
    const wpmTarget = finalWpm
    const mistakesTarget = finalMistakes
    const accuracyTarget = finalAccuracy
    let animationFrame = 0
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setDisplayWpm(Math.round(wpmTarget * easedProgress))
      setDisplayMistakes(Math.round(mistakesTarget * easedProgress))
      setDisplayAccuracy(Math.round(accuracyTarget * easedProgress))

      if(progress < 1){
        animationFrame = requestAnimationFrame(animate)
      } else {
        setDisplayWpm(wpmTarget)
        setDisplayMistakes(mistakesTarget)
        setDisplayAccuracy(accuracyTarget)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [finished, finalWpm, finalMistakes, finalAccuracy])

  if(finished){
 return (
  <div className="min-h-screen bg-[#060d1b] text-slate-100 lowercase flex items-center justify-center px-4 py-10 relative overflow-hidden">
    <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-20 -right-16 w-80 h-80 rounded-full bg-amber-300/10 blur-3xl" />

    <div className="w-full max-w-4xl rounded-[2rem] border border-slate-700/60 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_40%),linear-gradient(165deg,rgba(15,23,42,0.95),rgba(2,6,23,0.96))] shadow-[0_35px_100px_rgba(2,6,23,0.72)] backdrop-blur-sm overflow-hidden relative">
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300" />

      <div className="px-6 sm:px-10 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.26em] text-cyan-200/75 font-semibold">typing summary</p>
            <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-[0.03em] text-slate-100 normal-case">Results</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-300/85 rounded-full border border-slate-600/70 bg-slate-800/60 px-4 py-2">session complete</p>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4">
          <div className="rounded-3xl border border-emerald-400/35 bg-emerald-400/10 p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full border border-emerald-200/20" />
            <p className="text-xs tracking-[0.16em] text-emerald-200/80">speed</p>
            <p className="mt-3 text-6xl sm:text-7xl leading-none font-black text-emerald-300">{displayWpm}</p>
            <p className="mt-2 text-base sm:text-lg text-emerald-100/90 font-semibold">words per minute</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="rounded-2xl border border-rose-400/35 bg-rose-400/10 px-5 py-5 shadow-[inset_0_0_0_1px_rgba(251,113,133,0.15)]">
              <p className="text-xs tracking-[0.14em] text-rose-100/85">mistakes</p>
              <p className="mt-2 text-4xl font-extrabold text-rose-300">{displayMistakes}</p>
              <p className="text-sm text-rose-100/80">characters</p>
            </div>

            <div className="rounded-2xl border border-amber-400/35 bg-amber-400/10 px-5 py-5 shadow-[inset_0_0_0_1px_rgba(251,191,36,0.18)]">
              <p className="text-xs tracking-[0.14em] text-amber-100/85">accuracy</p>
              <p className="mt-2 text-4xl font-extrabold text-amber-200">{displayAccuracy}%</p>
              <p className="text-sm text-amber-100/80">correct hits</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center sm:justify-end">
          <button
            onClick={restart}
            className="px-9 py-3.5 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 text-slate-950 font-extrabold tracking-[0.08em] border border-cyan-100/70 shadow-[0_14px_34px_rgba(20,184,166,0.35)] hover:brightness-105 active:scale-[0.98] transition-all duration-200"
          >
            restart test
          </button>
        </div>
      </div>
    </div>
  </div>
 )
}

    return (
      
      <>
      <div className="min-h-screen bg-[#060d1b] text-slate-100 lowercase flex flex-col items-center pt-0 pb-8 px-4">
        <div className="w-full max-w-5xl flex flex-col gap-4">
          <div className="w-full flex items-start justify-between gap-4 pt-2">
            <img
              src="/cover.png"
              alt="Cheetah Type"
              className="w-[52vw] max-w-[320px] min-w-[190px] h-auto object-contain drop-shadow-[0_20px_45px_rgba(15,23,42,0.65)]"
            />

            <div className="mt-2 sm:mt-3 flex items-center justify-end gap-3">
              {!isRunning && (
                <div className="flex gap-2">
                  {[30, 60].map((seconds) => (
                    <button
                      key={seconds}
                      onClick={() => handleTimerChange(seconds)}
                      className={`px-5 py-2 rounded-full font-semibold border transition-all duration-200 ${activeTimer === seconds ? 'bg-amber-300 text-slate-950 border-amber-200 shadow-[0_6px_20px_rgba(251,191,36,0.45)]' : 'bg-slate-900/70 text-slate-200 border-slate-700 hover:border-slate-400 hover:bg-slate-800/90'}`}
                    >
                      {seconds}s
                    </button>
                  ))}
                </div>
              )}

              {isRunning && (
                <div className={`text-lg sm:text-xl font-extrabold tracking-[0.08em] px-6 py-2 rounded-full border border-slate-700 bg-slate-900/80 shadow-lg transition-all duration-300 ${isTimerHighlighted ? 'ring-4 ring-amber-300 scale-105 text-amber-300' : 'text-amber-200'}`}>
                  {timeLeft}s
                </div>
              )}
            </div>
          </div>
        </div>

 <div
  ref={textContainerRef}
  onClick={() => inputRef.current?.focus()}
  className="w-full max-w-5xl mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/55 backdrop-blur-sm shadow-[0_14px_40px_rgba(2,6,23,0.45)] p-6 sm:p-8 text-[1.55rem] sm:text-[1.7rem] font-bold leading-relaxed tracking-wide text-center transition-all duration-300 max-h-[52vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  

        {paragraph.split("").map((char, index) => {
          let color = "text-slate-500";
          if (index < input.length)
            if (input[index] === char) {
              color = "text-emerald-300";
            } else {
              color = "text-rose-400";
            }
          if (index === input.length) {
            color += " border-l-2 border-amber-300 animate-pulse";
          }
          return (

            <span key={index} className={color} data-caret={index === input.length ? "true" : undefined}>
              {char}
            </span>

          );
        })}
        </div>
    <input
          className="opacity-0 absolute"
          disabled={finished}
          ref={inputRef}
          onClick={() => inputRef.current?.focus()}
          autoFocus
          value={input}
          onChange={(e) => {
            
            if (!isRunning) {
              setIsRunning(true);
            }
            const value = e.target.value.toLowerCase();
            setInput(value);
            
            if (paragraph.length - value.length <= PREFETCH_BUFFER) {
              getNewQuote();
            }
            
          } } />
          </div>
          </>
    
)}


export default App;