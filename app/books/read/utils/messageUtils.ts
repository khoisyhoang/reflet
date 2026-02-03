import { Message } from '../components/AiChatPanel'

export const processMessageUpdate = (prev: Message[], chunk: string) => {
  const newMessages = [...prev];
  const lastMessage = newMessages[newMessages.length - 1];
  if (lastMessage && lastMessage.sender === 'bot') {
    if (lastMessage.isTyping) {
      // Replace the typing indicator with the first chunk
      newMessages[newMessages.length - 1] = {
        text: chunk,
        sender: 'bot'
      };
    } else {
      // Append chunk to the existing bot message
      newMessages[newMessages.length - 1] = {
        ...lastMessage,
        text: lastMessage.text + chunk
      };
    }
  } else {
    // Add new bot message if last wasn't bot or doesn't exist
    newMessages.push({ text: chunk, sender: 'bot' });
  }
  return newMessages;
}
