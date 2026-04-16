import { styled } from '@linaria/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme-constants';

type ChatWidgetEmbedProps = {
  workspaceId: string;
  widgetId: string;
  serverBaseUrl: string;
};

type WidgetConfig = {
  greetingMessage: string;
  accentColor: string;
  name: string;
  widgetPosition: 'BOTTOM_RIGHT' | 'BOTTOM_LEFT';
};

type ChatMessage = {
  id: string;
  body: string;
  senderType: 'VISITOR' | 'AGENT' | 'BOT';
  senderName: string | null;
  createdAt: string;
};

type WidgetState = 'closed' | 'loading-config' | 'open' | 'chatting';

const DEFAULT_ACCENT_COLOR = '#1961ed';

const POLLING_INTERVAL_MILLISECONDS = 3000;

// Styled components
// The bubble and window use inline styles for dynamic accentColor, since
// Linaria compiles at build time and cannot accept runtime props as CSS values.

const StyledChatBubble = styled.div`
  align-items: center;
  border: none;
  border-radius: 50%;
  bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  height: 56px;
  justify-content: center;
  position: fixed;
  right: 20px;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;
  width: 56px;
  z-index: 9999;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }
`;

const StyledChatWindow = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  bottom: 88px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  height: 520px;
  overflow: hidden;
  position: fixed;
  right: 20px;
  width: 380px;
  z-index: 9998;
`;

const StyledChatHeader = styled.div`
  align-items: center;
  color: #ffffff;
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledHeaderTitle = styled.span`
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledCloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  opacity: 0.8;
  padding: 0;
  transition: opacity 150ms ease;

  &:hover {
    opacity: 1;
  }
`;

const StyledMessageList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${themeCssVariables.spacing[2]};
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledMessageRow = styled.div<{ isVisitor: boolean }>`
  align-items: ${({ isVisitor }) => (isVisitor ? 'flex-end' : 'flex-start')};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StyledMessage = styled.div`
  border-radius: ${themeCssVariables.border.radius.sm};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
  max-width: 80%;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  word-wrap: break-word;
`;

const StyledVisitorMessage = styled(StyledMessage)`
  align-self: flex-end;
  color: #ffffff;
`;

const StyledAgentMessage = styled(StyledMessage)`
  align-self: flex-start;
  background: ${themeCssVariables.background.secondary};
  color: ${themeCssVariables.font.color.primary};
`;

const StyledMessageMeta = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.xxs};
  padding: 0 ${themeCssVariables.spacing[1]};
`;

const StyledInputArea = styled.div`
  align-items: center;
  border-top: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-shrink: 0;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledTextInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  flex-grow: 1;
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: border-color 150ms ease;

  &:focus {
    border-color: ${themeCssVariables.border.color.strong};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledSendButton = styled.button`
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledGreetingCard = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${themeCssVariables.spacing[4]};
  justify-content: center;
  padding: ${themeCssVariables.spacing[6]};
  text-align: center;
`;

const StyledGreetingText = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  line-height: 1.6;
  margin: 0;
`;

const StyledStartForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  padding: 0 ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[6]};
  width: 100%;
`;

const StyledFormInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  transition: border-color 150ms ease;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.border.color.strong};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledFormTextarea = styled.textarea`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: ${themeCssVariables.font.family};
  font-size: ${themeCssVariables.font.size.sm};
  min-height: 60px;
  outline: none;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  resize: vertical;
  transition: border-color 150ms ease;
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.border.color.strong};
  }

  &::placeholder {
    color: ${themeCssVariables.font.color.light};
  }
`;

const StyledStartButton = styled.button`
  border: none;
  border-radius: ${themeCssVariables.border.radius.sm};
  color: #ffffff;
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[4]};
  transition: opacity 150ms ease;
  width: 100%;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledLoadingIndicator = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-grow: 1;
  font-size: ${themeCssVariables.font.size.sm};
  justify-content: center;
