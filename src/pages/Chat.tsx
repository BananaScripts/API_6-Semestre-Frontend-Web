import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface WebSocketResponse {
  pergunta_original: string;
  match_intencao?: string;
  answer: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket connection
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket('ws://127.0.0.1:8000/wb/chatbot');
      
      ws.onopen = () => {
        console.log('WebSocket conectado');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketResponse = JSON.parse(event.data);
          const botMessage: Message = {
            id: Date.now().toString(),
            text: data.answer,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, botMessage]);
          setIsLoading(false);
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
          setIsLoading(false);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket desconectado');
        setIsConnected(false);
        // Tentar reconectar após 3 segundos
        setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Enviar mensagem via WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messageData = {
        pergunta_original: inputText.trim()
      };
      wsRef.current.send(JSON.stringify(messageData));
    }

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card className="card-elevation mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-golden to-golden-hover text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  Assistente IA de Negócios
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={`${isConnected ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'} text-xs`}>
                    {isConnected ? 'Online' : 'Desconectado'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Especialista em análise de dados
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 card-elevation flex flex-col">
        <CardContent className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-y-auto pr-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.isUser ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={
                    message.isUser 
                      ? "bg-blue-dark text-secondary-foreground"
                      : "bg-gradient-to-br from-golden to-golden-hover text-primary-foreground"
                  }>
                    {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-dark text-secondary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.text}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-golden to-golden-hover text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="border-t border-border/50 p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 min-h-[40px] max-h-32">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre os dados de negócio..."
                className="resize-none min-h-[40px] focus:border-golden smooth-transition"
                disabled={!isConnected || isLoading}
              />
            </div>
            
            <Button 
              onClick={sendMessage}
              disabled={!inputText.trim() || !isConnected || isLoading}
              variant="golden"
              size="sm"
              className="mb-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}