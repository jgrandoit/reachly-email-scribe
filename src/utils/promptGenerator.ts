
export interface PromptConfig {
  framework: string;
  tone: string;
  customHook: string;
  product: string;
  audience: string;
  tier: string;
}

export const generateDualPrompts = (config: PromptConfig): { promptA: string; promptB: string } => {
  const { tone, customHook, product, audience } = config;
  
  const hookText = customHook || "We've been working with companies like yours and noticed some common challenges.";
  
  const baseInstructions = `You are a world-class cold email copywriter. Your emails convert because they feel personal, valuable, and human-written.

Target audience: ${audience}
Product/Service: ${product}
Write in a ${tone} tone that fits this audience.
Personal hook: ${hookText}

Write ONE compelling cold email under 100 words. Format with a compelling subject line followed by the email body.`;

  const promptA = `${baseInstructions}

Use the PERSUASIVE PITCH approach (AIDA framework):
- Attention: Start with something that grabs their attention
- Interest: Build interest in your solution
- Desire: Create desire for the outcome
- Action: Clear, specific call-to-action

Make it feel like it was written specifically for this person, not a mass email.`;

  const promptB = `${baseInstructions}

Use the PROBLEM-SOLUTION approach:
- Problem: Identify a specific pain point they likely face
- Solution: Present your offer as the direct solution
- Benefit: Highlight the key outcome they'll get
- Action: Simple, low-friction next step

Focus on problems that keep them up at night, then position your solution as the relief.`;

  return { promptA, promptB };
};

export const generatePrompt = (config: PromptConfig): string => {
  const { framework, tone, customHook, product, audience, tier } = config;
  
  const variantCount = tier === 'free' ? 2 : tier === 'starter' ? 3 : 5;
  const hookText = customHook || "We've been working with companies like yours and noticed some common challenges.";
  
  const baseInstructions = `You are a world-class cold email copywriter. Your emails convert because they feel personal, valuable, and human-written.

Target audience: ${audience}
Product/Service: ${product}
Write in a ${tone} tone that fits this audience.
Personal hook: ${hookText}

Write ${variantCount} distinct email variations. Each email should be under 100 words, clear, direct, and conversion-focused.
Format each email with a compelling subject line followed by the email body.`;

  switch (framework) {
    case 'aida':
      return `${baseInstructions}

Use the AIDA framework for each email:
- Attention: Start with something that grabs their attention
- Interest: Build interest in your solution
- Desire: Create desire for the outcome
- Action: Clear, specific call-to-action

Make each email feel like it was written specifically for this person, not a mass email.`;

    case 'pas':
      return `${baseInstructions}

Use the PAS framework for each email:
- Problem: Identify a specific pain point they likely face
- Agitate: Briefly highlight the cost of not solving it
- Solution: Present your offer as the solution

Focus on problems that keep them up at night, then position your solution as the relief.`;

    case 'four_sentence':
      return `${baseInstructions}

Use the 4-sentence cold email structure for each email:
1. Problem or pain point (that resonates with them)
2. How you help (specific outcome/benefit)
3. Quick credibility boost (social proof, result, or relevant experience)
4. Clear CTA (book a call, reply, visit link, etc.)

Keep each sentence punchy and valuable. No fluff.`;

    default:
      return `${baseInstructions}

Write compelling cold emails that follow proven copywriting principles. Focus on value, relevance, and clear next steps.`;
  }
};
