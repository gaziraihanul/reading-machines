import { useState, useEffect } from 'react'
import { afinn165 as AFINN_DATA } from 'afinn-165'
 
// ── EXTENDED AFINN ────────────────────────────────────────────────
const EXTENDED = {
  // Course-specific (removed indigenous/indian — too easily misused)
  erasure:-3, colonial:-3, settler:-2, reclaim:2, sovereignty:3,
  archive:0, disappeared:-3, translated:0, untranslatable:-2,
  stolen:-3, erased:-3, resist:1, decolonize:2, dispossessed:-3,
  silenced:-2, invisible:-2, belonging:2, displaced:-2, colonized:-3,
  wampum:1, hypertext:0, indigiqueer:2, reclaiming:2,
  // Drastic positive
  transcendent:5, liberated:4, triumphant:4, luminous:4, euphoric:5,
  radiant:4, exultant:5, blissful:5, flourishing:4, boundless:4,
  magnificent:4, unbroken:3, reborn:4, healed:3, awakened:3,
  glorious:4, resplendent:4, emancipated:4, incandescent:4, rapturous:5,
  exhilarated:4, vivified:3, thriving:3, emboldened:3, soaring:3,
  // Drastic negative
  annihilated:-5, obliterated:-5, devastated:-4, tortured:-5, forsaken:-4,
  condemned:-4, shattered:-4, desecrated:-5, extinguished:-4, ravaged:-4,
  mutilated:-5, abolished:-3, betrayed:-4, abandoned:-4, consumed:-3,
  eviscerated:-5, annihilate:-5, decimated:-4, pulverized:-4, obliterate:-5,
  evaporated:-3, eroded:-3, entombed:-4, submerged:-3, severed:-3,
  // Calm/hopeful
  breathes:2, endures:2, persists:2, sustains:2, unfolds:2,
  abides:2, continues:1, remains:1, rests:1, settles:1,
  // Grief/melancholic
  mourning:-4, wailing:-4, desolate:-4, hollow:-3, withering:-3,
  crumbling:-3, dissolving:-3, unraveling:-3, collapsing:-3, suffocating:-4,
  languishing:-3, fading:-2, dimming:-2, sinking:-2, receding:-2,
}
 
// Remove words that could be offensive in unpredictable contexts
const BLOCKED = new Set(['indian','negro','savage','primitive','exotic','oriental'])
 
function scoreWord(word, type = 'word') {
  if (type === 'glitch') return -2
  if (type === 'punct')  return PUNCT_OPTIONS.find(p => p.display === word)?.score ?? 0
  if (type === 'name')   return 1
  if (type === 'echo')   return scoreWord(word, 'word')
  const w = word.toLowerCase()
  return EXTENDED[w] ?? AFINN_DATA[w] ?? 0
}
 
// ── WORD POOLS ────────────────────────────────────────────────────
// More words = each drastic word appears less often
const POOL_POSITIVE = [
  'love','light','free','bloom','rise','grace','whole','sacred','wonder',
  'transcendent','liberated','luminous','radiant','flourishing','boundless',
  'magnificent','unbroken','reborn','healed','awakened','joy','hope','bright',
  'glorious','resplendent','emancipated','soaring','rapturous','vivified',
  'warmth','tender','open','clear','gentle','kind','shine','peace','true',
  'singing','growing','living','breathing','becoming','remembering','holding',
]
const POOL_NEGATIVE = [
  'fear','dark','grief','wound','blood','erase','silence','hollow','lost',
  'annihilated','devastated','forsaken','condemned','shattered','ravaged',
  'betrayed','abandoned','erasure','colonial','dispossessed','disappeared',
  'stolen','suffocating','desolate','withering','collapsing','mourning',
  'eviscerated','decimated','entombed','severed','eroded','unraveling',
  'broken','cold','alone','shadow','heavy','empty','forgotten','buried',
  'unseen','unnamed','undone','absent','silent','failing','crying',
]
const POOL_NEUTRAL = [
  'voice','name','body','mind','word','land','sea','dream','memory',
  'archive','translated','untranslatable','sovereignty','belonging',
  'settler','reclaim','resist','endures','breathes','remains',
  'sky','stone','water','root','thread','layer','border','edge','echo',
  'hand','eye','mouth','breath','skin','bone','tongue','wall','door',
  'time','place','space','form','shape','ground','surface','depth',
]
const POOL_TRANSITIONAL = [
  'because','until','despite','and yet','as if','before','after',
  'although','unless','whenever','wherever','while','since','though',
  'therefore','otherwise','meanwhile','suddenly','slowly','always',
  'never','perhaps','almost','already','still','again','once','now',
]
const FALLBACK_WORDS = [...POOL_POSITIVE, ...POOL_NEGATIVE, ...POOL_NEUTRAL]
 
