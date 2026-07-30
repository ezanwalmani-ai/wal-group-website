export interface GmailMessage {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  bodyText?: string;
}

export async function listGmailMessages(
  accessToken: string,
  query?: string,
  maxResults = 15
): Promise<GmailMessage[]> {
  try {
    let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
    if (query && query.trim()) {
      url += `&q=${encodeURIComponent(query.trim())}`;
    }

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gmail API error (${res.status})`);
    }

    const data = await res.json();
    if (!data.messages || data.messages.length === 0) {
      return [];
    }

    // Fetch message headers/snippets in parallel
    const detailsPromises = data.messages.map((m: { id: string }) =>
      getGmailMessageDetails(accessToken, m.id)
    );

    const messages = await Promise.all(detailsPromises);
    return messages;
  } catch (err: any) {
    console.error('Error fetching Gmail messages:', err);
    throw err;
  }
}

export async function getGmailMessageDetails(
  accessToken: string,
  messageId: string
): Promise<GmailMessage> {
  try {
    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to fetch message details (${res.status})`);
    }

    const data = await res.json();
    const headers = data.payload?.headers || [];

    const getHeader = (name: string) =>
      headers.find((h: { name: string; value: string }) =>
        h.name.toLowerCase() === name.toLowerCase()
      )?.value || '';

    return {
      id: data.id,
      threadId: data.threadId,
      snippet: data.snippet || '',
      subject: getHeader('Subject') || '(No Subject)',
      from: getHeader('From') || 'Unknown Sender',
      to: getHeader('To') || 'Me',
      date: getHeader('Date') || ''
    };
  } catch (err: any) {
    console.error(`Error fetching message ${messageId}:`, err);
    return {
      id: messageId,
      threadId: messageId,
      snippet: 'Error loading message content.'
    };
  }
}

export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  try {
    // Construct standard RFC 2822 email format
    const emailLines = [
      `To: ${to}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      bodyText
    ];

    const emailRaw = emailLines.join('\r\n');

    // Base64url encode without padding
    const encodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedEmail
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Failed to send email via Gmail (${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Error sending email via Gmail:', err);
    throw err;
  }
}
