import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Equipe de Vendas',
      lastMessage: 'Precisamos revisar os números do Q4',
      time: '10:30',
      unread: 3,
      avatar: '👥'
    },
    {
      id: '2',
      name: 'Suporte Técnico',
      lastMessage: 'Bug corrigido na versão 2.1',
      time: '09:15',
      unread: 0,
      avatar: '🔧'
    },
    {
      id: '3',
      name: 'Marketing',
      lastMessage: 'Nova campanha aprovada',
      time: 'Ontem',
      unread: 1,
      avatar: '📢'
    },
    {
      id: '4',
      name: 'Desenvolvimento',
      lastMessage: 'Deploy agendado para amanhã',
      time: 'Ontem',
      unread: 0,
      avatar: '💻'
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (id: string) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Chat</h1>
            <p className="text-muted-foreground">Conversas e mensagens</p>
          </div>

          <Card className="gradient-card border-border">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-surface"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="flex items-center gap-4 p-4 rounded-lg bg-surface hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <div className="text-3xl">{conv.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conv.name}</h3>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              ))}

              {filteredConversations.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