// Personal words following name selection
const PERSONAL_AFTER_NAME = [
  'cried','wonders','remembers','forgets','carries','remains',
  'breathes','breaks','searches','becomes','endures','survives',
  'grieves','hopes','fears','aches','lingers','returns','resists','holds',
  'waits','walks','writes','reads','speaks','listens','watches','sits',
]
 
// ── GLITCH OPTIONS ────────────────────────────────────────────────
const GLITCH_OPTIONS = [
  { display: 'e\u0334r\u0337r\u0334o\u0337r\u0338', type: 'glitch' },
  { display: '01001', type: 'glitch' },
  { display: '////', type: 'glitch' },
  { display: '\u2593\u2592\u2591', type: 'glitch' },
  { display: 'N\u0337U\u0338L\u0335L\u0336', type: 'glitch' },
  { display: 'g\u0334\u031bl\u0337i\u0338t\u0334c\u0335h\u0337', type: 'glitch' },
  { display: '\u2205', type: 'glitch' },
  { display: '????', type: 'glitch' },
  { display: '0x00', type: 'glitch' },
  { display: 'u\u0337n\u0338d\u0337e\u0338f\u0334', type: 'glitch' },
  { display: '---', type: 'glitch' },
  { display: '\u2588\u2591\u2588', type: 'glitch' },
]
 
const PUNCT_OPTIONS = [
  { display: '.', score: 0, type: 'punct' },
  { display: '...', score: -1, type: 'punct' },
  { display: '!', score: 1, type: 'punct' },
  { display: '?', score: -1, type: 'punct' },
]
 
// ── TYPOGRAPHY ────────────────────────────────────────────────────
function wordStyle(score, type = 'word') {
  if (type === 'glitch') return {
    fontSize: '0.95rem', fontWeight: '400', fontStyle: 'normal',
    letterSpacing: '0.12em', color: 'hsl(100,80%,30%)',
    fontFamily: 'monospace', display: 'inline', opacity: 0.9,
  }
  if (type === 'punct') return {
    fontSize: '1rem', fontWeight: '400', fontStyle: 'normal',
    letterSpacing: '0em', color: '#999', display: 'inline', marginRight: '0.1em',
  }
  if (type === 'name') return {
    fontSize: '1.15rem', fontWeight: '600', fontStyle: 'normal',
    letterSpacing: '0.05em', color: 'hsl(200,55%,35%)', display: 'inline',
  }
  if (type === 'echo') return {
    fontSize: '1rem', fontWeight: '400', fontStyle: 'italic',
    letterSpacing: '0.03em', color: 'hsl(280,40%,45%)', display: 'inline',
    opacity: 0.85,
  }
  const abs = Math.min(Math.abs(score), 5)
  const size = 1.0 + abs * 0.2
  const weight = score > 1 ? '600' : '400'
  const style = score < -1 ? 'italic' : 'normal'
  const spacing = score > 2 ? '0.08em' : score < -2 ? '-0.04em' : '0em'
  let color = '#1a1a1a'
  if (score >= 4)      color = 'hsl(42,90%,32%)'   // golden
  else if (score >= 2) color = 'hsl(120,48%,32%)'  // green
  else if (score >= 1) color = 'hsl(160,42%,36%)'  // teal-green
  else if (score <= -4) color = 'hsl(250,60%,32%)' // deep indigo
  else if (score <= -2) color = 'hsl(220,52%,38%)' // blue
  else if (score <= -1) color = 'hsl(30,50%,40%)'  // amber
  return { fontSize:`${size}rem`, fontWeight:weight, fontStyle:style,
    letterSpacing:spacing, color, transition:'all 0.4s ease', display:'inline' }
}
 
