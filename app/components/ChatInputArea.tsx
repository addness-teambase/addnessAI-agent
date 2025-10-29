'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Mic, MicOff, ChevronDown, Search, Paperclip, X, FileText } from 'lucide-react';
import Image from 'next/image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Web Speech API の型定義
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatInputAreaProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, image?: File) => void;
  isLoading: boolean;
  isDeepResearchMode?: boolean;
  onDeepResearchModeChange?: (enabled: boolean) => void;
  isDifyMode?: boolean; // Difyモードかどうか
  isFileAnalysisMode?: boolean; // ファイル分析モードかどうか
  fileAnalysisType?: 'pdf' | 'excel'; // ファイル分析のタイプ
}

// ツールオプションの型定義
interface ToolOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const toolOptions: ToolOption[] = [
  {
    value: 'deep-research',
    label: 'Deep Research を実行する',
    icon: <Search className="h-4 w-4" />,
    description: '詳細な調査と分析を行います'
  },
  {
    value: 'enhanced-research',
    label: 'Enhanced Deep Research',
    icon: <Search className="h-4 w-4" />,
    description: 'LangGraph-style advanced research with source validation'
  }
];

export const ChatInputArea = ({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  isDeepResearchMode = false,
  onDeepResearchModeChange,
  isDifyMode = false,
  isFileAnalysisMode = false,
  fileAnalysisType
}: ChatInputAreaProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string>('');
  const [lastEnterTime, setLastEnterTime] = useState<number>(0);
  const [enterCount, setEnterCount] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 画像だけでなく全てのファイルを扱う
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null); // 画像の場合のみ使用
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // textareaの高さを自動調整
  const adjustTextareaHeight = () => {
    if (textareaRef.current && typeof window !== 'undefined') {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const minHeight = 52; // 最小高さ（約2行分）
      // モバイルでは少し低めに設定
      const isMobile = window.innerWidth < 768;
      const maxHeight = isMobile ? 150 : 200; // モバイル: 約6行分、デスクトップ: 約8行分
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }
  };

  // 入力値が変更されたときに高さを調整
  useEffect(() => {
    if (input === '') {
      // 空の時は最小高さにリセット
      if (textareaRef.current) {
        textareaRef.current.style.height = '52px';
      }
    } else {
      adjustTextareaHeight();
    }
  }, [input]);

  // ウィンドウサイズ変更時に高さを再調整
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        adjustTextareaHeight();
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Web Speech API サポート確認
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      setIsSupported(!!SpeechRecognition);

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ja-JP';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          // 音声認識結果を入力フィールドに設定
          const syntheticEvent = {
            target: { value: transcript }
          } as React.ChangeEvent<HTMLTextAreaElement>;
          handleInputChange(syntheticEvent);
        };

        recognition.onerror = (event: any) => {
          console.error('音声認識エラー:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [handleInputChange]);

  // 音声認識開始/停止
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // 画像選択をトリガー
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ファイルが選択されたときのハンドラ
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // ファイルサイズの検証（15MB制限 - Geminiのマルチモーダル対応）
      if (file.size > 15 * 1024 * 1024) {
        alert('ファイルサイズが大きすぎます。15MB以下のファイルを選択してください。');
        return;
      }

      // ファイル分析モードの場合は特定のファイルタイプのみ許可
      if (isFileAnalysisMode) {
        if (fileAnalysisType === 'pdf') {
          if (file.type !== 'application/pdf') {
            alert('PDFファイルのみアップロードできます。');
            return;
          }
        } else if (fileAnalysisType === 'excel') {
          const excelTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv',
          ];
          const isExcelFile = excelTypes.includes(file.type) ||
                             file.name.endsWith('.xlsx') ||
                             file.name.endsWith('.xls') ||
                             file.name.endsWith('.csv');
          if (!isExcelFile) {
            alert('Excel/CSVファイルのみアップロードできます（.xlsx, .xls, .csv）。');
            return;
          }
        }
      } else {
        // 通常モード: 対応ファイルタイプの検証
        const allowedTypes = [
          'image/',
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'text/plain',
          'text/markdown',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        ];

        const isAllowedType = allowedTypes.some(type => file.type.startsWith(type) || file.type === type);

        if (!isAllowedType) {
          alert('対応していないファイル形式です。画像、PDF、Word、Excel、テキストファイルを選択してください。');
          return;
        }
      }

      setSelectedImage(file);
    }
  };

  // 画像プレビューURL管理
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setImagePreviewUrl(url);

      // クリーンアップ関数でURLを解放
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedImage]);

  // IME関連の状態
  const [isComposing, setIsComposing] = useState(false);

  // IME開始時
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  // IME終了時
  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  // キーボードイベントハンドラ（IME対応）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // IME入力中はEnterキーの処理をスキップ
    if (isComposing) {
      return;
    }

    // Shift+Enterの場合は改行を許可
    if (e.key === 'Enter' && e.shiftKey) {
      // デフォルトの動作（改行）を許可
      return;
    }

    // Enterキーのみの場合は送信（IME確定後のみ）
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault(); // デフォルトの改行を防ぐ
      
      // 入力がある場合のみ送信
      if (input.trim()) {
        const form = e.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  // フォーム送信時の処理（ChatGPTスタイル）
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ファイル分析モードの場合: ファイルが必須
    if (isFileAnalysisMode) {
      if (!selectedImage) {
        return;
      }
      // プロンプトは任意
    } else if (isDifyMode) {
      // Difyモード: ファイルまたは入力のいずれかが必須
      if (!selectedImage && !input.trim()) {
        return;
      }
    } else {
      // 通常モード: 入力がない場合は送信しない
      if (!input.trim()) {
        return;
      }
    }

    // そのまま送信
    handleSubmit(e, selectedImage || undefined);

    // 送信後に画像をクリア
    setSelectedImage(null);
    setImagePreviewUrl(null);

    // textareaの高さを初期値にリセット
    if (textareaRef.current) {
      textareaRef.current.style.height = '52px';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md">
      <div className="safe-areas">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-3 md:py-4">
          {/* ファイルプレビューセクション */}
          {selectedImage && (
            <div className="mb-2 inline-block relative">
              {selectedImage.type.startsWith('image/') && imagePreviewUrl ? (
                // 画像の場合: サムネイル表示
                <>
                  <Image
                    src={imagePreviewUrl}
                    alt="添付画像"
                    width={200}
                    height={64}
                    className="max-h-16 max-w-[200px] rounded-lg border border-gray-200 object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors border border-gray-200"
                    title="ファイルを削除"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                </>
              ) : (
                // 画像以外: ファイル名とアイコン表示
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-700 max-w-[200px] truncate">{selectedImage.name}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="ファイルを削除"
                  >
                    <X className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <div className="relative flex items-center bg-gray-100 rounded-2xl md:rounded-3xl border border-gray-200 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 transition-all shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                placeholder={
                  isFileAnalysisMode
                    ? fileAnalysisType === 'pdf'
                      ? "PDFを添付して質問してください"
                      : "Excel/CSVを添付して質問してください"
                    : "質問してみましょう"
                }
                className="flex-1 p-3 pl-4 pr-20 md:pr-24 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-base resize-none overflow-y-auto"
                style={{
                  minHeight: '52px',
                  maxHeight: '200px',
                  lineHeight: '1.5'
                }}
                disabled={isLoading}
                rows={1}
              />
              <div className="absolute right-2 flex items-center gap-1">
                {/* ファイル添付ボタン（全モードで表示） */}
                <>
                  <input
                    type="file"
                    accept={
                      isFileAnalysisMode
                        ? fileAnalysisType === 'pdf'
                          ? '.pdf,application/pdf'
                          : fileAnalysisType === 'excel'
                          ? '.xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv'
                          : 'image/*,application/pdf,.pdf,.docx,.doc,.txt,.md,.csv,.xlsx'
                        : 'image/*,application/pdf,.pdf,.docx,.doc,.txt,.md,.csv,.xlsx'
                    }
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageSelect}
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={isLoading}
                    className="hidden md:flex p-2 rounded-full transition-colors text-gray-600 bg-gray-50 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    title={
                      isFileAnalysisMode
                        ? fileAnalysisType === 'pdf'
                          ? 'PDFファイルを添付'
                          : 'Excel/CSVファイルを添付'
                        : 'ファイルを添付（画像、PDF、Word、Excel等）'
                    }
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                </>

                {/* 音声入力ボタン */}
                {isSupported && (
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    disabled={isLoading}
                    className={`hidden md:flex p-2 rounded-full transition-colors ${isListening
                      ? 'text-red-600 bg-red-50 hover:bg-red-100'
                      : 'text-gray-600 bg-gray-50 hover:bg-gray-200'
                      } disabled:bg-gray-300 disabled:cursor-not-allowed`}
                    title={isListening ? '音声入力を停止' : '音声入力を開始'}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </button>
                )}

                {/* 送信ボタン */}
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    (isFileAnalysisMode
                      ? !selectedImage
                      : isDifyMode
                        ? !selectedImage && !input.trim()
                        : !input.trim()
                    )
                  }
                  className="p-2.5 md:p-2 text-white bg-black rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 音声認識状態表示 */}
            {isListening && (
              <div className="mt-2 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-50 text-red-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  音声を聞いています...
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}; 