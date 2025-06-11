import React, { useState, useRef } from "react";
import "./index.css";

const NAV_COLOR = "#2d6a91";
const NAV_COLOR_DARK = "#193864";
const LOGO_URL = "https://ext.same-assets.com/3144032977/1602066237.png";
const MENU_ICON = [
  { label: "Customize" },
  { label: "New" },
  { label: "Open" },
  { label: "Save" },
  { label: "Share" },
  { label: "Gallery" },
  { label: "More" },
];
const PALETTE = [
  "#2d6a91", "#66c67d", "#e9b116", "#d11729", "#0c1cad", "#1cad0c", "#e5d19f", "#066f80", "#4f3e3e"
];
const DEFAULT_ENTRIES = ["Ali","Beatriz","Charles","Diya","Eric", "Narin"];
function degToRad(deg:number) { return (deg*Math.PI)/180; }
function randomInt(min:number,max:number) { return Math.floor(Math.random()*(max-min+1))+min; }
function describeArc(cx:number,cy:number,r:number,startAngle:number,endAngle:number) {
  const start = {x:cx + r*Math.cos(degToRad(startAngle)), y:cy + r*Math.sin(degToRad(startAngle))};
  const end = {x:cx + r*Math.cos(degToRad(endAngle)), y:cy + r*Math.sin(degToRad(endAngle))};
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z"
  ].join(" ");
}

const getWheelSize = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth <= 700) return 320;
    if (window.innerWidth <= 1024) return 400;
    if (window.innerWidth <= 1500) return 520;
    return 600;
  }
  return 400;
};

