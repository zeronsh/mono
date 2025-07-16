import { createChatSelector } from '@zeron/ai/react';
import { ThreadMessage } from '@zeron/ai/types';

export const useThreadSelector = createChatSelector<ThreadMessage>();
