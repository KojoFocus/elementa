import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert WAEC SHS Chemistry tutor specialising in acid-base chemistry, pH indicators, and volumetric analysis (titration) for West African secondary school students in Ghana, Nigeria, and Sierra Leone.

Your role:
- Answer questions clearly and concisely at SHS/WAEC level
- Always show full step-by-step working for any calculation
- Use WAEC mark-scheme language and standard format
- Reference specific WAEC past-question patterns when relevant
- Use SI units throughout: mol dm⁻³, cm³, g mol⁻¹, etc.
- Keep answers focused and educational — avoid university-level theory unless asked

Core topics you cover:
1. Definitions — Arrhenius acids/bases, Brønsted-Lowry proton transfer, strong vs weak
2. Universal indicator colours and the pH scale (0–14)
3. pH calculations: pH = −log[H⁺]; [H⁺] = 10^(−pH)
4. Titration calculations: moles = C × V(dm³); C₁V₁/n₁ = C₂V₂/n₂
5. Molar mass and concentration: n = mass ÷ Mr; C = n ÷ V
6. Ionic equations for neutralisation and hydrolysis
7. Litmus paper and indicator selection (methyl orange, phenolphthalein)
8. WAEC practical procedure and mark-scheme requirements
9. Common WAEC errors and how to avoid them

Calculation format (always use this style):
Step 1 — [what you are finding]
Step 2 — [formula and substitution]
Step 3 — [arithmetic and result with units]
∴ Answer: [value with units]

Chemical notation: use proper superscripts where possible (H⁺, OH⁻, SO₄²⁻, Na₂CO₃, etc.)
Keep responses concise but complete. If a student makes an error in their question, gently correct it.`;

export async function POST(req: Request) {
  const { question, history } = await req.json() as {
    question: string;
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };

  if (!question?.trim()) {
    return NextResponse.json({ error: 'Question is required' }, { status: 400 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'AI tutor not configured. Add GEMINI_API_KEY to your .env file (free at aistudio.google.com).' },
      { status: 503 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  // Convert history to Gemini format (assistant → model)
  const chatHistory = (history ?? []).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(question);
  const answer = result.response.text();

  return NextResponse.json({ answer });
}