// ── DOT COLORS ────────────────────────────────────────────────────
function dotColor(score, type) {
  if (type === 'glitch') return 'hsl(100,70%,42%)'
  if (type === 'punct')  return '#ddd'
  if (type === 'name')   return 'hsl(200,55%,58%)'
  if (type === 'echo')   return 'hsl(280,40%,58%)'
  if (score >= 4)  return 'hsl(42,85%,52%)'    // gold
  if (score >= 2)  return 'hsl(120,50%,48%)'   // green
  if (score >= 1)  return 'hsl(160,42%,56%)'   // soft green
  if (score === 0) return '#ddd'
  if (score >= -1) return 'hsl(30,55%,56%)'    // amber
  if (score >= -3) return 'hsl(210,48%,56%)'   // blue
  if (score >= -4) return 'hsl(230,52%,48%)'   // deep blue
  return 'hsl(250,58%,42%)'                    // indigo
}
 
// ── BACKGROUND COLOR ──────────────────────────────────────────────
function bgColor(cumulative) {
  const t = Math.max(-1, Math.min(1, cumulative / 7))
  if (t >= 0) {
    // shifts from neutral gray → warm golden-cream
    const h = Math.round(220 - t * 180)  // 220 (cool) → 40 (warm gold)
    const s = Math.round(5 + t * 30)
    const l = Math.round(97 - t * 6)
    return `hsl(${h},${s}%,${l}%)`
  }
  const u = -t
  const s = Math.round(6 + u * 22)
  const l = Math.round(97 - u * 11)
  return `hsl(220,${s}%,${l}%)`
}
 
// ── SENTIMENT META ────────────────────────────────────────────────
function sentimentMeta(cumulative, glitchLevel) {
  if (glitchLevel > 2)  return { label: 'glitch',       color: 'hsl(100,70%,30%)' }
  if (cumulative > 8)   return { label: 'transcendent', color: 'hsl(42,90%,36%)'  }  // gold
  if (cumulative > 5)   return { label: 'joyful',       color: 'hsl(55,80%,36%)'  }  // yellow-green
  if (cumulative > 2)   return { label: 'hopeful',      color: 'hsl(120,48%,34%)' }  // green
  if (cumulative > 0)   return { label: 'calm',         color: 'hsl(170,38%,38%)' }  // teal
  if (cumulative === 0) return { label: 'neutral',      color: '#999'              }
  if (cumulative > -3)  return { label: 'uneasy',       color: 'hsl(30,58%,38%)'  }  // amber
  if (cumulative > -6)  return { label: 'melancholic',  color: 'hsl(210,50%,40%)' }  // blue
  if (cumulative > -10) return { label: 'grief',        color: 'hsl(230,52%,36%)' }  // deep blue
  return                       { label: 'devastated',   color: 'hsl(250,60%,30%)' }  // indigo
}
 
// ── WEIGHTED SAMPLE ───────────────────────────────────────────────
function weightedSample(candidates, n, exclude = []) {
  const filtered = candidates.filter(c => !exclude.includes(c.word) && !BLOCKED.has(c.word))
  const pool = filtered.length > 0 ? filtered : candidates.filter(c => !BLOCKED.has(c.word))
  const noisy = pool.map(c => ({ word: c.word, score: c.count + Math.random() * (c.count * 0.6) }))
  noisy.sort((a, b) => b.score - a.score)
  return noisy.slice(0, n).map(c => c.word)
}
 
// ── CONFIDENCE STYLE ──────────────────────────────────────────────
function confidenceStyle(source) {
  if (source === 'strong')   return { border: '1.5px solid #bbb' }
  if (source === 'medium')   return { border: '1px dashed #bbb' }
  if (source === 'personal') return { border: '1px solid hsl(200,55%,70%)' }
  if (source === 'echo')     return { border: '1px solid hsl(280,35%,72%)' }
  if (source === 'bridge')   return { border: '1px solid hsl(170,38%,65%)' }
  return { border: '1px dotted #ccc', opacity: 0.8 }
}
 
