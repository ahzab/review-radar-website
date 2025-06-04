
'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiReplyButtonProps {
    reviewContent: string;
    rating: number;
    onReplyGenerated?: (reply: string) => void;
}

export function AiReplyButton({ reviewContent, rating, onReplyGenerated }: AiReplyButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedReply, setGeneratedReply] = useState<string | null>(null);

    const generateReply = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewContent,
                    rating,
                }),
            });

            const data = await response.json();
            setGeneratedReply(data.reply);
            onReplyGenerated?.(data.reply);
        } catch (error) {
            console.error('Failed to generate reply:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="relative inline-block">
            <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
                onClick={generateReply}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Bot className="h-4 w-4" />
                )}
                <span className="sr-only">Generate AI Reply</span>
            </Button>

            {generatedReply && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600">{generatedReply}</p>
                </div>
            )}
        </div>
    );
}