const { BedrockRuntimeClient, ConverseCommand } = require('@aws-sdk/client-bedrock-runtime');

const client = new BedrockRuntimeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const SYSTEM_PROMPT =
  'You are a ticket classifier. Return ONLY a valid JSON object with: ' +
  'title (5-8 word string), summary (one sentence string), ' +
  'type (one of Bug/Issue/Update), priority (one of Low/Medium/High). ' +
  'Bug = broken/error. Issue = problem/concern. Update = feature request or information.';

async function classifyEmail({ subject, body }) {
  try {
    const response = await client.send(new ConverseCommand({
      modelId: 'openai.gpt-oss-120b-1:0',
      system: [{ text: SYSTEM_PROMPT }],
      messages: [
        {
          role: 'user',
          content: [{ text: `Subject: ${subject}\nBody: ${body}` }],
        },
      ],
      inferenceConfig: { maxTokens: 256 },
    }));

    const textBlock = response.output.message.content.find(c => c.text !== undefined);
    const raw = textBlock.text.trim();
    // Strip markdown code fences if present
    const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const parsed = JSON.parse(jsonStr);

    return {
      title:    parsed.title    || subject,
      summary:  parsed.summary  || '',
      type:     ['Bug', 'Issue', 'Update'].includes(parsed.type) ? parsed.type : 'Unclassified',
      priority: ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Low',
    };
  } catch (err) {
    console.error('Classification error:', err.message);
    return { title: subject, summary: '', type: 'Unclassified', priority: 'Low' };
  }
}

module.exports = { classifyEmail };
