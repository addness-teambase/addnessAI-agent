'use client';

import React, { useEffect } from 'react';
import { useModel } from './ModelContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ModelProvider = 'openai' | 'claude' | 'gemini';

interface Model {
  id: string;
  provider: ModelProvider;
  name: string;
  displayName: string;
}

interface ModelWithAvailability extends Model {
  available: boolean;
}

// 環境変数をチェックしてAPIキーの有無を確認
const checkApiKeyAvailability = () => {
  // クライアントサイドでは実際の利用可能性を基に設定
  return {
    openai: false, // 現在開発中
    claude: false, // 現在開発中
    gemini: true,  // 利用可能
  };
};

const apiAvailability = checkApiKeyAvailability();

const models: ModelWithAvailability[] = [
  { id: 'gpt-5', provider: 'openai', name: 'gpt-5', displayName: 'GPT-5', available: apiAvailability.openai },
  { id: 'gpt-4.1', provider: 'openai', name: 'gpt-4.1', displayName: 'GPT-4.1', available: apiAvailability.openai },
  { id: 'gpt-4.1-mini', provider: 'openai', name: 'gpt-4.1-mini', displayName: 'GPT-4.1-mini', available: apiAvailability.openai },
  { id: 'claude-opus-4.1', provider: 'claude', name: 'claude-opus-4.1', displayName: 'Claude Opus 4.1', available: apiAvailability.claude },
  { id: 'claude-sonnet-4.5', provider: 'claude', name: 'claude-sonnet-4.5', displayName: 'Claude Sonnet 4.5', available: apiAvailability.claude },
  { id: 'gemini-2.5-pro', provider: 'gemini', name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', available: apiAvailability.gemini },
  { id: 'gemini-2.5-flash', provider: 'gemini', name: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', available: apiAvailability.gemini },
];

const providerConfig = {
  openai: { 
    label: 'OpenAI', 
    color: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-800 border-green-200'
  },
  claude: { 
    label: 'Anthropic', 
    color: 'text-orange-700',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  gemini: { 
    label: 'Google DeepMind', 
    color: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
};

export const ModelSelector = () => {
  const { currentModel, setCurrentModel } = useModel();

  const selectedModel = models.find(m => m.name === currentModel.modelName) || models[5];

  const handleModelChange = async (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    if (!model || !model.available) return;
    
    const newModelConfig = {
      provider: model.provider,
      modelName: model.name
    };
    
    // Contextの状態を更新
    setCurrentModel(newModelConfig);
    
    // Send model change to API
    try {
      await fetch('/api/set-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModelConfig),
      });
    } catch (error) {
      console.error('Failed to update model:', error);
    }
  };

  return (
    <Select value={selectedModel.id} onValueChange={handleModelChange}>
      <SelectTrigger className="w-[280px] h-9">
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${providerConfig[selectedModel.provider].badgeColor}`}>
              {providerConfig[selectedModel.provider].label}
            </span>
            <span className="text-sm font-medium">{selectedModel.displayName}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(
          models.reduce((acc, model) => {
            if (!acc[model.provider]) acc[model.provider] = [];
            acc[model.provider].push(model);
            return acc;
          }, {} as Record<ModelProvider, Model[]>)
        ).map(([provider, providerModels]) => (
          <div key={provider}>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {providerConfig[provider as ModelProvider].label}
            </div>
            {providerModels.map((model) => (
              <SelectItem 
                key={model.id} 
                value={model.id} 
                className="pl-6"
                disabled={!model.available}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className={model.available ? '' : 'opacity-50'}>{model.displayName}</span>
                    {!model.available && (
                      <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded">
                        開発中
                      </span>
                    )}
                  </div>
                  {selectedModel.id === model.id && (
                    <div className="w-2 h-2 bg-primary rounded-full ml-2"></div>
                  )}
                </div>
              </SelectItem>
            ))}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
};