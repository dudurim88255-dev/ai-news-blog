// 카테고리별 네온 SVG 일러스트 (스크린샷 스타일)

function AiMlThumbnail() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-purple">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bg-ai" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#0d1535"/>
          <stop offset="100%" stopColor="#070d1f"/>
        </radialGradient>
        <radialGradient id="halo-ai" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25"/>
          <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* 배경 */}
      <rect width="400" height="240" fill="url(#bg-ai)"/>
      <ellipse cx="200" cy="110" rx="130" ry="90" fill="url(#halo-ai)"/>

      {/* 로봇 머리 */}
      <rect x="148" y="55" width="104" height="88" rx="12" fill="none" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow-purple)"/>
      {/* 바이저 눈 */}
      <rect x="160" y="82" width="80" height="16" rx="4" fill="none" stroke="#06b6d4" strokeWidth="1.5" filter="url(#glow-cyan)"/>
      <rect x="163" y="85" width="74" height="10" rx="2" fill="#06b6d4" opacity="0.3"/>
      {/* 눈 광점 */}
      <rect x="168" y="87" width="18" height="6" rx="1" fill="#38bdf8" opacity="0.8" filter="url(#glow-cyan)"/>
      <rect x="214" y="87" width="18" height="6" rx="1" fill="#38bdf8" opacity="0.8" filter="url(#glow-cyan)"/>
      {/* 입 / 스피커 격자 */}
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={163 + i*16} y="113" width="10" height="16" rx="1" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.6"/>
      ))}
      {/* 안테나 */}
      <line x1="186" y1="55" x2="186" y2="40" stroke="#8b5cf6" strokeWidth="1.5" filter="url(#glow-purple)"/>
      <circle cx="186" cy="38" r="4" fill="#a78bfa" filter="url(#glow-purple)"/>
      <line x1="214" y1="55" x2="214" y2="42" stroke="#06b6d4" strokeWidth="1.5" filter="url(#glow-cyan)"/>
      <circle cx="214" cy="40" r="3" fill="#38bdf8" filter="url(#glow-cyan)"/>

      {/* 회로 라인 - 좌 */}
      <path d="M148 90 H120 V130 H95" stroke="#8b5cf6" strokeWidth="1" fill="none" opacity="0.5"/>
      <circle cx="95" cy="130" r="3" fill="#8b5cf6" opacity="0.7"/>
      <path d="M148 110 H110" stroke="#06b6d4" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="110" cy="110" r="2" fill="#06b6d4" opacity="0.6"/>
      {/* 회로 라인 - 우 */}
      <path d="M252 90 H280 V125 H305" stroke="#a78bfa" strokeWidth="1" fill="none" opacity="0.5"/>
      <circle cx="305" cy="125" r="3" fill="#a78bfa" opacity="0.7"/>
      <path d="M252 115 H290" stroke="#06b6d4" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <circle cx="290" cy="115" r="2" fill="#06b6d4" opacity="0.6"/>

      {/* 신경망 노드 (하단) */}
      {[ [145,185],[172,195],[200,188],[228,195],[255,185],[200,210] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#06b6d4" filter="url(#glow-cyan)" opacity="0.8"/>
      ))}
      <polyline points="145,185 172,195 200,188 228,195 255,185" fill="none" stroke="#06b6d4" strokeWidth="0.8" opacity="0.4"/>
      <line x1="172" y1="195" x2="200" y2="210" stroke="#06b6d4" strokeWidth="0.6" opacity="0.3"/>
      <line x1="228" y1="195" x2="200" y2="210" stroke="#06b6d4" strokeWidth="0.6" opacity="0.3"/>

      {/* AI 텍스트 */}
      <text x="200" y="168" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="600" letterSpacing="4" opacity="0.6">A R T I F I C I A L   I N T E L L I G E N C E</text>
    </svg>
  );
}

