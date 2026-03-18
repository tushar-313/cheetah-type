import {useState ,useRef, useEffect} from 'react'

function App() {
  const [input, setInput] = useState<string>("");

  const [timeLeft, setTimeLeft]= useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);

  const [paragraph] = useState<string>("hello everyone");

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

  const timeSpent = (60 - timeLeft) / 60

  if(timeSpent <= 0) return 0

  const words = input.length / 5

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
  
  const inputRef = useRef<HTMLInputElement>(null);
    return (
      <>
  {paragraph.split("").map((char,index)=>{
    let color = "text-zinc-500"
    if(index < input.length)
      if(input[index] === char){
        color = "text-green-400";
      }else{
        color = "text-red-400";
      } 
      if(index===input.length){
        color += " border-l-2 border-yellow-400 animate-pulse"
      }
      return (
        
        <span key={index} className={color}>
          {char}
        </span>
        
      )
  })}
  <div className="flex gap-10 mb-5">

  <p>Time: {timeLeft}</p>
  <p>WPM: {calculateWPM()}</p>
  <p>Mistakes: {calculateMistakes()}</p>

</div>
        <input  
        disabled={finished}
        ref={inputRef}
        onClick={()=> inputRef.current?.focus()}
        autoFocus
        value={input}
        onChange={(e)=> {
          if(!isRunning){
            setIsRunning(true);
          }
          setInput(e.target.value)}} 
        className='opacity-0 absolute'
        />
        {finished && (
  <div>
    <h2>Results</h2>
    <p>WPM: {calculateWPM()}</p>
    <p>Mistakes: {calculateMistakes()}</p>
  </div>
)}
        </>
)
}

export default App;