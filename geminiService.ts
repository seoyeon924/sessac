import { GoogleGenAI, Type } from "@google/genai";
import { MentorshipProfile, Mission, Proficiency, CareerGoal, Lesson } from "./types";

/**
 * 💡 가이드라인 준수: API 키는 오직 process.env.API_KEY에서만 가져옵니다.
 * 브라우저 환경에서 process가 정의되지 않았을 경우를 대비해 안전하게 접근합니다.
 */
const getAPIKey = () => {
  try {
    // @ts-ignore
    return typeof process !== 'undefined' ? process.env.API_KEY : undefined;
  } catch (e) {
    return undefined;
  }
};

const API_KEY = getAPIKey();

/**
 * 멘토 Sarah와의 실무 오리엔테이션 시나리오 생성
 */
export const generateMentorDialogueSession = async (
  profile: MentorshipProfile,
  mission: Mission,
  lesson: Lesson,
  phase: 'INTRO' | 'OUTRO',
  nickname: string 
) => {
  const isIntro = phase === 'INTRO';
  
  // 챕터 1-1-1은 고정 대본으로 처리 (API 호출 절약 및 안정성)
  if (mission.id === '1-1' && isIntro && lesson.id === '1-1-1') {
    return [
      { speaker: "사라 사수", text: `안녕하세요, **${nickname}**님! 오늘부터 저와 함께 데이터 분석의 실무를 배우게 될 거예요.`, isUserTurn: false },
      { speaker: nickname, text: `네, 사라님! 잘 부탁드립니다. 대시보드 사례를 먼저 보고 싶어요.`, isUserTurn: true },
      { speaker: "사라 사수", text: `좋아요! 게임, HR, 세일즈 분야의 실제 대시보드들을 준비했어요. 링크를 클릭해 확인해보세요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `[게임 로그 대시보드](https://public.tableau.com/app/profile/.83057946/viz/12-3_GameLogDashboard_17534330076730/GameDashboard)`, isUserTurn: false },
      { speaker: "사라 사수", text: `다 보셨다면 가이드북에서 자세한 내용을 확인해볼까요?`, isUserTurn: false }
    ];
  }

  if (!API_KEY) {
    return [{ speaker: "시스템", text: "API_KEY가 설정되지 않았습니다. Netlify 환경 변수 설정을 확인해주세요.", isUserTurn: false }];
  }

  // 매 요청마다 새로운 인스턴스를 생성하여 최신 키 상태를 반영하도록 함 (가이드라인 권장)
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `당신은 시니어 BI 멘토 Sarah입니다. ${nickname}님과 "${lesson.title}"에 대해 대화하세요. 
  학생의 목표는 ${profile.role}이며 관심 산업은 ${profile.industry}입니다.
  친절하고 실무적인 조언을 담아 JSON 형식으로 3개 이내의 dialogues를 생성하세요.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
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
  if (!API_KEY) return "API_KEY가 설정되지 않아 답변을 드릴 수 없습니다. Netlify 환경 변수에 API_KEY를 추가해주세요.";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 시니어 BI 멘토 Sarah입니다. 다음 질문에 실무적인 답변을 해주세요: ${message}`,
    });
    return response.text || "죄송해요, 답변을 생성하지 못했어요.";
  } catch (error) {
    console.error("Gemini askMentor Error:", error);
    return "연결 오류가 발생했습니다. API 키가 유효한지 또는 프로젝트 할당량을 확인해주세요.";
  }
};

export const generateLearningPath = async (p: any, g: any) => ({ proficiency: p, goal: g, recommendedMissionIds: ['1-1', '2-1'], customPlan: "최단기 실무 마스터 경로" });