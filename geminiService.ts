
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
  
  if (mission.id === '1-1' && isIntro && lesson.id === '1-1-1') {
    return [
      { speaker: "사라 팀장", text: `반가워요, **${nickname}**님! 오늘부터 우리 팀의 데이터 분석 실무를 함께하게 됐네요. 준비 되셨나요?`, isUserTurn: false },
      { speaker: nickname, text: `네, 팀장님! 사실 긴장도 되지만, 실제 데이터가 어떻게 의사결정에 쓰이는지 정말 배우고 싶었습니다.`, isUserTurn: true },
      { speaker: "사라 팀장", text: `좋은 자세예요. 보통 신입 분석가들이 가장 많이 하는 실수가 '예쁜 차트'를 만드는 데만 매몰되는 거거든요.`, isUserTurn: false },
      { speaker: "사라 팀장", text: `하지만 실무는 차갑죠. 우리가 만든 대시보드 하나에 마케팅 예산 수억 원이 왔다 갔다 하니까요.`, isUserTurn: false },
      { speaker: nickname, text: `수억 원이나요? 단순한 보고서인 줄 알았는데, 책임감이 확 느껴지네요.`, isUserTurn: true },
      { speaker: "사라 팀장", text: `맞아요. 그래서 우리는 'Actionable'한 데이터를 봐야 해요. "그래서 우리가 뭘 해야 하는데?"라는 질문에 바로 답할 수 있어야 하죠.`, isUserTurn: false },
      { speaker: "사라 팀장", text: `자, 제가 실무에서 썼던 [게임 로그 대시보드](https://public.tableau.com/app/profile/.83057946/viz/12-3_GameLogDashboard_17534330076730/GameDashboard) 링크를 드릴게요. 이걸 보면서 한 번 생각해보세요.`, isUserTurn: false },
      { speaker: nickname, text: `오, 신기하네요! 대시보드가 정말 역동적이에요. 유저들의 실시간 움직임이 다 보이는 것 같아요.`, isUserTurn: true },
      { speaker: "사라 팀장", text: `그렇죠? 이 대시보드에서 만약 '매출이 갑자기 떨어졌다'면, 사장님은 어떤 차트를 제일 먼저 보실까요?`, isUserTurn: false },
      { speaker: nickname, text: `음... 아무래도 '날짜별 결제 유저 수'나 '이탈 유저 비율' 아닐까요?`, isUserTurn: true },
      { speaker: "사라 팀장", text: `정답이에요! 그게 바로 지표 설계의 핵심이죠. 이제 가이드북을 열어서 구체적인 설계 원칙을 학습해볼까요?`, isUserTurn: false }
    ];
  }

  const ai = getAI();
  const prompt = `
  현재 페이즈: ${phase === 'INTRO' ? '업무 시작 전 브리핑' : '업무 완료 후 피드백'}
  사용자 목표: ${profile.industry} 산업의 ${profile.role} 지망
  레슨 주제: ${lesson.title}
  
  위 맥락에 맞춰 ${nickname} 사원에게 줄 **최소 11개 이상의 상세한 대화문**을 생성해 주세요. 
  사용자의 턴(isUserTurn: true)을 4~5회 섞어 실무 메신저 같은 대화를 만드세요.
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
    return [{ speaker: "사라 팀장", text: "잠시 연결이 원활하지 않네요. 가이드북을 먼저 확인해주시겠어요?", isUserTurn: false }];
  }
};

export const askMentor = async (message: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + " 실무적인 해결책을 제시하고 격려를 덧붙이세요.",
      }
    });
    return response.text || "질문에 답변을 생성하지 못했습니다.";
  } catch (error) {
    return "서버 오류입니다. 잠시 후 시도해주세요.";
  }
};

export const generateLearningPath = async (p: any, g: any) => ({ proficiency: p, goal: g, recommendedMissionIds: ['1-1', '2-1'], customPlan: "실무 데이터 기반 의사결정 역량 강화" });
