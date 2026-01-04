import { GoogleGenAI, Type } from "@google/genai";
import { MentorshipProfile, Mission, Lesson } from "./types";

/**
 * 💡 가이드라인 준수: API 키는 오직 process.env.API_KEY에서만 가져옵니다.
 * Vite define 설정을 통해 브라우저에서도 안전하게 접근 가능합니다.
 */
const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const SYSTEM_INSTRUCTION = `
당신은 10년 차 시니어 BI 엔지니어이자 데이터 분석 팀장인 'Sarah'입니다. 
당신의 후배(Junior Data Analyst)인 사용자에게 실무를 가르치고 있습니다.
- 말투: 친절하지만 전문적이며, 비즈니스 임팩트를 강조합니다.
- 조언 스타일: 단순히 기능을 설명하기보다, "왜 이 지표가 중요한지", "의사결정권자가 무엇을 보고 싶어 할지"를 먼저 생각하게 합니다.
- 전문 분야: Tableau, SQL, 데이터 거버넌스, 지표 설계(Metric Hierarchy).
`;

export const generateMentorDialogueSession = async (
  profile: MentorshipProfile,
  mission: Mission,
  lesson: Lesson,
  phase: 'INTRO' | 'OUTRO',
  nickname: string 
) => {
  const isIntro = phase === 'INTRO';
  
  if (mission.id === '1-1' && isIntro && lesson.id === '1-1-1') {
    return [
      { speaker: "사라 사수", text: `안녕하세요, **${nickname}**님! 오늘부터 저와 함께 데이터 분석의 진짜 실무를 배우게 될 거예요.`, isUserTurn: false },
      { speaker: nickname, text: `네, 사라님! 잘 부탁드립니다. 실무에서 대시보드가 실제로 어떻게 쓰이는지 궁금해요.`, isUserTurn: true },
      { speaker: "사라 사수", text: `좋은 질문이에요. 단순히 예쁜 차트가 아니라 '돈을 벌어다 주는' 대시보드를 봐야 하거든요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `제가 준비한 [게임 로그 대시보드](https://public.tableau.com/app/profile/.83057946/viz/12-3_GameLogDashboard_17534330076730/GameDashboard)를 먼저 보세요. 유저가 어디서 이탈하는지 한눈에 보일 거예요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `다 보셨다면 가이드북에서 지표 설계의 원칙을 확인해 볼까요?`, isUserTurn: false }
    ];
  }

  const ai = getAI();
  const prompt = `현재 페이즈: ${phase === 'INTRO' ? '학습 시작 전 오리엔테이션' : '학습 완료 후 실무 요약'}. 사용자 목표: ${profile.industry}의 ${profile.role}. 주제: ${lesson.title}. ${nickname} 사원에게 줄 짧은 대화문 3개를 생성하세요.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dialogues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  text: { type: Type.STRING },
                  isUserTurn: { type: Type.BOOLEAN }
                },
                required: ["speaker", "text", "isUserTurn"]
              }
            }
          },
          required: ["dialogues"]
        }
      }
    });
    
    const result = JSON.parse(response.text || '{"dialogues": []}');
    return result.dialogues;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [{ speaker: "사라 사수", text: "잠시 연결이 원활하지 않네요. 가이드북을 먼저 확인해보시겠어요?", isUserTurn: false }];
  }
};

export const askMentor = async (message: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + " 답변 끝에 주니어 분석가가 성장할 수 있는 응원 한마디를 덧붙여주세요.",
      }
    });
    return response.text || "죄송해요, 답변을 생성하지 못했어요.";
  } catch (error) {
    return "연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateLearningPath = async (p: any, g: any) => ({ proficiency: p, goal: g, recommendedMissionIds: ['1-1', '2-1'], customPlan: "최단기 실무 마스터 경로" });
