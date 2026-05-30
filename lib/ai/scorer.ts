import Anthropic from '@anthropic-ai/sdk';
import { ScoringResult } from '../../types';
import { SYSTEM_PROMPT, createUserPrompt } from './prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key_if_missing',
});

export async function scoreResume(
  resumeText: string,
  jdText: string
): Promise<ScoringResult> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 2000,
      temperature: 0.3,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: createUserPrompt(jdText, resumeText),
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    const responseText = content.text.trim();
    
    // Try to extract JSON if wrapped in markdown or extra text
    let jsonText = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }

    const result = JSON.parse(jsonText) as ScoringResult;

    // Validate required fields
    if (
      typeof result.matchScore !== 'number' ||
      !Array.isArray(result.matchedSkills) ||
      !Array.isArray(result.missingSkills) ||
      typeof result.summary !== 'string' ||
      !result.scoreBreakdown
    ) {
      throw new Error('Invalid response structure from Claude');
    }

    // Ensure matchScore is within bounds
    result.matchScore = Math.max(0, Math.min(100, Math.round(result.matchScore)));

    return result;
  } catch (error) {
    console.error('Error scoring resume:', error);
    
    // Return a fallback result if AI fails
    return {
      name: 'Unknown Candidate',
      email: undefined,
      phone: undefined,
      matchScore: 0,
      matchedSkills: [],
      missingSkills: ['Unable to analyze'],
      experienceYears: undefined,
      education: undefined,
      summary: 'Failed to analyze this resume. Please try again.',
      scoreBreakdown: {
        skillsMatch: 0,
        experienceRelevance: 0,
        educationAlignment: 0,
        keywordSimilarity: 0,
      },
    };
  }
}