const STOP_PROMPTS = [
  'What meaning do you find?',
  'What does the machine not know about this?',
  'Who is missing from this text?',
  'What did you choose not to write?',
  'What would you have written without the machine?',
  'Where did this language come from?',
  'What does the sentiment score miss?',
  'Whose words were these to begin with?',
  'What cannot be predicted about you?',
  'What remains untranslatable here?',
  'What would you remove if you could?',
]
 
export default function App() {
  const [model, setModel]               = useState(null)
  const [phase, setPhase]               = useState('seed')
  const [name, setName]                 = useState('')
  const [seed, setSeed]                 = useState('')
  const [words, setWords]               = useState([])
  const [predictions, setPredictions]   = useState([])
  const [cumulative, setCumulative]     = useState(0)
  const [recentWords, setRecentWords]   = useState([])
  const [glitchLevel, setGlitchLevel]   = useState(0)
  const [stopPrompt, setStopPrompt]     = useState('')
  const [bgHue, setBgHue]               = useState(null)
  const [nameJustUsed, setNameJustUsed] = useState(false)
  const [wordCount, setWordCount]       = useState(0)
  const [showAbout, setShowAbout]       = useState(false)
  const [title, setTitle]               = useState('')
 
  useEffect(() => {
    fetch('/ngram_model.json').then(r => r.json()).then(setModel)
  }, [])
 
  useEffect(() => {
    if (glitchLevel > 2) {
      const interval = setInterval(() => setBgHue(h => ((h ?? 0) + 3) % 360), 80)
      return () => clearInterval(interval)
    }
    setBgHue(null)
    document.body.style.backgroundColor = bgColor(cumulative)
    document.body.style.transition = 'background-color 2.5s ease'
  }, [cumulative, glitchLevel])
 
  useEffect(() => {
    if (bgHue !== null) {
      document.body.style.backgroundColor = `hsl(${bgHue},18%,88%)`
      document.body.style.transition = 'none'
    }
  }, [bgHue])
 
  // ── GET PREDICTIONS ───────────────────────────────────────────────
  function getPredictions(wordList, recent = [], justUsedName = false, wc = 0) {
    if (!model) return []
    const results = []
 
    // 1. Personal words after name
    if (justUsedName && name.trim()) {
      const personal = [...PERSONAL_AFTER_NAME]
        .sort(() => Math.random() - 0.5)
        .filter(w => !recent.includes(w))
        .slice(0, 2)
      personal.forEach(w => results.push({ word: w, source: 'personal' }))
    }
 
    // 2. Echo — every ~8 words, mirror an early word back
    const shouldEcho = wc > 4 && wc % 8 === 0 && wordList.length > 3
    if (shouldEcho) {
      const earlyWords = wordList
        .slice(0, Math.floor(wordList.length / 2))
        .filter(w => w.type === 'word' && w.text.length > 3 && !recent.includes(w.text))
      if (earlyWords.length > 0) {
        const echoed = earlyWords[Math.floor(Math.random() * earlyWords.length)].text
        results.push({ word: echoed, source: 'echo', type: 'echo' })
      }
    }
 
    // 3. Transitional — every ~5 words inject a connective
    const shouldBridge = wc > 2 && wc % 5 === 0 && results.length < 2
    if (shouldBridge) {
      const bridge = POOL_TRANSITIONAL[Math.floor(Math.random() * POOL_TRANSITIONAL.length)]
      if (!recent.includes(bridge)) {
        results.push({ word: bridge, source: 'bridge' })
      }
    }
 
    // 4. Trigram
    if (results.length < 3 && wordList.length >= 2) {
      const triKey = wordList.slice(-2).map(w => w.text.toLowerCase()).join(' ')
      const triCandidates = model.trigrams[triKey]
      if (triCandidates?.length > 0) {
        weightedSample(
          triCandidates.filter(c => c.word.length > 2),
          3 - results.length,
          [...recent, ...results.map(r => r.word)]
        ).forEach(w => results.push({ word: w, source: 'strong' }))
      }
    }
 
    // 5. Bigram fill
    if (results.length < 3 && wordList.length >= 1) {
      const biKey = wordList[wordList.length - 1].text.toLowerCase()
      const biCandidates = model.bigrams[biKey]
      if (biCandidates?.length > 0) {
        weightedSample(
          biCandidates.filter(c => c.word.length > 2),
          3 - results.length,
          [...recent, ...results.map(r => r.word)]
        ).forEach(w => results.push({ word: w, source: 'medium' }))
      }
    }
 
    // 6. Second-to-last bigram
    if (results.length < 3 && wordList.length >= 2) {
      const biKey2 = wordList[wordList.length - 2].text.toLowerCase()
      const biCandidates2 = model.bigrams[biKey2]
      if (biCandidates2?.length > 0) {
        weightedSample(
          biCandidates2.filter(c => c.word.length > 2),
          3 - results.length,
          [...recent, ...results.map(r => r.word)]
        ).forEach(w => results.push({ word: w, source: 'medium' }))
      }
    }
 
    // 7. Fallback — bias toward neutral/transitional, drastic words appear less (~20%)
    if (results.length < 3) {
      const isDramaticRoll = Math.random() < 0.2
      const pool = isDramaticRoll
        ? [...POOL_POSITIVE, ...POOL_NEGATIVE]
        : [...POOL_NEUTRAL, ...POOL_TRANSITIONAL, ...POOL_POSITIVE.slice(0, 10)]
      const shuffled = pool
        .sort(() => Math.random() - 0.5)
        .filter(w => !results.map(r => r.word).includes(w) && !recent.includes(w) && !BLOCKED.has(w))
      shuffled.slice(0, 3 - results.length).forEach(w =>
        results.push({ word: w, source: 'weak' })
      )
    }
 
    const wordResults = results.slice(0, 3)
 
    // Name injection every ~7 words
    const shouldInjectName = name.trim() && wc > 0 && wc % 7 === 0
    if (shouldInjectName && wordResults.length === 3) {
      const slot = Math.floor(Math.random() * 3)
      wordResults.splice(slot, 0, {
        display: name.trim(), word: name.trim().toLowerCase(), type: 'name', source: 'name'
      })
      wordResults.pop()
    }
 
    // 4th slot: glitch (lower probability now — 18% base) or punct
    const useGlitch = Math.random() < 0.18 + glitchLevel * 0.08
    const special = useGlitch
      ? { ...GLITCH_OPTIONS[Math.floor(Math.random() * GLITCH_OPTIONS.length)], word: 'glitch', source: 'glitch' }
      : { ...PUNCT_OPTIONS[Math.floor(Math.random() * PUNCT_OPTIONS.length)], word: PUNCT_OPTIONS[0].display, source: 'punct' }
 
    return [
      ...wordResults.map(r => ({
        display: r.display ?? r.word, word: r.word,
        type: r.type ?? 'word', source: r.source,
      })),
      special,
    ]
  }
 
  function begin() {
    if (!seed.trim()) return
    const tokens = seed.trim().toLowerCase().split(/\s+/)
    const wordObjs = tokens.map(t => ({ text: t, score: scoreWord(t), type: 'word' }))
    const total = wordObjs.reduce((s, w) => s + w.score, 0)
    const recent = tokens.slice(-5)
    setWords(wordObjs); setCumulative(total); setRecentWords(recent)
    setWordCount(tokens.length)
    setPredictions(getPredictions(wordObjs, recent, false, tokens.length))
    setPhase('writing')
  }
 
  function addWord(option) {
    const score = scoreWord(option.word, option.type)
    const isName = option.type === 'name'
    const newGlitch = option.type === 'glitch' ? glitchLevel + 1 : Math.max(0, glitchLevel - 0.3)
    const newWords = [...words, { text: option.display, score, type: option.type }]
    const newCumulative = cumulative + score
    const newRecent = [...recentWords, option.word].slice(-6)
    const newCount = wordCount + 1
    setWords(newWords); setCumulative(newCumulative); setGlitchLevel(newGlitch)
    setRecentWords(newRecent); setWordCount(newCount); setNameJustUsed(isName)
    setPredictions(getPredictions(newWords, newRecent, isName, newCount))
  }
 
  function stop() {
    setStopPrompt(STOP_PROMPTS[Math.floor(Math.random() * STOP_PROMPTS.length)])
    setPhase('done')
  }
 
  function reset() {
    setWords([]); setPredictions([]); setCumulative(0)
    setGlitchLevel(0); setRecentWords([]); setStopPrompt('')
    setBgHue(null); setNameJustUsed(false); setWordCount(0)
    setSeed(''); setTitle(''); setPhase('seed')
    document.body.style.backgroundColor = ''
  }
 
  if (!model) return (
    <div style={{ padding: '2rem', fontFamily: 'Georgia, serif', color: '#888' }}>Loading…</div>
  )
 
  const { label, color } = sentimentMeta(cumulative, glitchLevel)
  const sign = cumulative > 0 ? '+' : ''
 
  const wrap = {
    width: '100%', maxWidth: '680px', margin: '0 auto',
    padding: '0 2rem', boxSizing: 'border-box',
    minHeight: '100vh', fontFamily: 'Georgia, serif',
  }
  const textBox = {
    background: 'rgba(255,255,255,0.55)',
    padding: '1.5rem 1.75rem', borderRadius: '8px',
    marginBottom: '1rem', lineHeight: '2.5',
    border: '1px solid rgba(0,0,0,0.06)',
    width: '100%', boxSizing: 'border-box',
    overflowWrap: 'break-word', textAlign: 'left',
  }
 
  return (
    <div style={wrap}>
 
      {/* ── SEED ── */}
      {phase === 'seed' && (
        <div style={{ paddingTop: '3.5rem' }}>
          <p style={{ marginBottom: '0.4rem', fontSize: '1rem', color: '#444' }}>
            What begins your text?
          </p>
          <p style={{ marginBottom: '1.2rem', fontSize: '0.8rem', color: '#aaa', lineHeight: '1.6' }}>
            Type anything — a phrase, a feeling, a fragment. The machine will continue from wherever you start.
          </p>
 
          <input
            value={name}
            onChange={e => setName(e.target.value.slice(0, 20))}
            placeholder="Your name (optional)"
            style={{
              width: '100%', fontSize: '1rem', padding: '9px 14px',
              marginBottom: '10px', border: '1px solid #ddd', borderRadius: '6px',
              fontFamily: 'Georgia, serif', background: 'rgba(255,255,255,0.7)',
              outline: 'none', color: '#555', boxSizing: 'border-box',
            }}
          />
          <input
            value={seed}
            onChange={e => setSeed(e.target.value.slice(0, 30))}
            onKeyDown={e => e.key === 'Enter' && begin()}
            placeholder="up to 30 characters…"
            style={{
              width: '100%', fontSize: '1.1rem', padding: '10px 14px',
              marginBottom: '6px', border: '1px solid #bbb', borderRadius: '6px',
              fontFamily: 'Georgia, serif', background: 'rgba(255,255,255,0.7)',
              outline: 'none', color: '#111', boxSizing: 'border-box',
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '1.5rem' }}>
            {30 - seed.length} characters remaining
          </div>
          <button onClick={begin} style={{
            padding: '9px 28px', fontSize: '1rem',
            border: '1px solid #888', borderRadius: '6px',
            background: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            fontFamily: 'Georgia, serif', color: '#222', marginBottom: '2rem',
          }}>
            Begin
          </button>
 
          <div style={{ marginTop: '0.5rem' }}>
            <button onClick={() => setShowAbout(a => !a)} style={{
              fontSize: '0.75rem', color: '#aaa', background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
              textDecoration: 'underline', fontFamily: 'Georgia, serif',
            }}>
              {showAbout ? 'hide' : 'about this tool'}
            </button>
            {showAbout && (
              <div style={{
                marginTop: '1rem', fontSize: '0.82rem', color: '#666',
                lineHeight: '1.8', maxWidth: '520px',
                borderLeft: '2px solid rgba(0,0,0,0.08)', paddingLeft: '1rem',
              }}>
                <p style={{ marginBottom: '0.7rem' }}>
                  Predictions are generated by a statistical model trained on canonical
                  Western literature — Whitman, Dickinson, Poe, Woolf, and Stein — alongside
                  excerpts from course texts by Racter, Erin Mouré, Joshua Whitehead, rupi kaur,
                  Margaret Rhee, and others. The model does not understand your words.
                  It only knows which words tend to follow which.
                </p>
                <p style={{ marginBottom: '0.7rem' }}>
                  What it cannot predict reveals as much as what it can.
                  Prediction confidence is visible in each button's border:
                  solid = strong match, dashed = partial, dotted = guessing.
                  Purple italic words are echoes — the machine reflecting your own language back.
                  Teal words are transitional — structural connectives offered to help you build meaning.
                </p>
                <p style={{ marginBottom: '0.7rem' }}>
                  The background shifts from cool to warm with positive sentiment, and from
                  neutral to deep blue with negative. Typography shifts with each word's
                  emotional weight. The dot trail below maps the shape of your text's feeling.
                </p>
                <p>
                  Glitch tokens destabilise the system. The model has no word for untranslatable.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
 
      {/* ── WRITING ── */}
      {phase === 'writing' && (
        <div style={{ paddingTop: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
 
          {/* Sentiment bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', width: '100%' }}>
            <span style={{
              fontSize: '0.8rem', fontWeight: '600', color,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              transition: 'color 1.8s ease', minWidth: '115px',
              fontFamily: glitchLevel > 2 ? 'monospace' : 'Georgia, serif',
            }}>
              {label}
            </span>
            <div style={{ flex: 1, height: '3px', background: 'rgba(0,0,0,0.12)', borderRadius: '2px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: `${Math.min(100, Math.max(0, (cumulative + 12) / 24 * 100))}%`,
                top: '-4px', width: '10px', height: '10px',
                borderRadius: '50%', background: color,
                transform: 'translateX(-50%)',
                transition: 'left 1.8s ease, background 1.8s ease',
              }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#777', minWidth: '36px', textAlign: 'right' }}>
              {sign}{cumulative}
            </span>
          </div>
 
          {/* Text display */}
          <div style={textBox}>
            {words.map((w, i) => (
              <span key={i} style={{
                ...wordStyle(w.score, w.type),
                marginRight: w.type === 'punct' ? '0.05em' : '0.32em',
              }}>
                {w.text}
              </span>
            ))}
          </div>
 
          {/* Word trail */}
          {words.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '0.5rem', alignItems: 'center' }}>
              {words.map((w, i) => (
                <div key={i}
                  title={`${w.text} (${w.score > 0 ? '+' : ''}${w.score})`}
                  style={{
                    width: w.type === 'punct' ? '4px' : '8px', height: '8px',
                    borderRadius: '50%', backgroundColor: dotColor(w.score, w.type),
                    opacity: 0.85, flexShrink: 0, cursor: 'default',
                  }}
                />
              ))}
            </div>
          )}
          <div style={{ fontSize: '0.62rem', color: '#ccc', marginBottom: '1.5rem', letterSpacing: '0.03em' }}>
            hover dots to see word scores
          </div>
 
          {/* Prediction label + legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.68rem', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              predicted next words
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'strong', style: { borderTop: '1.5px solid #bbb' } },
                { label: 'partial', style: { borderTop: '1px dashed #bbb' } },
                { label: 'guess', style: { borderTop: '1px dotted #ccc' } },
                { label: 'echo', style: { borderTop: '1px solid hsl(280,35%,72%)' } },
                { label: 'bridge', style: { borderTop: '1px solid hsl(170,38%,65%)' } },
              ].map(item => (
                <span key={item.label} style={{ fontSize: '0.62rem', color: '#bbb', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ display: 'inline-block', width: '14px', height: '0', ...item.style }} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
 
          {/* Prediction buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '2.5rem', width: '100%', boxSizing: 'border-box' }}>
            {predictions.map((opt, i) => {
              const isGlitch = opt.type === 'glitch'
              const isPunct  = opt.type === 'punct'
              const isName   = opt.type === 'name'
              const isEcho   = opt.type === 'echo'
              const isBridge = opt.source === 'bridge'
              const confStyle = (isGlitch || isPunct || isName)
                ? { border: '1px solid #bbb' }
                : confidenceStyle(opt.source)
              return (
                <button key={i} onClick={() => addWord(opt)}
                  style={{
                    fontSize: isGlitch ? '0.9rem' : '1.05rem',
                    padding: '9px 20px',
                    ...confStyle,
                    borderRadius: '6px',
                    background: isGlitch ? 'rgba(180,255,160,0.18)'
                      : isName   ? 'rgba(200,230,255,0.35)'
                      : isEcho   ? 'rgba(220,200,255,0.25)'
                      : isBridge ? 'rgba(180,240,230,0.25)'
                      : 'rgba(255,255,255,0.65)',
                    cursor: 'pointer',
                    fontFamily: isGlitch ? 'monospace' : 'Georgia, serif',
                    fontStyle: isEcho ? 'italic' : 'normal',
                    color: isGlitch ? 'hsl(100,60%,28%)'
                      : isPunct  ? '#888'
                      : isName   ? 'hsl(200,55%,35%)'
                      : isEcho   ? 'hsl(280,40%,42%)'
                      : isBridge ? 'hsl(170,45%,35%)'
                      : '#222',
                    transition: 'background 0.15s',
                    letterSpacing: isGlitch ? '0.05em' : 'normal',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.95)'}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isGlitch ? 'rgba(180,255,160,0.18)'
                      : isName   ? 'rgba(200,230,255,0.35)'
                      : isEcho   ? 'rgba(220,200,255,0.25)'
                      : isBridge ? 'rgba(180,240,230,0.25)'
                      : 'rgba(255,255,255,0.65)'
                  }}
                >
                  {opt.display}
                </button>
              )
            })}
          </div>
 
          <button onClick={stop} style={{
            padding: '6px 18px', fontSize: '0.85rem',
            border: '1px solid #bbb', borderRadius: '6px',
            background: 'rgba(255,255,255,0.5)', cursor: 'pointer', color: '#888',
          }}>
            Stop
          </button>
        </div>
      )}
 
      {/* ── DONE ── */}
      {phase === 'done' && (
        <div style={{ paddingTop: '3rem', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '0.68rem', color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            your completed text
          </div>
 
          {/* Title input */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Give your text a title…"
            style={{
              width: '100%', fontSize: '1.15rem', padding: '8px 0',
              marginBottom: '1rem', border: 'none', borderBottom: '1px solid #ddd',
              background: 'transparent', outline: 'none', fontFamily: 'Georgia, serif',
              color: '#333', fontStyle: title ? 'normal' : 'italic', boxSizing: 'border-box',
            }}
          />
 
          <div style={textBox}>
            {words.map((w, i) => (
              <span key={i} style={{
                ...wordStyle(w.score, w.type),
                marginRight: w.type === 'punct' ? '0.05em' : '0.32em',
              }}>
                {w.text}
              </span>
            ))}
          </div>
 
          {/* Word trail on done screen */}
          {words.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', marginBottom: '1.25rem', alignItems: 'center' }}>
              {words.map((w, i) => (
                <div key={i} title={`${w.text} (${w.score > 0 ? '+' : ''}${w.score})`}
                  style={{
                    width: w.type === 'punct' ? '4px' : '8px', height: '8px',
                    borderRadius: '50%', backgroundColor: dotColor(w.score, w.type),
                    opacity: 0.85, flexShrink: 0, cursor: 'default',
                  }}
                />
              ))}
            </div>
          )}
 
          <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {words.length} words · final sentiment: {label} ({sign}{cumulative})
            {glitchLevel > 1 && (
              <span style={{ color: 'hsl(100,60%,32%)', marginLeft: '8px' }}>
                · {Math.round(glitchLevel)} glitch{Math.round(glitchLevel) !== 1 ? 'es' : ''}
              </span>
            )}
          </div>
 
          <div style={{
            fontSize: '1.1rem', color: '#555', fontStyle: 'italic',
            marginBottom: '2.5rem', lineHeight: '1.9',
            borderLeft: '2px solid rgba(0,0,0,0.1)', paddingLeft: '1rem',
          }}>
            {stopPrompt}
          </div>
 
          <button onClick={reset} style={{
            padding: '9px 28px', fontSize: '1rem',
            border: '1px solid #888', borderRadius: '6px',
            background: 'rgba(255,255,255,0.6)', cursor: 'pointer',
            fontFamily: 'Georgia, serif', color: '#222',
          }}>
            Begin again
          </button>
        </div>
      )}
 
    </div>
  )
}