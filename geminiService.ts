import { GoogleGenAI, Type } from "@google/genai";
import { MentorshipProfile, Mission, Lesson } from "./types";

/**
 * 💡 가이드라인 준수: API 키는 오직 process.env.API_KEY에서만 가져옵니다.
 */
const getAI = () => {
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

export const generateMentorDialogueSession = async (
  profile: MentorshipProfile,
  mission: Mission,
  lesson: Lesson,
  phase: 'INTRO' | 'OUTRO',
  nickname: string 
) => {
  const isIntro = phase === 'INTRO';
  
  // 챕터 1-1-1 고정 대본
  if (mission.id === '1-1' && isIntro && lesson.id === '1-1-1') {
    return [
      { speaker: "사라 사수", text: `안녕하세요, **${nickname}**님! 오늘부터 저와 함께 데이터 분석의 실무를 배우게 될 거예요.`, isUserTurn: false },
      { speaker: nickname, text: `네, 사라님! 잘 부탁드립니다. 대시보드 사례를 먼저 보고 싶어요.`, isUserTurn: true },
      { speaker: "사라 사수", text: `좋아요! 게임, HR, 세일즈 분야의 실제 대시보드들을 준비했어요. 링크를 클릭해 확인해보세요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `[게임 로그 대시보드](https://public.tableau.com/app/profile/.83057946/viz/12-3_GameLogDashboard_17534330076730/GameDashboard)`, isUserTurn: false },
      { speaker: "사라 사수", text: `다 보셨다면 가이드북에서 자세한 내용을 확인해볼까요?`, isUserTurn: false }
    ];
  }

  const ai = getAI();
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
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 시니어 BI 멘토 Sarah입니다. 다음 질문에 실무적인 답변을 해주세요: ${message}`,
    });
    return response.text || "죄송해요, 답변을 생성하지 못했어요.";
  } catch (error) {
    return "연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateLearningPath = async (p: any, g: any) => ({ proficiency: p, goal: g, recommendedMissionIds: ['1-1', '2-1'], customPlan: "최단기 실무 마스터 경로" });
