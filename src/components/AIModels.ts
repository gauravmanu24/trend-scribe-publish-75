
export const freeAiModels = [
  { value: "google/gemini-2.0-flash-thinking-exp:free", label: "Gemini 2.0 Flash Thinking" },
  { value: "google/gemini-2.0-flash-thinking-exp-1219:free", label: "Gemini 2.0 Flash Thinking 1219" },
  { value: "nvidia/llama-3.1-nemotron-ultra-253b-v1:free", label: "Nemotron Ultra 253B" },
  { value: "nvidia/llama-3.3-nemotron-super-49b-v1:free", label: "Nemotron Super 49B" },
  { value: "moonshotai/moonlight-16b-a3b-instruct:free", label: "Moonlight 16B" },
  { value: "nvidia/llama-3.1-nemotron-70b-instruct:free", label: "Nemotron 70B" },
  { value: "nvidia/llama-3.1-nemotron-nano-8b-v1:free", label: "Nemotron Nano 8B" },
  { value: "nousresearch/deephermes-3-llama-3-8b-preview:free", label: "DeepHermes 3 LLaMA 8B" },
  { value: "google/gemini-2.0-flash-exp:free", label: "Gemini 2.0 Flash" },
  { value: "google/learnlm-1.5-pro-experimental:free", label: "LearnLM 1.5 Pro" },
  { value: "google/gemini-2.5-pro-exp-03-25:free", label: "Gemini 2.5 Pro" },
  { value: "meta-llama/llama-3.2-11b-vision-instruct:free", label: "LLaMA 3.2 11B Vision" },
  { value: "mistralai/mistral-small-3.1-24b-instruct:free", label: "Mistral Small 24B" },
  { value: "deepseek/deepseek-r1-distill-llama-70b:free", label: "DeepSeek R1 LLaMA 70B" },
  { value: "qwen/qwen2.5-vl-32b-instruct:free", label: "Qwen 2.5 VL 32B" },
  { value: "qwen/qwen2.5-vl-72b-instruct:free", label: "Qwen 2.5 VL 72B" },
  { value: "deepseek/deepseek-r1-distill-qwen-32b:free", label: "DeepSeek R1 Qwen 32B" },
  { value: "deepseek/deepseek-r1-distill-qwen-14b:free", label: "DeepSeek R1 Qwen 14B" },
  { value: "qwen/qwen2.5-vl-3b-instruct:free", label: "Qwen 2.5 VL 3B" },
  { value: "meta-llama/llama-3.3-70b-instruct:free", label: "LLaMA 3.3 70B" },
  { value: "qwen/qwen-2.5-vl-7b-instruct:free", label: "Qwen 2.5 VL 7B" },
  { value: "mistralai/mistral-7b-instruct:free", label: "Mistral 7B" },
  { value: "meta-llama/llama-3.2-3b-instruct:free", label: "LLaMA 3.2 3B" },
  { value: "meta-llama/llama-3.2-1b-instruct:free", label: "LLaMA 3.2 1B" },
  { value: "meta-llama/llama-3.1-8b-instruct:free", label: "LLaMA 3.1 8B" },
  { value: "deepseek/deepseek-v3-base:free", label: "DeepSeek V3 Base" },
  { value: "deepseek/deepseek-chat-v3-0324:free", label: "DeepSeek Chat V3" },
  { value: "deepseek/deepseek-r1-zero:free", label: "DeepSeek R1 Zero" },
  { value: "qwen/qwen-2.5-coder-32b-instruct:free", label: "Qwen 2.5 Coder 32B" },
  { value: "mistralai/mistral-small-24b-instruct-2501:free", label: "Mistral Small 24B 2501" },
  { value: "bytedance-research/ui-tars-72b:free", label: "UI Tars 72B" },
  { value: "huggingfaceh4/zephyr-7b-beta:free", label: "Zephyr 7B Beta" },
  { value: "meta-llama/llama-4-maverick:free", label: "LLaMA 4 Maverick" },
  { value: "deepseek/deepseek-chat:free", label: "DeepSeek Chat" },
  { value: "qwen/qwq-32b-preview:free", label: "QWQ 32B Preview" },
  { value: "sophosympatheia/rogue-rose-103b-v0.2:free", label: "Rogue Rose 103B" },
  { value: "meta-llama/llama-4-scout:free", label: "LLaMA 4 Scout" },
  { value: "allenai/molmo-7b-d:free", label: "MOLMO 7B" },
  { value: "google/gemma-3-27b-it:free", label: "Gemma 3 27B IT" },
  { value: "qwen/qwen-2.5-7b-instruct:free", label: "Qwen 2.5 7B" },
  { value: "google/gemma-3-1b-it:free", label: "Gemma 3 1B IT" },
  { value: "google/gemma-2-9b-it:free", label: "Gemma 2 9B IT" }
];