function RoboticsThumbnail() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-pink">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-c2">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="halo-r" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#f472b6" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#070d1f"/>
      <ellipse cx="200" cy="100" rx="120" ry="80" fill="url(#halo-r)"/>

      {/* 휴머노이드 실루엣 */}
      {/* 머리 */}
      <rect x="172" y="30" width="56" height="46" rx="10" fill="none" stroke="#f472b6" strokeWidth="2" filter="url(#glow-pink)"/>
      {/* 눈 */}
      <circle cx="187" cy="52" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#glow-c2)"/>
      <circle cx="187" cy="52" r="3" fill="#38bdf8" opacity="0.9" filter="url(#glow-c2)"/>
      <circle cx="213" cy="52" r="7" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#glow-c2)"/>
      <circle cx="213" cy="52" r="3" fill="#38bdf8" opacity="0.9" filter="url(#glow-c2)"/>
      {/* 목 */}
      <rect x="192" y="76" width="16" height="14" rx="3" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      {/* 몸통 */}
      <rect x="158" y="90" width="84" height="70" rx="8" fill="none" stroke="#f472b6" strokeWidth="2" filter="url(#glow-pink)"/>
      {/* 가슴 코어 */}
      <rect x="180" y="106" width="40" height="28" rx="6" fill="none" stroke="#38bdf8" strokeWidth="1.5" filter="url(#glow-c2)"/>
      <circle cx="200" cy="120" r="8" fill="rgba(56,189,248,0.2)" stroke="#38bdf8" strokeWidth="1" filter="url(#glow-c2)"/>
      <circle cx="200" cy="120" r="3" fill="#38bdf8" opacity="0.9"/>

      {/* 왼쪽 팔 */}
      <rect x="125" y="92" width="32" height="14" rx="6" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <rect x="110" y="95" width="18" height="64" rx="6" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#glow-pink)"/>
      {/* 오른쪽 팔 */}
      <rect x="243" y="92" width="32" height="14" rx="6" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <rect x="272" y="95" width="18" height="64" rx="6" fill="none" stroke="#a855f7" strokeWidth="1.5" filter="url(#glow-pink)"/>

      {/* 다리 */}
      <rect x="165" y="162" width="26" height="55" rx="6" fill="none" stroke="#f472b6" strokeWidth="1.5"/>
      <rect x="209" y="162" width="26" height="55" rx="6" fill="none" stroke="#f472b6" strokeWidth="1.5"/>

      {/* 관절 원 */}
      {[ [136,98],[264,98],[165,162],[209,162],[158,220],[235,220] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="5" fill="none" stroke="#f472b6" strokeWidth="1.5" opacity="0.7" filter="url(#glow-pink)"/>
      ))}

      {/* ROBOT 텍스트 */}
      <text x="200" y="232" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="600" letterSpacing="5" opacity="0.5">H U M A N O I D   R O B O T</text>
    </svg>
  );
}

function FutureThumbnail() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-g">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1628"/>
          <stop offset="100%" stopColor="#070d1f"/>
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="55%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.2"/>
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky)"/>
      <ellipse cx="200" cy="140" rx="180" ry="90" fill="url(#sun-glow)"/>

      {/* 도시 스카이라인 */}
      <g opacity="0.7">
        <rect x="30" y="140" width="20" height="80" fill="#0d1a3a"/>
        <rect x="55" y="120" width="25" height="100" fill="#0f1e45"/>
        <rect x="85" y="100" width="18" height="120" fill="#0d1a3a"/>
        <rect x="108" y="110" width="22" height="110" fill="#111f47"/>
        <rect x="135" y="85" width="30" height="135" fill="#0f1e45"/>
        <rect x="170" y="70" width="22" height="150" fill="#0d1a3a"/>
        <rect x="197" y="90" width="25" height="130" fill="#111f47"/>
        <rect x="227" y="75" width="28" height="145" fill="#0f1e45"/>
        <rect x="260" y="95" width="20" height="125" fill="#0d1a3a"/>
        <rect x="285" y="115" width="24" height="105" fill="#111f47"/>
        <rect x="314" y="130" width="18" height="90" fill="#0d1a3a"/>
        <rect x="337" y="150" width="22" height="70" fill="#0f1e45"/>
      </g>

      {/* 빌딩 창문 (반짝이는) */}
      {[ [140,100],[143,115],[143,130],[175,82],[175,100],[202,105],[230,88],[230,105],[265,108],[290,125] ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill={i%2===0 ? "#34d399" : "#06b6d4"} opacity={0.4+Math.sin(i)*0.3}/>
      ))}

      {/* 자율주행 도로 (원근감) */}
      <path d="M200,240 L80,170 L0,165" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.4"/>
      <path d="M200,240 L320,170 L400,165" fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.4"/>
      <path d="M200,240 L200,165" fill="none" stroke="#34d399" strokeWidth="1" opacity="0.5"/>

      {/* 자율주행차 빛 */}
      <ellipse cx="160" cy="190" rx="12" ry="5" fill="#34d399" opacity="0.5" filter="url(#glow-g)"/>
      <ellipse cx="240" cy="195" rx="10" ry="4" fill="#06b6d4" opacity="0.5" filter="url(#glow-g)"/>

      {/* 연결 노드 (하늘) */}
      {[ [60,50],[120,35],[180,45],[240,30],[300,42],[360,55] ].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill="#34d399" opacity="0.7" filter="url(#glow-g)"/>
          {i < 5 && <line x1={x} y1={y} x2={[120,180,240,300,360][i]} y2={[35,45,30,42,55][i]} stroke="#34d399" strokeWidth="0.6" opacity="0.35"/>}
        </g>
      ))}

      {/* FUTURE 텍스트 */}
      <text x="200" y="232" textAnchor="middle" fill="#34d399" fontSize="10" letterSpacing="5" opacity="0.5">F U T U R E   C I T Y</text>
    </svg>
  );
}