export default function App() {
  const [entries, setEntries] = useState(DEFAULT_ENTRIES);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const animRef = useRef<number | null>(null);
  const [inputText, setInputText] = useState(DEFAULT_ENTRIES.join("\n"));
  const [results, setResults] = useState<string[]>([]);
  const [mode, setMode] = useState<'light'|'dark'>('light');

  const [wheelSize, setWheelSize] = React.useState(getWheelSize());
  const [radius, setRadius] = React.useState(getWheelSize()/2 - 20);
  const [center, setCenter] = React.useState(getWheelSize()/2);
  // Add these near the top with other state variables in App component
  const [baseRotation, setBaseRotation] = useState(0);
  const rotationAnimRef = useRef<number | null>(null);
  React.useEffect(() => {
    function handleResize() {
      const newSize = getWheelSize();
      setWheelSize(newSize);
      setRadius(newSize/2 - 20);
      setCenter(newSize/2);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Wheel math ---
  const numSegments = entries.length;
  const anglePer = 360 / (numSegments || 1);

  function handleSpin() {
    if (spinning || numSegments === 0) return;

    // Cancel base rotation during spin
    if (rotationAnimRef.current) {
      cancelAnimationFrame(rotationAnimRef.current);
    }
    setSpinning(true);
    setWinner(null);
    setShowPopup(false);
    const fullSpins = randomInt(4, 6) * 360;
    const targetSegment = randomInt(0, numSegments - 1);
    const targetDeg = 360 - (targetSegment * anglePer + anglePer/2);
    const finalRotation = fullSpins + targetDeg; // Account for base rotation

    let start = performance.now();
    const duration = 3500;
    const initialRotation = rotation;
    const delta = finalRotation;
    function animateWheel(now: number) {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setRotation(initialRotation + ease * delta);
      
      if (p < 1) {
        animRef.current = requestAnimationFrame(animateWheel);
      } else {
        setSpinning(false);
        // Calculate the actual winner based on final rotation
        const finalAngle = (initialRotation + delta) % 360;
        const winningIndex = Math.floor((360 - (finalAngle % 360)) / anglePer) % numSegments;
        setWinner(entries[winningIndex]);
        setShowPopup(true);
        setResults(r => [entries[winningIndex], ...r]);
      }
    }
    animRef.current = requestAnimationFrame(animateWheel);

  }
  function handleEntriesChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputText(e.target.value);
    const parsed = e.target.value.split("\n").map(s => s.trim()).filter(Boolean);
    setEntries(parsed);
  }
  function handleClosePopup() {
    setShowPopup(false);
  }
  function handleRemoveWinner() {
    setEntries(entries.filter((name) => name!==winner));
    setShowPopup(false);
    setWinner(null);
  }
  function handleSwitchMode() {
    setMode(mode === 'light' ? 'dark' : 'light');
    document.body.classList.toggle('dark', mode==='light');
  }

  // Add this function inside App component, before the return statement
  function animateBaseRotation(timestamp: number) {
    setBaseRotation(prev => (prev + 0.3) % 360); // Adjust 0.1 for speed
    rotationAnimRef.current = requestAnimationFrame(animateBaseRotation);
  }
  React.useEffect(() => () => { if (animRef.current != null) cancelAnimationFrame(animRef.current); }, []);
  // Add this useEffect to handle the continuous rotation
  React.useEffect(() => {
    if (!spinning) {
      rotationAnimRef.current = requestAnimationFrame(animateBaseRotation);
    }
    return () => {
      if (rotationAnimRef.current) {
        cancelAnimationFrame(rotationAnimRef.current);
      }
    };
  }, [spinning]);
  return (
    <div className={`${mode==='dark'? 'bg-[#15181c] text-white' : 'bg-white'} min-h-screen flex flex-col`} style={{ fontFamily: "'Quicksand', Arial, sans-serif" }}>
      {/* App Bar */}
      <nav
        style={{ background: mode==='dark'? NAV_COLOR_DARK : NAV_COLOR }}
        className="flex items-center px-4 py-2 gap-5 w-full shadow text-white"
      >
        <img src={LOGO_URL} alt="logo" className="w-8 h-8 mr-2" />
        <span className="text-xl font-semibold mr-8">wheelofnames.com</span>
        {MENU_ICON.map((item, i) => (
          <button
            key={item.label}
            className="hover:bg-blue-800 px-2 py-1 rounded text-sm font-medium ">
            {item.label}
          </button>
        ))}
        <div className="flex-1" />
        {/* Theme Switcher */}
        <button className="mr-2 bg-white/20 hover:bg-[#335d8c]/60 rounded p-2" title="Switch theme" onClick={handleSwitchMode}>
          {mode === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="hover:bg-blue-800 px-3 py-1 rounded text-sm font-medium">
          English
        </button>
      </nav>
      {/* Main Layout */}
      <div className="flex-1 flex flex-row px-4 pt-5 gap-5" style={{background:mode==='dark'?"#15181c":"#fbfbfb"}}>
        {/* Wheel Area */}
        <div className="flex flex-1 flex-col items-center justify-start min-w-[320px]">
          {/* Interactive spinning wheel */}
          <div
            className="relative flex items-center justify-center cursor-pointer"
            style={{ width: wheelSize, height: wheelSize }}
            onClick={handleSpin}
          >
            <svg
              width={wheelSize}
              height={wheelSize}
              viewBox={`0 0 ${wheelSize} ${wheelSize}`}
              style={{ 
                transition: spinning ? undefined : "transform 0.3s cubic-bezier(0.2, 0, 0.3, 1)", 
                transform: `rotate(${rotation + (spinning ? 0 : baseRotation)}deg)` 
              }}
            >
              {entries.length === 0 ? (
                <circle cx={center} cy={center} r={radius} fill="#eee" />
              ) : (
                entries.map((name, i) => {
                  const start = anglePer * i;
                  const end = start + anglePer;
                  return (
                    <g key={name + i}>
                      <path
                        d={describeArc(center, center, radius, start, end)}
                        fill={PALETTE[i % PALETTE.length]}
                        stroke="none"
                        strokeWidth="0"
                        opacity={winner === name ? 1 : 0.96}
                        style={winner === name ? { filter: "drop-shadow(0 0 8px #222)" } : {}}
                      />
                      {/* Name text in arc */}
                      <g>
                        <TextOnArc
                          text={name}
                          startAngle={start}
                          endAngle={end}
                          radius={radius}
                          cx={center}
                          cy={center}
                          highlight={winner === name}
                        />
                      </g>
                    </g>
                  );
                })
              )}
              <circle cx={center} cy={center} r={Math.max(60, wheelSize/7)} fill="#fff" stroke="#eee" />
            </svg>
            {/* Center "Tap to spin" */}
            <div className="absolute top-1/2 left-1/2 select-none pointer-events-none" style={{ transform: "translate(-50%, -50%)" }}>
              <div className={`rounded-full flex items-center justify-center text-xl font-bold transition-all duration-200 ${spinning ? "opacity-40" : "opacity-100"}`} style={{ color: spinning ? "#222" : (mode==='dark' ? '#222' : NAV_COLOR) }}>
                {winner ? winner : (entries.length === 0 ? "No entries" : "Tap to spin")}
              </div>
            </div>
            {/* Arrow pointer */}
            <div
              style={{
                left: wheelSize - Math.max(34, wheelSize * 0.055),
                top: wheelSize / 2 - Math.max(16, wheelSize * 0.027)
              }}
              className="absolute w-0 h-0"
            >
              <svg width={Math.max(32, wheelSize * 0.053)} height={Math.max(32, wheelSize * 0.053)} viewBox="0 0 24 24">
                <polygon points="0,12 24,0 24,24" fill="#9ba2a7" />
              </svg>
            </div>
            {spinning && (<div className="absolute inset-0 bg-white bg-opacity-0 cursor-wait" />)}
          </div>
        </div>
        {/* Entries/Results Panel */}
        <div className={`w-[325px] rounded-lg shadow px-3 py-4 min-h-[360px] mt-2 flex flex-col gap-2 border ${mode==='dark'? 'bg-[#212328] border-[#222]' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold">Entries <span className="bg-[#2d6a91] text-white text-xs px-2 ml-1 rounded">{entries.length}</span></div>
            <button className={ `text-xs px-2 py-1 bg-gray-100 rounded shadow-sm mr-1
                ${
                mode === 'dark' ? 'text-black' : 'text-gray-800'
                }
              `}>
              Results 
              <span className="ml-1 bg-gray-300 py-0.5 px-1 rounded">{results.length}</span></button>
            <button className="text-xs px-2 py-1 hover:bg-gray-100 rounded">Hide</button>
          </div>
          <div className="flex gap-2 mb-2">
            <button
              className={`bg-gray-200 text-xs font-bold px-2 py-1 rounded shadow-md 
                ${mode==='dark'? 'text-black' : 'text-gray-800'}
              `}
              onClick={() => {
                // Shuffle entries array
                const arr = [...entries];
                for (let i = arr.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                setEntries(arr);
                setInputText(arr.join("\n"));
              }}
            >Shuffle</button>

           <button
              className={`bg-gray-200 text-xs font-bold px-2 py-1 rounded shadow-md ${
                mode === 'dark' ? 'text-black' : 'text-gray-800'
              }`}
              onClick={() => {
                // Sort entries A-Z
                const arr = [...entries].sort((a, b) => a.localeCompare(b));
                setEntries(arr);
                setInputText(arr.join("\n"));
              }}
            >
              Sort
            </button>

            <button className={`bg-gray-200 text-xs font-bold  px-2 py-1 rounded shadow-md
              ${
                mode === 'dark' ? 'text-black' : 'text-gray-800'
              }
            `}>Add Image ▾</button>
            <label className="text-xs ml-auto flex items-center gap-1">
              <input type="checkbox" className="align-middle" /> Advanced
            </label>
          </div>
          <textarea
            className="border rounded p-2 w-full min-h-[160px] resize-none"
            style={{ fontFamily: "inherit", background: mode==='dark'? '#191b20' : '#fbfbfb', color: mode==='dark'? '#fff':'#222'}}
            value={inputText}
            onChange={handleEntriesChange}
          />
          <div className="text-xs text-gray-500 pt-2">Version 347 <span className="ml-1 bg-blue-100 px-1 py-0.5 text-blue-700 rounded">New!</span> <a href="#" className="ml-2 text-blue-600">Changelog</a></div>
          {/* Results List */}
          {results.length > 0 && (
            <div className="text-sm mt-3 pt-2 border-t">
              <b>Winners:</b>
              <ol className="pl-5">
                {results.map((name, ix) => (
                  <li key={name + ix}>{name}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
      {/* Winner Popup Modal and Firework */}
      {showPopup && winner && (
        <WinnerModal
          winner={winner}
          onClose={handleClosePopup}
          onRemove={handleRemoveWinner}
          mode={mode}
          winnerColor={PALETTE[entries.findIndex(entry => entry === winner) % PALETTE.length]}
        />
      )}
      <footer className="mt-8 mb-3 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} wheelofnames.com &bull; This is a clone demo
      </footer>
    </div>
  );
}

function TextOnArc({ text, startAngle, endAngle, radius, cx, cy, highlight }: any) {
  const angle = (startAngle + endAngle) / 2;
  const rad = degToRad(angle);
  const x = cx + (radius - Math.max(40, radius * 0.22)) * Math.cos(rad);
  const y = cy + (radius - Math.max(40, radius * 0.22)) * Math.sin(rad);
  // Text always radial, upright
  let textRotate = angle - 90;
  if (angle > 90 && angle < 270) {
    textRotate += 180;
  }
  const fontSize = Math.max(18, radius * 0.12);
  return (
    <text
      x={x}
      y={y}
      fontSize={fontSize}
      fontWeight={highlight ? 700 : 500}
      fill={highlight ? '#fff' : '#fff'}
      textAnchor="middle"
      alignmentBaseline="middle"
      transform={`rotate(${textRotate},${x},${y})`}
      style={{ filter: highlight ? "drop-shadow(0 0 3px #000)" : undefined, textShadow: highlight ? "0 3px 6px #000" : undefined }}
      pointerEvents="none"
      fontFamily="'Quicksand', Arial, sans-serif"
    >
      {text}
    </text>
  );
}
/** Winner Popup Modal & Firework/Confetti Canvas */
function WinnerModal({winner,onClose,onRemove,mode,winnerColor}:{winner:string,onClose:()=>void,onRemove:()=>void,mode:'light'|'dark',winnerColor:string}){
  React.useEffect(() => {
    startConfetti();

    // Play celebration sound
    const audio = new Audio('/celebration.mp3');
    audio.play().catch(err => console.log('Audio playback failed:', err));

    return () => {
      stopConfetti();
      // Cleanup audio
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Modal style tweaks
  const cardBg = mode==='dark'? '#202226' : '#222';
  const borderColor = mode==='dark'? '#283346' : '#d1d5db';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'rgba(0,0,0,0.50)'}}>
      {/* Confetti canvas always behind modal */}
      <canvas id="confetti-canvas" className="fixed inset-0 z-[49] pointer-events-none" style={{width:'100vw',height:'100vh'}} />
      <div
        className="z-[51] rounded-lg shadow-2xl border"
        style={{ 
          minWidth:480, 
          maxWidth:600, 
          background: cardBg, 
          borderColor, 
          boxShadow:'0 6px 32px #000a', 
          borderWidth:1, 
          padding:0, 
          position:'relative'}}
      >
        {/* Winner segment color header! */}
        <div className="rounded-t-lg flex items-center justify-between px-6 py-3 text-white text-lg font-bold"
          style={{background:winnerColor}}>
          <span>We have a winner!</span>
          <button
            className="ml-3 text-white bg-transparent hover:bg-blue-400/60 rounded-full text-xl flex items-center justify-center w-8 h-8 p-0"
            onClick={onClose} style={{ lineHeight:1 }}
            aria-label="Close winner popup"
          >×</button>
        </div>
        <div className="py-10 px-8 text-center text-white text-5xl" style={{fontWeight:500, letterSpacing:'0.01em'}}>{winner}</div>
        <div className="flex justify-end gap-3 pb-6 pr-7 pl-7 mt-0 text-base">
          <button className="px-4 py-2 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 font-medium" onClick={onClose}>Close</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold" onClick={onRemove}>Remove</button>
        </div>
      </div>
    </div>
  );
}

// Firework/confetti effect
function startConfetti(){
  if (window.confettiAnimationId) return;
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return; // Early return if context is null
  
  const num = 120;
  const COLORS = ['#ffd700','#ff6347','#00bfff','#e9b116','#d11729','#66c67d','#fff','#b674ea'];
  let conf = Array.from({length:num}).map(()=>({
    x:Math.random()*w,
    y:Math.random()*h*0.8,
    r:Math.random()*4+2,
    c:COLORS[Math.floor(Math.random()*COLORS.length)],
    vx:(Math.random()-0.5)*2,
    vy:Math.random()*3+1,
    a:Math.random()*3.14
  }));

  // Create a closure to capture non-null ctx
  function loop() {
    // TypeScript now knows ctx is not null inside this closure
    ctx!.clearRect(0,0,w,h);
    for(let i=0;i<conf.length;i++){
      let c=conf[i];
      ctx!.save();
      ctx!.globalAlpha=0.9;
      ctx!.fillStyle=c.c;
      ctx!.beginPath();
      ctx!.arc(c.x,c.y,c.r,0,6.29);
      ctx!.fill();
      ctx!.restore();
      c.x+=c.vx;
      c.y+=c.vy;
      c.a+=0.05;
      if(c.y>h) c.y=-(c.r+4),c.x=Math.random()*w;
    }
    window.confettiAnimationId=requestAnimationFrame(loop);
  }
  loop();
}
function stopConfetti(){
  if(window.confettiAnimationId){
    cancelAnimationFrame(window.confettiAnimationId);
    window.confettiAnimationId=null;
  }
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if(canvas) {const c=canvas.getContext('2d');c&&c.clearRect(0,0,canvas.width,canvas.height);}
}
// @ts-ignore
declare global { interface Window { confettiAnimationId?: number|null; } }