export const paidAiModels = [
  { value: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet" },
  { value: "anthropic/claude-3-opus:beta", label: "Claude 3 Opus" },
  { value: "anthropic/claude-3-sonnet:beta", label: "Claude 3 Sonnet" },
  { value: "anthropic/claude-3-haiku:beta", label: "Claude 3 Haiku" },
  { value: "google/gemini-1.5-pro", label: "Gemini 1.5 Pro" },
  { value: "google/gemini-pro", label: "Gemini Pro" },
  { value: "openai/gpt-4o", label: "GPT-4o" },
  { value: "openai/gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "meta-llama/llama-3-70b-instruct", label: "Llama 3 70B" },
  { value: "anthropic/claude-instant-v1", label: "Claude Instant" }
];

export interface APIService {
  id: string;
  name: string;
  description: string;
  url: string;
  logoUrl?: string;
  configFields: {
    name: string;
    label: string;
    type: "text" | "password" | "select";
    placeholder?: string;
    options?: { value: string; label: string }[];
    required: boolean;
  }[];
}

export const apiServices: APIService[] = [
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "Access many AI models through a unified API",
    url: "https://openrouter.ai",
    logoUrl: "https://openrouter.ai/favicon.ico",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-or-...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: paidAiModels
      }
    ]
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Direct access to GPT models and DALL·E",
    url: "https://platform.openai.com",
    logoUrl: "https://openai.com/favicon.ico",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: [
          { value: "gpt-4o", label: "GPT-4o" },
          { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" }
        ]
      }
    ]
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Claude models for safe and helpful AI assistants",
    url: "https://console.anthropic.com",
    logoUrl: "https://www.anthropic.com/favicon.ico",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "sk-ant-...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: [
          { value: "claude-3-5-sonnet", label: "Claude 3.5 Sonnet" },
          { value: "claude-3-opus", label: "Claude 3 Opus" },
          { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
          { value: "claude-3-haiku", label: "Claude 3 Haiku" }
        ]
      }
    ]
  },
  {
    id: "groq",
    name: "Groq",
    description: "Ultra-fast LLM inference for real-time applications",
    url: "https://console.groq.com",
    logoUrl: "https://groq.com/favicon.ico",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "gsk_...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: [
          { value: "llama-3-8b-8192", label: "LLaMA-3-8B" },
          { value: "llama-3-70b-8192", label: "LLaMA-3-70B" },
          { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B" },
          { value: "gemma-7b-it", label: "Gemma 7B" }
        ]
      }
    ]
  },
  {
    id: "deepinfra",
    name: "DeepInfra",
    description: "Deploy and serve open-source AI models at scale",
    url: "https://deepinfra.com",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: [
          { value: "meta-llama/Llama-3-70b-chat-hf", label: "LLaMA-3-70B" },
          { value: "meta-llama/Llama-3-8b-chat-hf", label: "LLaMA-3-8B" },
          { value: "mistralai/Mistral-7B-Instruct-v0.2", label: "Mistral 7B" }
        ]
      }
    ]
  },
  {
    id: "cohere",
    name: "Cohere",
    description: "Natural language understanding and generation",
    url: "https://dashboard.cohere.com",
    configFields: [
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "...",
        required: true
      },
      {
        name: "model",
        label: "Model",
        type: "select",
        required: true,
        options: [
          { value: "command-r-plus", label: "Command R+" },
          { value: "command-r", label: "Command R" },
          { value: "command-light", label: "Command Light" }
        ]
      }
    ]
  }
];