function ScienceThumbnail() {
  const nodes = [
    [200,85],[165,105],[235,105],[145,130],[180,145],[200,130],[220,145],[255,130],[165,165],[235,165],[200,175],[145,90],[255,90],
  ];
  const edges = [
    [0,1],[0,2],[1,3],[1,4],[2,6],[2,7],[3,8],[4,8],[4,5],[5,6],[6,9],[7,9],[8,10],[9,10],[1,5],[2,5],[0,5],[3,11],[7,12],
  ];

  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-b">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="halo-s" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#070d1f"/>
      <ellipse cx="200" cy="130" rx="110" ry="80" fill="url(#halo-s)"/>

      {/* 뇌 실루엣 */}
      <path d="M200,60 C220,50 248,52 262,68 C278,62 292,76 288,94 C300,104 298,122 286,128 C290,146 278,160 263,156 C257,170 240,172 230,162 C222,172 210,170 204,160 C196,172 184,170 176,160 C170,172 153,168 148,156 C134,152 124,136 130,122 C116,116 118,98 130,90 C126,72 140,58 155,62 C166,50 188,50 200,60 Z"
            stroke="#38bdf8" strokeWidth="1.5" fill="rgba(56,189,248,0.05)" filter="url(#glow-b)"/>
      {/* 뇌 중앙선 */}
      <path d="M200,60 C200,85 200,110 200,162" stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="3,4" opacity="0.5"/>
      {/* 뇌 주름 */}
      <path d="M155,88 C162,98 158,112 165,120" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M245,90 C238,100 242,114 235,122" stroke="#38bdf8" strokeWidth="0.8" fill="none" opacity="0.4"/>
      <path d="M172,130 C178,140 172,150 180,155" stroke="#06b6d4" strokeWidth="0.7" fill="none" opacity="0.35"/>
      <path d="M228,130 C222,140 228,150 220,155" stroke="#06b6d4" strokeWidth="0.7" fill="none" opacity="0.35"/>

      {/* 신경망 엣지 */}
      <g stroke="#38bdf8" strokeWidth="0.7" opacity="0.35">
        {edges.map(([a,b],i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}/>
        ))}
      </g>

      {/* 신경망 노드 */}
      {nodes.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={i===0 ? 5 : 3}
          fill={i%3===0 ? "#38bdf8" : i%3===1 ? "#a78bfa" : "#34d399"}
          opacity="0.85" filter="url(#glow-b)"/>
      ))}

      {/* 전기 신호 점 */}
      {[ [150,105],[218,122],[178,152],[242,108] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" opacity="0.5"/>
      ))}

      <text x="200" y="232" textAnchor="middle" fill="#38bdf8" fontSize="10" letterSpacing="4" opacity="0.45">N E U R A L   B R A I N   N E T W O R K</text>
    </svg>
  );
}

function SocietyThumbnail() {
  const people = [ [120,80],[200,60],[280,80],[90,140],[160,130],[200,155],[240,130],[310,140],[155,195],[200,210],[245,195] ];
  const links = [ [0,4],[1,4],[1,5],[2,6],[3,4],[3,8],[4,5],[4,8],[5,6],[5,9],[6,7],[6,10],[7,10],[8,9],[9,10] ];

  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-y">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="halo-so" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="400" height="240" fill="#070d1f"/>
      <ellipse cx="200" cy="140" rx="160" ry="90" fill="url(#halo-so)"/>

      {/* 연결선 */}
      <g stroke="#fbbf24" strokeWidth="0.7" opacity="0.3">
        {links.map(([a,b],i) => (
          <line key={i} x1={people[a][0]} y1={people[a][1]} x2={people[b][0]} y2={people[b][1]}/>
        ))}
      </g>

      {/* 사람 아이콘 (머리+몸) */}
      {people.map(([x,y],i) => (
        <g key={i} filter="url(#glow-y)">
          <circle cx={x} cy={y} r="7" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.8"/>
          <path d={`M${x-8},${y+18} Q${x},${y+10} ${x+8},${y+18}`} fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.6"/>
          <circle cx={x} cy={y} r="2.5" fill="#fbbf24" opacity="0.9"/>
        </g>
      ))}

      {/* 연결 신호 */}
      {[ [160,95],[200,108],[240,95],[175,162] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fbbf24" opacity="0.4" filter="url(#glow-y)"/>
      ))}

      <text x="200" y="232" textAnchor="middle" fill="#fbbf24" fontSize="10" letterSpacing="4" opacity="0.45">S O C I E T Y   N E T W O R K</text>
    </svg>
  );
}

