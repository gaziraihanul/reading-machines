import { useState, useEffect } from 'react'

export default function App() {
  const [model, setModel] = useState(null)
  const [phase, setPhase] = useState('seed') // seed | writing | done
  const [seed, setSeed] = useState('')
  const [words, setWords] = useState([])
  const [predictions, setPredictions] = useState([])

  useEffect(() => {
    fetch('/ngram_model.json')
      .then(r => r.json())
      .then(data => setModel(data))
  }, [])

  function getPredictions(wordList) {
    if (!model || wordList.length < 2) return []
    const key = wordList.slice(-2).join(' ')
    const candidates = model[key]
    if (!candidates) return []
    return candidates.slice(0, 4).map(c => c.word)
  }

  function begin() {
    if (!seed.trim()) return
    const seedWords = seed.trim().toLowerCase().split(/\s+/)
    setWords(seedWords)
    setPredictions(getPredictions(seedWords))
    setPhase('writing')
  }

  function addWord(word) {
    const newWords = [...words, word]
    setWords(newWords)
    setPredictions(getPredictions(newWords))
  }

  function stop() {
    setPhase('done')
  }

  function reset() {
    setSeed('')
    setWords([])
    setPredictions([])
    setPhase('seed')
  }

  if (!model) return <div style={{padding:'2rem'}}>Loading model...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>

      {phase === 'seed' && (
        <div>
          <p style={{marginBottom:'1rem'}}>What begins your text?</p>
          <input
            value={seed}
            onChange={e => setSeed(e.target.value.slice(0, 30))}
            placeholder="up to 30 characters…"
            style={{width:'100%', fontSize:'1.1rem', padding:'8px', marginBottom:'8px'}}
          />
          <div style={{fontSize:'0.75rem', color:'#888', marginBottom:'1rem'}}>
            {30 - seed.length} characters remaining
          </div>
          <button onClick={begin}>Begin</button>
        </div>
      )}

      {phase === 'writing' && (
        <div>
          <div style={{
            background:'rgba(255,255,255,0.4)',
            padding:'1rem',
            borderRadius:'8px',
            minHeight:'80px',
            marginBottom:'1.5rem',
            fontSize:'1.2rem',
            lineHeight:'2'
          }}>
            {words.join(' ')}
          </div>

          <div style={{marginBottom:'1rem', fontSize:'0.75rem', color:'#888'}}>
            predicted next words — click to add
          </div>

          <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'2rem'}}>
            {predictions.length > 0
              ? predictions.map((w, i) => (
                  <button key={i} onClick={() => addWord(w)}
                    style={{fontSize:'1rem', padding:'8px 16px', cursor:'pointer'}}>
                    {w}
                  </button>
                ))
              : <span style={{color:'#aaa', fontSize:'0.9rem'}}>no predictions — try a different seed</span>
            }
          </div>

          <button onClick={stop}>Stop</button>
        </div>
      )}

      {phase === 'done' && (
        <div>
          <div style={{
            padding:'1.5rem',
            background:'rgba(255,255,255,0.4)',
            borderRadius:'8px',
            fontSize:'1.2rem',
            lineHeight:'2',
            marginBottom:'1.5rem'
          }}>
            {words.join(' ')}
          </div>
          <button onClick={reset}>Begin again</button>
        </div>
      )}

    </div>
  )
}