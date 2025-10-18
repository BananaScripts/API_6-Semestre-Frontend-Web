import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Paperclip, MoreVertical, Search, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'insight' | 'chart';
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: 'João Silva',
    lastMessage: 'Obrigado pela ajuda!',
    time: '2 min',
    unread: 2,
    avatar: 'person.circle.fill',
    online: true,
  },
  {
    id: 2,
    name: 'Maria Santos',
    lastMessage: 'Preciso de mais informações sobre o projeto',
    time: '15 min',
    unread: 0,
    avatar: 'person.circle.fill',
    online: false,
  },
  {
    id: 3,
    name: 'Carlos Oliveira',
    lastMessage: 'Vou enviar os documentos amanhã',
    time: '1h',
    unread: 1,
    avatar: 'person.circle.fill',
    online: true,
  },
  {
    id: 4,
    name: 'Ana Costa',
    lastMessage: 'Perfeito, obrigada!',
    time: '2h',
    unread: 0,
    avatar: 'person.circle.fill',
    online: false,
  },
  {
    id: 5,
    name: 'Pedro Lima',
    lastMessage: 'Podemos marcar uma reunião?',
    time: '3h',
    unread: 0,
    avatar: 'person.circle.fill',
    online: false,
  },
  {
    id: 6,
    name: 'Equipe Dev',
    lastMessage: 'Nova atualização disponível',
    time: '1d',
    unread: 5,
    avatar: 'person.3.fill',
    online: false,
  },
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showConversations, setShowConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowConversations(false);
  };

  const handleBackToConversations = () => {
    setShowConversations(true);
    setSelectedConversation(null);
  };

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

  // Render conversations list
  if (showConversations) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
              Conversas
            </h1>
            <p className="text-muted-foreground mt-1">
              Suas conversas e mensagens
            </p>
          </div>
          <Button className="bg-golden hover:bg-golden-hover">
            <Plus className="mr-2 h-4 w-4" />
            Nova Conversa
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="card-elevation">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              {searchQuery.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <Card className="card-elevation">
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className="flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer border-b border-border/50 last:border-b-0"
                  onClick={() => handleConversationSelect(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-golden/20 to-blue-dark/20">
                        {conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <span className="text-xs text-muted-foreground">{conversation.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unread > 0 && (
                        <Badge className="bg-golden text-golden-foreground text-xs">
                          {conversation.unread > 9 ? '9+' : conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <Card className="card-elevation mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToConversations}
                className="mr-2"
              >
                ←
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-golden to-golden-hover text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">
                  {selectedConversation?.name || 'Assistente IA de Negócios'}
                </CardTitle>
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