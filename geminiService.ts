
import { GoogleGenAI, Type } from "@google/genai";
import { MentorshipProfile, Mission, Lesson } from "./types";

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
  
  // 챕터 1-1-1: 실무진 느낌의 10회 이상 대화 (Hardcoded for immersion)
  if (mission.id === '1-1' && isIntro && lesson.id === '1-1-1') {
    return [
      { speaker: "사라 사수", text: `반가워요, **${nickname}**님! 오늘부터 우리 팀의 데이터 분석 실무를 함께하게 됐네요. 준비 되셨나요?`, isUserTurn: false },
      { speaker: nickname, text: `네, 사라님! 첫 출근이라 긴장되는데 실무에서 데이터가 어떻게 쓰이는지 정말 궁금합니다.`, isUserTurn: true },
      { speaker: "사라 사수", text: `좋은 자세예요. 보통 신입 분석가들이 가장 많이 하는 실수가 '예쁜 차트'를 만드는 데만 집중하는 거예요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `하지만 실무는 달라요. 우리가 만든 대시보드 하나가 수억 원의 마케팅 예산을 결정하거든요.`, isUserTurn: false },
      { speaker: nickname, text: `수억 원이나요? 단순한 보고용인 줄 알았는데 책임감이 막중해지네요.`, isUserTurn: true },
      { speaker: "사라 사수", text: `맞아요. 그래서 우리는 'Actionable'한 데이터를 봐야 해요. 즉, '그래서 뭘 해야 하는데?'라는 질문에 답을 줄 수 있어야 하죠.`, isUserTurn: false },
      { speaker: "사라 사수", text: `자, 제가 예전에 만든 [게임 로그 대시보드](https://public.tableau.com/app/profile/.83057946/viz/12-3_GameLogDashboard_17534330076730/GameDashboard) 링크를 드릴게요. 이걸 보면서 생각해보세요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `이 대시보드에서 '유저 이탈'을 막기 위해 가장 먼저 확인해야 할 지표가 무엇 같나요?`, isUserTurn: false },
      { speaker: nickname, text: `음... 접속 시간이나 결제 금액일까요? 잠시만요, 링크 들어가서 직접 확인해볼게요!`, isUserTurn: true },
      { speaker: "사라 사수", text: `좋아요. 대시보드를 둘러보면서 **'비즈니스 임팩트'** 관점에서 숫자를 해석해보세요. 다 보셨으면 저에게 알려주세요.`, isUserTurn: false },
      { speaker: "사라 사수", text: `참, 가이드북의 1.1 섹션에 제가 정리해둔 실무 사례들도 꼭 병행해서 확인하시고요. 그럼 시작할까요?`, isUserTurn: false }
    ];
  }

  const ai = getAI();
  const prompt = `
  현재 페이즈: ${phase === 'INTRO' ? '업무 시작 전 브리핑' : '업무 완료 후 피드백'}
  사용자 목표: ${profile.industry} 산업의 ${profile.role} 지망
  레슨 주제: ${lesson.title}
  
  위 맥락에 맞춰 ${nickname} 사원에게 줄 **최소 10개 이상의 주고받는 대화문**을 생성해 주세요. 
  단순한 정보 전달이 아니라, 실무에서 시니어와 주니어가 메신저로 대화하는 듯한 현장감을 살려주세요.
  사용자의 턴(isUserTurn: true)도 적절히 섞어 자연스러운 대화 흐름을 만드세요.
  `;
  
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
    return [{ speaker: "사라 사수", text: "서연님, 잠시 서버 이슈가 있네요. 가이드북을 먼저 확인해주시겠어요?", isUserTurn: false }];
  }
};

export const askMentor = async (message: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + " 실무적인 조언을 곁들여 상세히 답변하고, 주니어를 격려하며 마무리하세요.",
      }
    });
    return response.text || "질문을 이해하지 못했어요. 다시 말씀해주시겠어요?";
  } catch (error) {
    return "연결 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const generateLearningPath = async (p: any, g: any) => ({ proficiency: p, goal: g, recommendedMissionIds: ['1-1', '2-1'], customPlan: "데이터 기반 의사결정 역량 강화 경로" });
