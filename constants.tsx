
import { Mission } from './types';

export const MISSIONS: Mission[] = [
  { 
    id: '1-1', 
    chapter: 'CH 1', 
    title: '[온라인 가이드북] BI 기초와 시각적 분석', 
    description: '데이터 분석가의 실무 기초를 다지는 과정입니다. BI의 본질적 가치부터 지표 설계, 시각화 원칙을 학습합니다.', 
    xpReward: 800, 
    isCompleted: false, 
    type: 'BI 기초',
    lessons: [
      {
        id: '1-1-1',
        title: '1-1. [BI 실무 기초] BI 실무 사례',
        description: '도메인별 대시보드 활용 사례(게임, HR, 세일즈)를 확인합니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-2',
        title: '1-2. [BI 실무 기초] BI의 필요성',
        description: '엑셀의 한계를 넘어 실시간 의사결정을 가능케 하는 BI의 가치를 배웁니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-3',
        title: '1-3. [BI 실무 기초] 데이터 시각화란?',
        description: '전주의적 속성과 데이터사우르스 예시를 통해 소통의 도구로서의 시각화를 이해합니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-4',
        title: '2-1. 분석 목적 세우기',
        description: '5가지 질문(Who, Why, What, How, When)으로 분석의 방향을 설정합니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-5',
        title: '2-2. Actionable 지표 구조 설계',
        description: 'Outcome, Driver, Actionable 지표로 이어지는 Metric Hierarchy를 구축합니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-6',
        title: '2-3. 실무 시각화 차트 3종 활용',
        description: '라인, 막대, 도넛 차트의 적재적소 활용법과 대시보드 배치 흐름을 익힙니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-7',
        title: '2-4. 시각화 원칙과 디자인 시스템',
        description: '데이터 잉크 비율을 높이고 노이즈를 최소화하는 디자인 디테일을 학습합니다.',
        xpReward: 100,
        sections: []
      },
      {
        id: '1-1-8',
        title: '2-5. 시각적 분석으로 인사이트 도출',
        description: '평가, 가설 나열, 드릴다운을 통해 심슨의 역설을 경계하며 결론을 냅니다.',
        xpReward: 100,
        sections: []
      }
    ]
  },
  {
    id: '2-1',
    chapter: 'CH 2',
    title: '[온라인 가이드북] Tableau 시작하기',
    description: '태블로 인터페이스와 핵심 개념을 익히고 유형별 실무 차트를 제작합니다.',
    xpReward: 1000,
    isCompleted: false, 
    type: '태블로 기초',
    lessons: [
      {
        id: '2-1-1',
        title: '1. BI 툴 태블로 인터페이스',
        description: '태블로의 주요 선반과 데이터 연결 방식을 익힙니다.',
        xpReward: 500,
        sections: []
      },
      {
        id: '2-1-2',
        title: '2. 실무 6종 차트 제작 실습',
        description: '이중축, 도넛, 트리맵 등 실무 활용도가 높은 차트를 직접 구현합니다.',
        xpReward: 500,
        sections: []
      }
    ]
  }
];
