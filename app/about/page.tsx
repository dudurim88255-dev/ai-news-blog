import type { Metadata } from 'next';
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/seo';

export const metadata: Metadata = {
  title: '소개',
  description: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', fontWeight: 900, color: '#fff',
          margin: '0 auto 1.25rem',
        }}>AI</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#e8edf5' }}>{SITE_NAME}</h1>
        <p className="font-semibold" style={{ color: '#a78bfa' }}>{SITE_TAGLINE}</p>
      </div>

      <div className="space-y-8" style={{ color: '#c5d8f0', lineHeight: 1.9 }}>
        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#a78bfa' }}>이 블로그는?</h2>
          <p style={{ color: '#8b9cc8' }}>
            LLM, 로보틱스, 자율주행, 양자컴퓨팅… AI·테크 분야는 매일 새로운 뉴스가 쏟아집니다.
            {SITE_NAME}은 arXiv 최신 논문과 글로벌 AI 동향을 한국어로 빠르고 정확하게 전달합니다.
            지금 일어나는 일이 1년·5년·10년 뒤 세상을 어떻게 바꾸는지, 미래 예측까지 함께 다룹니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#a78bfa' }}>다루는 분야</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🤖', name: 'AI·머신러닝', desc: 'LLM, 멀티모달, 파운데이션 모델' },
              { emoji: '🦾', name: '로보틱스', desc: '휴머노이드, 자율주행, 드론' },
              { emoji: '🔮', name: '미래예측', desc: '기술 트렌드, 1·5·10년 예측' },
              { emoji: '🌐', name: '사회·경제', desc: 'AI의 일자리·산업·정책 영향' },
              { emoji: '⚛️', name: '과학·연구', desc: '딥테크, 양자컴퓨팅, 바이오AI' },
              { emoji: '🛠️', name: '툴·서비스', desc: '신규 AI 툴, 플랫폼, 스타트업' },
            ].map((item) => (
              <div key={item.name} style={{ background: '#0d1535', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: '12px 16px' }}>
                <div className="text-xl mb-1">{item.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: '#e8edf5' }}>{item.name}</div>
                <div className="text-xs" style={{ color: '#8b9cc8' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#a78bfa' }}>콘텐츠 방식</h2>
          <p style={{ color: '#8b9cc8' }}>
            모든 포스트는 arXiv 원문 논문 또는 공신력 있는 출처를 기반으로 작성됩니다.
            전문 용어는 괄호로 설명을 병기하며, 일반 독자도 이해할 수 있는 수준으로 풀어냅니다.
            원문 링크를 함께 제공해 직접 확인할 수 있도록 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3" style={{ color: '#a78bfa' }}>업데이트 주기</h2>
          <p style={{ color: '#8b9cc8' }}>
            arXiv 최신 논문을 매 6시간마다 자동 수집·발행합니다.
            중요한 뉴스나 이슈는 수동으로 빠르게 추가됩니다.
          </p>
        </section>
      </div>
    </div>
  );
}