function ToolsThumbnail() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="glow-v">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="400" height="240" fill="#070d1f"/>

      {/* 회로 기판 PCB 선 */}
      <g stroke="#c084fc" strokeWidth="1" opacity="0.35">
        {/* 수평선 */}
        {[50,90,130,160,190,220].map((y,i) => (
          <line key={i} x1="30" y1={y} x2="370" y2={y}/>
        ))}
        {/* 수직선 */}
        {[60,100,140,180,220,260,300,340].map((x,i) => (
          <line key={i} x1={x} y1="30" x2={x} y2="220"/>
        ))}
        {/* 대각선 연결 */}
        <path d="M60,90 L100,50" fill="none"/>
        <path d="M180,90 L220,50" fill="none"/>
        <path d="M300,90 L340,50" fill="none"/>
        <path d="M140,160 L180,220" fill="none"/>
        <path d="M260,130 L300,160" fill="none"/>
      </g>

      {/* IC 칩 */}
      <rect x="140" y="80" width="60" height="80" rx="3" fill="rgba(192,132,252,0.08)" stroke="#c084fc" strokeWidth="1.5" filter="url(#glow-v)"/>
      {[0,1,2,3].map(i => (
        <g key={i}>
          <line x1="140" y1={97+i*18} x2="120" y2={97+i*18} stroke="#c084fc" strokeWidth="1.5"/>
          <line x1="200" y1={97+i*18} x2="220" y2={i*18+97} stroke="#c084fc" strokeWidth="1.5"/>
        </g>
      ))}
      <text x="170" y="124" textAnchor="middle" fill="#c084fc" fontSize="9" opacity="0.7">AI CHIP</text>

      {/* 저항 / 캐패시터 컴포넌트 */}
      <rect x="55" y="87" width="18" height="8" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1.2"/>
      <rect x="95" y="127" width="8" height="18" rx="2" fill="none" stroke="#38bdf8" strokeWidth="1.2"/>
      <rect x="255" y="87" width="18" height="8" rx="2" fill="none" stroke="#34d399" strokeWidth="1.2"/>
      <rect x="295" y="187" width="18" height="8" rx="2" fill="none" stroke="#fbbf24" strokeWidth="1.2"/>

      {/* 솔더 포인트 (납땜점) */}
      {[ [60,50],[100,50],[140,50],[180,50],[220,50],[260,50],[300,50],[340,50],
         [60,90],[100,130],[60,190],[260,130],[300,90],[340,130],
         [220,220],[260,190],[300,190],[340,190] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={i%3===0?"#c084fc":i%3===1?"#38bdf8":"#34d399"}
          strokeWidth="1.2" opacity="0.6" filter="url(#glow-v)"/>
      ))}

      {/* 활성 신호 점 */}
      {[ [60,90],[180,90],[300,90],[140,160],[220,160] ].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#c084fc" opacity="0.8" filter="url(#glow-v)"/>
      ))}

      <text x="200" y="232" textAnchor="middle" fill="#c084fc" fontSize="10" letterSpacing="4" opacity="0.45">A I   C I R C U I T   B O A R D</text>
    </svg>
  );
}

function DefaultThumbnail() {
  return <AiMlThumbnail />;
}

export function CategoryThumbnail({ category }: { category: string }) {
  switch (category) {
    case 'ai-ml':    return <AiMlThumbnail />;
    case 'robotics': return <RoboticsThumbnail />;
    case 'future':   return <FutureThumbnail />;
    case 'science':  return <ScienceThumbnail />;
    case 'society':  return <SocietyThumbnail />;
    case 'tools':    return <ToolsThumbnail />;
    default:         return <DefaultThumbnail />;
  }
}
