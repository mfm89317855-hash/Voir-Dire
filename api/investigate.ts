import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const isValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);
const ai = isValidKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getFallbackReport(student: any) {
  if (student.isPlant === 'A') {
    return {
      summary:
        "Marcus Vance was flagged due to an unnatural 19s and 24s completion speed on complex algorithmic proofs (Q7 & Q9) paired with instantaneous multi-line clipboard pastes. Cross-referencing telemetry across data sources confirms that his code has a 98.7% identical match with peer Elena Rostova (including a shared variable typo `min_pivott_val`), submitted from an identical gateway IP address 4 minutes apart.",
      confidence_level: 'High',
      concern_verdict: 'High Concern (Substantiated)',
      evidence_for: [
        {
          source: 'Timing & Keystroke Telemetry',
          data_point: '19s on Q7, 24s on Q9 (class avg: 490s & 540s); 300+ chars pasted in <200ms',
          finding: 'Impossible manual composition speed; complete algorithmic solutions injected instantaneously without organic drafting.',
        },
        {
          source: 'Cohort Vector Similarity',
          data_point: '98.7% verbatim overlap with peer Elena Rostova',
          finding: 'Shared idiosyncratic variable naming (`min_pivott_val`) and custom helper routine not taught in syllabus.',
        },
        {
          source: 'Device & Network Correlation',
          data_point: 'Co-located IP: 198.51.100.42 shared with Elena Rostova',
          finding: 'Both students executed the exam on the same local physical network with a 4-minute submission lag.',
        },
        {
          source: 'Question Bank Health',
          data_point: 'Q7 & Q9 confirmed leaked on CourseHero repository 48h prior',
          finding: 'The exact two questions completed anomalously fast match leaked external answer keys.',
        },
      ],
      counter_evidence: [
        {
          source: 'Pacing Baseline',
          data_point: 'Normal timing on Questions 1 through 4 (62-180 seconds)',
          finding: 'The initial portion of the exam displays standard baseline pacing before the sudden anomaly on Q7.',
        },
      ],
      recommended_action:
        'Initiate formal academic integrity review. Interview Marcus and Elena together regarding shared network session and identical source code.',
    };
  } else if (student.isPlant === 'B') {
    return {
      summary:
        "Amina Chen was flagged automatically by a naive heuristic due to finishing in 14 minutes (vs. 45-minute limit). However, multi-source investigation refutes cheating: Amina has a 3.98 GPA, is a Putnam math competitor, maintained 100% active window focus with zero tab switches, typed at an organic 88 WPM with step-by-step scratchpad proofs, and has zero peer code overlap.",
      confidence_level: 'High',
      concern_verdict: 'Low Concern (False Positive)',
      evidence_for: [
        {
          source: 'Pacing Metric',
          data_point: '14 minutes total elapsed time (3.2x faster than cohort average)',
          finding: 'Triggered standard automated outlier threshold for swift completion.',
        },
      ],
      counter_evidence: [
        {
          source: 'Keystroke & Scratchpad Dynamics',
          data_point: '88 WPM continuous typing flow with 14 organic backspaces and integrated scratchpad proofs',
          finding: 'Reflects genuine real-time intellectual derivation rather than copying or external injection.',
        },
        {
          source: 'Session & Focus Events',
          data_point: '0 tab switches, 0 seconds blurred, continuous fullscreen lock',
          finding: 'Zero interaction with external software or secondary browser windows throughout entire session.',
        },
        {
          source: 'Student SIS Baseline',
          data_point: '3.98 cumulative GPA, past exam averages of 100%, 96%, 99%',
          finding: 'Pacing and flawless accuracy are completely concordant with established four-semester academic history.',
        },
        {
          source: 'Cohort Similarity Index',
          data_point: '0% peer overlap; matches standard Gallian/Strang canonical textbook proofs',
          finding: 'Answers represent classic mathematical rigor, not collusion or illicit answer repositories.',
        },
      ],
      recommended_action:
        'Clear flag immediately with no student penalty. Mark as an unproblematic false positive caused by exceptional student proficiency.',
    };
  } else if (student.isPlant === 'C') {
    return {
      summary:
        'Jordan Miller was flagged for an idle gap and lexical similarity on Question 6 following a window blur. Cross-source correlation reveals the blur coincided with campus library Wi-Fi DHCP drops and packet loss. While the essay phrasing matches open scientific definitions, it also matches standard biology textbooks. Evidence is ambiguous and does not justify an accusation.',
      confidence_level: 'Low',
      concern_verdict: 'Inconclusive / Mixed Evidence',
      evidence_for: [
        {
          source: 'Session Telemetry',
          data_point: '90s window blur at 02:20 PM followed by rapid prose typing',
          finding: 'Student left active browser view for 1.5 minutes prior to completing the complex essay section.',
        },
        {
          source: 'Similarity Engine',
          data_point: '62% lexical overlap with online open-access Nature Education summary',
          finding: 'Specific phrasing describing homology-directed repair mirrors online educational material.',
        },
      ],
      counter_evidence: [
        {
          source: 'Campus Network Infrastructure',
          data_point: 'Library West Wing Wi-Fi router recorded 68% packet loss and DHCP re-auth at 02:18 PM',
          finding: 'The window blur is corroborated by a documented physical network drop, consistent with reconnecting Wi-Fi.',
        },
        {
          source: 'Historical Performance',
          data_point: "83% test score is consistent with student's historical 3.10 GPA and 78-82% quiz trajectory",
          finding: 'No uncharacteristic performance leap; score aligns closely with prior unflagged work.',
        },
        {
          source: 'Keystroke Cadence',
          data_point: 'Organic typing cadence of 45 WPM with backspaces, not a sudden paste event',
          finding: 'Text was typed manually rather than copied directly from external clipboard.',
        },
      ],
      recommended_action:
        'Do not issue an academic penalty. Conduct an informal 5-minute verbal check-in to ask the student to explain the Q6 repair mechanism verbally.',
    };
  }

  return {
    summary: `${student.name}'s attempt exhibits standard pacing, expected error corrections, and healthy keystroke variation. No cross-student code matches or illicit network signatures were detected.`,
    confidence_level: 'High',
    concern_verdict: 'Low Concern (False Positive)',
    evidence_for: [
      { source: 'Pacing', data_point: `${student.timeTakenMin}m duration`, finding: 'Within normal bell-curve distribution.' },
    ],
    counter_evidence: [
      { source: 'Session Logs', data_point: 'Clean session telemetry', finding: 'No anomalous tab switching or focus loss.' },
      { source: 'Similarity Index', data_point: '< 35% lexical overlap', finding: 'Completely standard cohort dispersion.' },
    ],
    recommended_action: 'No action necessary. Maintain regular grade recording.',
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { student, quiz } = req.body;
    if (!student) {
      res.status(400).json({ error: 'Missing student data' });
      return;
    }

    if (ai) {
      try {
        const systemInstruction = `You are the Quiz Shield Investigator, an impartial forensic AI agent for academic quiz integrity investigations.
Your core principle: NEVER output merely a suspicion score or a blunt accusation. Explain WHY an attempt was flagged by systematically connecting findings across multiple data sources.
Always rigorously analyze BOTH sides:
1. Evidence suggesting unauthorized collaboration, external assistance, or illicit material.
2. Counter-evidence (mitigating factors, technical glitches, high baseline competency, standard textbook phrasing, organic typing).
If evidence is circumstantial or weak, state it explicitly and recommend no punitive accusation.
For Case B (fast, high-performing student), accurately identify it as "Low Concern (False Positive)" because speed aligns with verified academic competency and clean telemetry.
Return valid JSON matching the exact schema requested.`;

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Analyze this student quiz attempt and provide the forensic case report:\n${JSON.stringify(
            { student, quiz },
            null,
            2
          )}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description: 'Comprehensive cross-source synthesis explaining WHY it was flagged and what the evidence actually shows.',
                },
                confidence_level: {
                  type: Type.STRING,
                  description: 'Low, Medium, or High',
                },
                concern_verdict: {
                  type: Type.STRING,
                  description: 'Low Concern (False Positive), Inconclusive / Mixed Evidence, or High Concern (Substantiated)',
                },
                evidence_for: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      data_point: { type: Type.STRING },
                      finding: { type: Type.STRING },
                    },
                    required: ['source', 'data_point', 'finding'],
                  },
                },
                counter_evidence: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      source: { type: Type.STRING },
                      data_point: { type: Type.STRING },
                      finding: { type: Type.STRING },
                    },
                    required: ['source', 'data_point', 'finding'],
                  },
                },
                recommended_action: {
                  type: Type.STRING,
                  description: 'Concrete, fair, actionable guidance for the instructor.',
                },
              },
              required: [
                'summary',
                'confidence_level',
                'concern_verdict',
                'evidence_for',
                'counter_evidence',
                'recommended_action',
              ],
            },
          },
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timed out')), 8000)
        );

        const response = (await Promise.race([geminiPromise, timeoutPromise])) as any;

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          res.json({ source: 'gemini-3.8-flash', report: parsed });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out, using server fallback:', geminiError);
      }
    }

    // Fallback response if GEMINI_API_KEY is not set or failed
    const fallbackReport = getFallbackReport(student);
    res.json({ source: 'fallback-engine', report: fallbackReport });
  } catch (err: unknown) {
    console.error('Investigation error:', err);
    res.status(500).json({ error: 'Internal investigation server error' });
  }
}
