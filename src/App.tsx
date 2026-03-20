import {useState ,useRef, useEffect} from 'react'
import axios from 'axios'

function App() {
  const PREFETCH_BUFFER = 220;
  const [input, setInput] = useState<string>("");
  const [timeLeft, setTimeLeft]= useState<number>(30);
  const [totalTime, setTotalTime] = useState(30)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] =useState<boolean>(false);
  const [activeTimer, setActiveTimer] = useState<number>(30);
  const [isTimerHighlighted, setIsTimerHighlighted] = useState<boolean>(false);

  const [paragraph, setParagraph] = useState<string>("");

 
   function getNewQuote(){
    if(loading) return ;
    setLoading(true);
  axios.get("https://api.quotable.io/random")
    .then((res) => {
      setParagraph(prev => prev + " " + res.data.content)
      console.log(res.data);
      setLoading(false);
    }).catch(()=> {
      console.log("api eror")
      setLoading(false)
    })

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
function calculateMistakes(){
  let mistakes = 0
  for(let i = 0; i < input.length; i++){
    if(input[i] !== paragraph[i]){
      mistakes++
    }
  }
  return mistakes
}
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  if(finished){
 return (
  <div>
    <h2>Results</h2>
    <p>WPM: {calculateWPM()}</p>
    <p>Mistakes: {calculateMistakes()}</p>
    <p>Accuracy: {calculateAccuracy()}%</p>
    <button onClick={restart}>Restart</button>
  </div>
 )
}

    return (
      
      <>
      <div className="min-h-screen bg-[#060d1b] text-slate-100 flex flex-col items-center pt-0 pb-8 px-4">
        <div className="w-full max-w-5xl flex flex-col items-center gap-4">
          <img
            src="/cover.png"
            alt="Cheetah Type"
            className="w-full max-w-3xl h-auto object-contain drop-shadow-[0_20px_45px_rgba(15,23,42,0.65)]"
          />

          {isRunning && (
            <div className={`text-lg font-extrabold tracking-[0.08em] px-6 py-2 rounded-full border border-slate-700 bg-slate-900/80 shadow-lg transition-all duration-300 ${isTimerHighlighted ? 'ring-4 ring-amber-300 scale-105 text-amber-300' : 'text-amber-200'}`}>
              {timeLeft}s
            </div>
          )}

          {!isRunning && (
            <div className="flex gap-3 mb-3">
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
        </div>

 <div
  onClick={() => inputRef.current?.focus()}
  className="w-full max-w-5xl mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/55 backdrop-blur-sm shadow-[0_14px_40px_rgba(2,6,23,0.45)] p-6 sm:p-8 text-[1.55rem] sm:text-[1.7rem] font-bold leading-relaxed tracking-wide text-center transition-all duration-300">
  

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

            <span key={index} className={color}>
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
            const value = e.target.value;
            setInput(value);
            
            if (paragraph.length - value.length <= PREFETCH_BUFFER) {
              getNewQuote();
            }
            
          } } />
          </div>
          </>
    
)}


export default App;