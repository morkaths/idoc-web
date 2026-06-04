import { ChatbotView } from './_components/view';

export const metadata = {
  title: 'iDoc AI Assistant - Trợ lý AI thư viện',
  description:
    'AI Chatbot assistant for iDoc digital library to search books and get instant help.',
};

/**
 * Chatbot root page which renders the chatbot interface.
 */
export default function Page() {
  return <ChatbotView />;
}
