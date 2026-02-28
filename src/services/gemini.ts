import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing!");
      throw new Error("Chave de API do Gemini não encontrada. Configure a variável de ambiente GEMINI_API_KEY.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export async function generateOficioFromPrompt(userPrompt: string): Promise<string> {
  const systemInstruction = `
    Aja como um assistente administrativo experiente e profissional especializado em redação oficial.
    
    Sua tarefa é redigir ofícios, memorandos ou e-mails formais com base no pedido do usuário.
    
    Diretrizes:
    1.  **Estrutura:** Siga a estrutura padrão de redação oficial (Cabeçalho, Saudação, Corpo, Fechamento, Assinatura).
    2.  **Tom:** Mantenha um tom profissional, respeitoso e direto, adequado para comunicação corporativa ou governamental.
    3.  **Placeholders:** Se o usuário não fornecer nomes ou cargos específicos, use placeholders claros como "[Nome do Destinatário]", "[Cargo]", "[Data]", etc.
    4.  **Formatação:** Use espaçamento adequado.
    
    Se o usuário pedir algo que não seja um ofício ou e-mail formal, explique educadamente que sua função é criar documentos oficiais e tente ajudar da melhor forma possível dentro desse escopo.
    
    Retorne o texto do documento formatado.
  `;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemInstruction }] }, // Pre-prompting context
        { role: "user", parts: [{ text: `Pedido do usuário: ${userPrompt}` }] }
      ],
    });
    
    return response.text || "Erro ao gerar o texto. Tente novamente.";
  } catch (error) {
    console.error("Erro na geração:", error);
    if (error instanceof Error && error.message.includes("API Key")) {
      return "Erro de Configuração: Chave de API não encontrada. Por favor, configure a variável GEMINI_API_KEY no painel da Vercel.";
    }
    return "Ocorreu um erro ao conectar com a IA. Tente novamente mais tarde.";
  }
}
