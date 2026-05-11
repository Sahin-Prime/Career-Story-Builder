import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { EnhanceTextBody, SuggestSkillsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/ai/enhance", async (req, res): Promise<void> => {
  const parsed = EnhanceTextBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { type, context, jobTitle, existingText } = parsed.data;

  let systemPrompt = "";
  let userPrompt = "";

  if (type === "summary") {
    systemPrompt =
      "You are a professional resume writer. Write concise, impactful professional summaries that highlight achievements and value. Write in first person, present tense. 2-3 sentences max. No fluff.";
    userPrompt = `Write a professional summary for a ${jobTitle ?? "professional"}.${existingText ? ` Current draft: "${existingText}".` : ""} Context: ${context}. Return only the summary text, nothing else.`;
  } else if (type === "experience") {
    systemPrompt =
      "You are a professional resume writer. Write strong, quantified bullet points for work experience. Use action verbs. Focus on impact and achievements. Return 3-4 bullet points, each starting with a bullet (•).";
    userPrompt = `Write experience bullet points for this role/context: ${context}.${existingText ? ` Improve this existing description: "${existingText}"` : ""} Return only the bullet points, nothing else.`;
  } else if (type === "project") {
    systemPrompt =
      "You are a professional resume writer. Write a concise, impactful project description for a resume. 2-3 sentences highlighting what was built, technologies used, and impact. No fluff.";
    userPrompt = `Write a project description for: ${context}.${existingText ? ` Improve this: "${existingText}"` : ""} Return only the description, nothing else.`;
  } else {
    systemPrompt =
      "You are a professional resume writer. Write clear, compelling professional content for resumes. Be concise and impactful.";
    userPrompt = `Enhance this for a resume: ${context}.${existingText ? ` Current text: "${existingText}"` : ""} Return only the improved text.`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 512,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0]?.message?.content?.trim() ?? "";
  res.json({ text });
});

router.post("/ai/suggest-skills", async (req, res): Promise<void> => {
  const parsed = SuggestSkillsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { role, existingSkills } = parsed.data;

  const completion = await openai.chat.completions.create({
    model: "gpt-5.1",
    max_completion_tokens: 256,
    messages: [
      {
        role: "system",
        content:
          "You are a career advisor. Suggest relevant technical and soft skills for job roles. Return a JSON array of skill strings only. No explanations, no markdown. 10-15 skills.",
      },
      {
        role: "user",
        content: `Suggest skills for a ${role}.${existingSkills ? ` Already has: ${existingSkills}. Don't repeat these.` : ""} Return a JSON array like: ["Skill 1", "Skill 2", ...]`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content?.trim() ?? "[]";

  let skills: string[] = [];
  try {
    const match = content.match(/\[[\s\S]*\]/);
    skills = match ? JSON.parse(match[0]) : [];
  } catch {
    skills = [];
  }

  res.json({ skills });
});

export default router;
