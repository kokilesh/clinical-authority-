/**
 * Telegram Bot Helper — generates single-use (member_limit=1) invite links
 * routed to the correct channel based on course selection.
 *
 * Links expire 15 minutes after generation.
 *
 * Pharmacology → TELEGRAM_CHANNEL_ID_PHARMA
 * Pathology    → TELEGRAM_CHANNEL_ID_PATHO
 * Combined     → both channels (student clicks each separately)
 */

const VALID_COURSES = ['Pharmacology', 'Pathology', 'Combined'] as const;
type Course = typeof VALID_COURSES[number];

const CHANNEL_ENV_MAP: Record<string, string> = {
  Pharmacology: 'TELEGRAM_CHANNEL_ID_PHARMA',
  Pathology: 'TELEGRAM_CHANNEL_ID_PATHO',
};

/**
 * Create a single invite link for one specific channel.
 * Link expires in 15 minutes.
 */
async function createSingleInviteLink(
  botToken: string,
  chatId: string,
  studentName: string,
  channelLabel: string,
): Promise<string> {
  const expireDate = Math.floor(Date.now() / 1000) + 60 * 15; // 15 minutes
  const linkName = `${studentName.slice(0, 20)} — ${channelLabel}`.trim();

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/createChatInviteLink`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: Number(chatId),
        name: linkName,
        member_limit: 1,
        expire_date: expireDate,
        creates_join_request: false,
      }),
    },
  );

  const data = await response.json();

  if (data.ok && data.result?.invite_link) {
    return data.result.invite_link;
  }

  // Log error without leaking bot token
  console.error(
    `[Telegram] createChatInviteLink failed for channel ${channelLabel}:`,
    { ok: data.ok, error_code: data.error_code, description: data.description },
  );
  throw new Error(
    `Telegram API error for ${channelLabel}: ${data.description || 'unknown'}`,
  );
}

/**
 * Generate a single invite link for a specific channel on demand.
 * Called at click-time from the success page, not at payment-time.
 */
export async function generateSingleChannelLink(
  studentName: string,
  channel: string,
): Promise<string> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('TELEGRAM_BOT_TOKEN is not configured.');
  }

  const envKey = CHANNEL_ENV_MAP[channel];
  if (!envKey) {
    throw new Error(`Invalid channel: "${channel}"`);
  }

  const chatId = process.env[envKey];
  if (!chatId) {
    throw new Error(`${envKey} is not configured in .env.local.`);
  }

  return createSingleInviteLink(botToken, chatId, studentName, channel);
}

/**
 * Determine which channels a course grants access to.
 */
export function getChannelsForCourse(courseSelected: string): string[] {
  if (!VALID_COURSES.includes(courseSelected as Course)) {
    throw new Error(`Invalid course selection: "${courseSelected}"`);
  }

  if (courseSelected === 'Combined') {
    return ['Pharmacology', 'Pathology'];
  }
  return [courseSelected];
}