`;

const StyledErrorText = styled.div`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.xs};
  text-align: center;
`;

// Chat bubble SVG icon (speech bubble)
const ChatBubbleIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
      fill="white"
    />
  </svg>
);

// Close icon (X)
const CloseIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Send icon (arrow up)
const SendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const formatTimestamp = (isoString: string): string => {
  try {
    const date = new Date(isoString);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

export const ChatWidgetEmbed = ({
  workspaceId,
  widgetId,
  serverBaseUrl,
}: ChatWidgetEmbedProps) => {
  const [widgetState, setWidgetState] = useState<WidgetState>('closed');
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pre-chat form fields
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  const messageListReference = useRef<HTMLDivElement>(null);
  const textInputReference = useRef<HTMLInputElement>(null);

  const baseApiUrl = `${serverBaseUrl}/chat/${workspaceId}/${widgetId}`;

  const accentColor = widgetConfig?.accentColor ?? DEFAULT_ACCENT_COLOR;

  // Scroll to the bottom of the message list whenever messages change
  useEffect(() => {
    if (isDefined(messageListReference.current)) {
      messageListReference.current.scrollTop =
        messageListReference.current.scrollHeight;
    }
  }, [messages]);

  // Focus the text input when entering chatting state
  useEffect(() => {
    if (widgetState === 'chatting' && isDefined(textInputReference.current)) {
      textInputReference.current.focus();
    }
  }, [widgetState]);

  // Poll for new messages while chatting
  useEffect(() => {
    if (widgetState !== 'chatting' || !isDefined(conversationId)) {
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${baseApiUrl}/messages/${conversationId}`,
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setMessages(data.messages ?? []);
      } catch {
        // Silently ignore polling errors to avoid disrupting the user
      }
    };

    // Fetch immediately on entering chatting state
    fetchMessages();

    const intervalId = setInterval(
      fetchMessages,
      POLLING_INTERVAL_MILLISECONDS,
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [widgetState, conversationId, baseApiUrl]);

  const fetchWidgetConfig = useCallback(async () => {
    setWidgetState('loading-config');
    setErrorMessage(null);

    try {
      const response = await fetch(`${baseApiUrl}/config`);

      if (!response.ok) {
        throw new Error('Failed to load chat widget configuration');
      }

      const data: WidgetConfig = await response.json();

      setWidgetConfig(data);
      setWidgetState('open');
    } catch (fetchError) {
      setErrorMessage(
        fetchError instanceof Error
          ? fetchError.message
          : 'Failed to load chat widget',
      );
      setWidgetState('open');
    }
  }, [baseApiUrl]);

  const handleBubbleClick = useCallback(() => {
    if (isDefined(widgetConfig)) {
      // Config already loaded, just reopen the window
      if (isDefined(conversationId)) {
        setWidgetState('chatting');
      } else {
        setWidgetState('open');
      }
    } else {
      fetchWidgetConfig();
    }
  }, [widgetConfig, conversationId, fetchWidgetConfig]);

  const handleCloseClick = useCallback(() => {
    setWidgetState('closed');
  }, []);

  const handleStartChat = useCallback(async () => {
    if (initialMessage.trim().length === 0) {
      return;
    }

    setIsSending(true);
    setErrorMessage(null);

    try {
      // Generate a unique session ID for this visitor
      const visitorSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const startResponse = await fetch(`${baseApiUrl}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorName:
            visitorName.trim().length > 0 ? visitorName.trim() : null,
          visitorEmail:
            visitorEmail.trim().length > 0 ? visitorEmail.trim() : null,
          visitorSessionId,
        }),
      });

      if (!startResponse.ok) {
        const errorData = await startResponse.json().catch(() => null);

        throw new Error(errorData?.message ?? 'Failed to start conversation');
      }

      const startData = await startResponse.json();
      const newConversationId = startData.conversationId;

      setConversationId(newConversationId);

      // Send the initial message as a separate request
      const messageResponse = await fetch(`${baseApiUrl}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: newConversationId,
          body: initialMessage.trim(),
          senderType: 'VISITOR',
          senderName: visitorName.trim().length > 0 ? visitorName.trim() : null,
        }),
      });

      if (messageResponse.ok) {
        setMessages([
          {
            id: `temp-${Date.now()}`,
            body: initialMessage.trim(),
            senderType: 'VISITOR',
            senderName:
              visitorName.trim().length > 0 ? visitorName.trim() : null,
            createdAt: new Date().toISOString(),
          },
        ]);
      }

      setInitialMessage('');
      setWidgetState('chatting');
    } catch (startError) {
      setErrorMessage(
        startError instanceof Error
          ? startError.message
          : 'Failed to start conversation',
      );
    } finally {
      setIsSending(false);
    }
  }, [baseApiUrl, visitorName, visitorEmail, initialMessage]);

  const handleSendMessage = useCallback(async () => {
    if (
      messageInput.trim().length === 0 ||
      isSending ||
      !isDefined(conversationId)
    ) {
      return;
    }

    const messageText = messageInput.trim();

    setIsSending(true);
    setMessageInput('');
    setErrorMessage(null);

    // Optimistically add the message to the list
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      body: messageText,
      senderType: 'VISITOR',
      senderName: visitorName.length > 0 ? visitorName : null,
      createdAt: new Date().toISOString(),
    };

    setMessages((previousMessages) => [...previousMessages, optimisticMessage]);

    try {
      const response = await fetch(`${baseApiUrl}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          body: messageText,
          senderType: 'VISITOR',
          senderName: visitorName.length > 0 ? visitorName : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(errorData?.message ?? 'Failed to send message');
      }

      // The next poll cycle will update messages from the server,
      // replacing the optimistic message
    } catch (sendError) {
      setErrorMessage(
        sendError instanceof Error
          ? sendError.message
          : 'Failed to send message',
      );
    } finally {
      setIsSending(false);
    }
  }, [messageInput, isSending, conversationId, visitorName, baseApiUrl]);

  const handleMessageInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  const handleStartFormKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleStartChat();
      }
    },
    [handleStartChat],
  );

  // Determine bubble position from widget config
  const bubblePositionStyle =
    widgetConfig?.widgetPosition === 'BOTTOM_LEFT'
      ? { left: 20, right: 'auto' }
      : {};

  const windowPositionStyle =
    widgetConfig?.widgetPosition === 'BOTTOM_LEFT'
      ? { left: 20, right: 'auto' }
      : {};

  // Render the closed state: just the bubble
  if (widgetState === 'closed') {
    return (
      <StyledChatBubble
        onClick={handleBubbleClick}
        style={{ backgroundColor: accentColor, ...bubblePositionStyle }}
        role="button"
        aria-label="Open chat"
      >
        <ChatBubbleIcon />
      </StyledChatBubble>
    );
  }

  // Render the loading config state
  if (widgetState === 'loading-config') {
    return (
      <>
        <StyledChatWindow style={windowPositionStyle}>
          <StyledChatHeader style={{ backgroundColor: accentColor }}>
            <StyledHeaderTitle>Chat</StyledHeaderTitle>
            <StyledCloseButton onClick={handleCloseClick} aria-label="Close">
              <CloseIcon />
            </StyledCloseButton>
          </StyledChatHeader>
          <StyledLoadingIndicator>Loading...</StyledLoadingIndicator>
        </StyledChatWindow>
        <StyledChatBubble
          onClick={handleCloseClick}
          style={{ backgroundColor: accentColor, ...bubblePositionStyle }}
          role="button"
          aria-label="Close chat"
        >
          <CloseIcon />
        </StyledChatBubble>
      </>
    );
  }

  // Render the open state (pre-chat form with greeting)
  if (widgetState === 'open') {
    return (
      <>
        <StyledChatWindow style={windowPositionStyle}>
          <StyledChatHeader style={{ backgroundColor: accentColor }}>
            <StyledHeaderTitle>
              {widgetConfig?.name ?? 'Chat with us'}
            </StyledHeaderTitle>
            <StyledCloseButton onClick={handleCloseClick} aria-label="Close">
              <CloseIcon />
            </StyledCloseButton>
          </StyledChatHeader>

          <StyledGreetingCard>
            <StyledGreetingText>
              {widgetConfig?.greetingMessage ??
                'Hi there! How can we help you today?'}
            </StyledGreetingText>

            {isDefined(errorMessage) && (
              <StyledErrorText>{errorMessage}</StyledErrorText>
            )}

            <StyledStartForm>
              <StyledFormInput
                type="text"
                placeholder="Name (optional)"
                value={visitorName}
                onChange={(event) => setVisitorName(event.target.value)}
              />
              <StyledFormInput
                type="email"
                placeholder="Email (optional)"
                value={visitorEmail}
                onChange={(event) => setVisitorEmail(event.target.value)}
              />
              <StyledFormTextarea
                placeholder="Type your message..."
                value={initialMessage}
                onChange={(event) => setInitialMessage(event.target.value)}
                onKeyDown={handleStartFormKeyDown}
              />
              <StyledStartButton
                onClick={handleStartChat}
                disabled={isSending || initialMessage.trim().length === 0}
                style={{ backgroundColor: accentColor }}
              >
                {isSending ? 'Starting...' : 'Start Chat'}
              </StyledStartButton>
            </StyledStartForm>
          </StyledGreetingCard>
        </StyledChatWindow>
        <StyledChatBubble
          onClick={handleCloseClick}
          style={{ backgroundColor: accentColor, ...bubblePositionStyle }}
          role="button"
          aria-label="Close chat"
        >
          <CloseIcon />
        </StyledChatBubble>
      </>
    );
  }

  // Render the chatting state
  return (
    <>
      <StyledChatWindow style={windowPositionStyle}>
        <StyledChatHeader style={{ backgroundColor: accentColor }}>
          <StyledHeaderTitle>
            {widgetConfig?.name ?? 'Chat with us'}
          </StyledHeaderTitle>
          <StyledCloseButton onClick={handleCloseClick} aria-label="Close">
            <CloseIcon />
          </StyledCloseButton>
        </StyledChatHeader>

        <StyledMessageList ref={messageListReference}>
          {messages.map((message) => {
            const isVisitor = message.senderType === 'VISITOR';

            return (
              <StyledMessageRow key={message.id} isVisitor={isVisitor}>
                {isVisitor ? (
                  <StyledVisitorMessage
                    style={{ backgroundColor: accentColor }}
                  >
                    {message.body}
                  </StyledVisitorMessage>
                ) : (
                  <StyledAgentMessage>{message.body}</StyledAgentMessage>
                )}
                <StyledMessageMeta>
                  {isDefined(message.senderName) &&
                  message.senderName.length > 0
                    ? `${message.senderName} - `
                    : ''}
                  {formatTimestamp(message.createdAt)}
                </StyledMessageMeta>
              </StyledMessageRow>
            );
          })}
        </StyledMessageList>

        {isDefined(errorMessage) && (
          <StyledErrorText>{errorMessage}</StyledErrorText>
        )}

        <StyledInputArea>
          <StyledTextInput
            ref={textInputReference}
            type="text"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            onKeyDown={handleMessageInputKeyDown}
            disabled={isSending}
          />
          <StyledSendButton
            onClick={handleSendMessage}
            disabled={isSending || messageInput.trim().length === 0}
            style={{ backgroundColor: accentColor }}
            aria-label="Send message"
          >
            <SendIcon />
          </StyledSendButton>
        </StyledInputArea>
      </StyledChatWindow>
      <StyledChatBubble
        onClick={handleCloseClick}
        style={{ backgroundColor: accentColor, ...bubblePositionStyle }}
        role="button"
        aria-label="Close chat"
      >
        <CloseIcon />
      </StyledChatBubble>
    </>
  );
};
