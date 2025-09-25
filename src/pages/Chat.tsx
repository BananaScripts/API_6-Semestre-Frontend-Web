import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Paperclip, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'insight' | 'chart';
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Olá! Sou sua assistente de IA para insights de negócios. Como posso ajudá-lo hoje?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'text'
  },
  {
    id: '2',
    content: 'Quais foram os principais indicadores de vendas do último trimestre?',
    sender: 'user',
    timestamp: new Date(Date.now() - 1000 * 60 * 4)
  },
  {
    id: '3',
    content: 'Baseado na análise dos seus dados, identificei 3 insights principais:\n\n📈 **Crescimento de 23% nas vendas** comparado ao trimestre anterior\n💰 **Receita recorrente aumentou 18%** principalmente no segmento enterprise\n🎯 **Taxa de conversão melhorou 12%** após otimizações na landing page\n\nGostaria que eu detalhe algum desses pontos específicos?',
    sender: 'ai',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    type: 'insight'
  }
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Entendi sua pergunta! Estou analisando os dados para fornecer insights precisos. Em um sistema conectado, eu processaria suas informações em tempo real para dar respostas específicas sobre métricas, tendências e recomendações estratégicas.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
                <CardTitle className="text-lg">Assistente IA de Negócios</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                    Online
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Especialista em análise de dados
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
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
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={
                    message.sender === 'user' 
                      ? "bg-blue-dark text-secondary-foreground"
                      : "bg-gradient-to-br from-golden to-golden-hover text-primary-foreground"
                  }>
                    {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-dark text-secondary-foreground'
                      : message.type === 'insight'
                      ? 'bg-gradient-to-br from-golden/10 to-blue-dark/10 border border-golden/20'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
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

            {isTyping && (
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
            <Button variant="ghost" size="sm" className="mb-2">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 min-h-[40px] max-h-32">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua pergunta sobre os dados de negócio..."
                className="resize-none min-h-[40px] focus:border-golden smooth-transition"
              />
            </div>
            
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              variant="golden"
              size="sm"
              className="mb-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {['Vendas mensais', 'ROI campanhas', 'Análise cohort'].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setNewMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}