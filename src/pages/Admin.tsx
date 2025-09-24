import { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreVertical, 
  Eye, 
  Ban, 
  Trash2,
  Settings,
  BarChart3,
  Activity,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended' | 'pending';
  lastAccess: Date;
  createdAt: Date;
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Admin Silva',
    email: "admin@akasys.com",
    role: 'admin',
    status: 'active',
    lastAccess: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@empresa.com',
    role: 'user',
    status: 'active',
    lastAccess: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria@empresa.com',
    role: 'user',
    status: 'suspended',
    lastAccess: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    createdAt: new Date('2024-01-30')
  },
  {
    id: '4',
    name: 'Carlos Ferreira',
    email: 'carlos@empresa.com',
    role: 'user',
    status: 'pending',
    lastAccess: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    createdAt: new Date('2024-03-10')
  }
];

const adminStats = [
  {
    title: "Total de Usuários",
    value: "247",
    change: "+12 este mês",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Usuários Ativos",
    value: "198",
    change: "80% de taxa de atividade",
    icon: Activity,
    color: "text-green-600"
  },
  {
    title: "Alertas Pendentes",
    value: "3",
    change: "Requer atenção",
    icon: AlertTriangle,
    color: "text-yellow-600"
  },
  {
    title: "Sistema",
    value: "Operacional",
    change: "99.9% uptime",
    icon: BarChart3,
    color: "text-golden"
  }
];

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (userId: string, action: string) => {
    const user = users.find(u => u.id === userId);
    
    switch (action) {
      case 'view':
        toast({
          title: "Visualizar usuário",
          description: `Abrindo perfil de ${user?.name}`,
        });
        break;
      case 'suspend':
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' as const }
            : u
        ));
        toast({
          title: user?.status === 'suspended' ? "Usuário reativado" : "Usuário suspenso",
          description: `${user?.name} foi ${user?.status === 'suspended' ? 'reativado' : 'suspenso'} com sucesso.`,
        });
        break;
      case 'delete':
        setUsers(users.filter(u => u.id !== userId));
        toast({
          title: "Usuário removido",
          description: `${user?.name} foi removido do sistema.`,
          variant: "destructive",
        });
        break;
    }
  };

  const getStatusBadge = (status: AdminUser['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Ativo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Suspenso</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Pendente</Badge>;
    }
  };

  const getRoleBadge = (role: AdminUser['role']) => {
    return role === 'admin' ? (
      <Badge className="bg-golden/20 text-golden border-golden/20">Admin</Badge>
    ) : (
      <Badge variant="outline">Usuário</Badge>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários, permissões e configurações do sistema
          </p>
        </div>
        <Button variant="golden">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminStats.map((stat, index) => (
          <Card key={index} className="card-elevation hover:shadow-lg smooth-transition">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs do Sistema</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Gerenciamento de Usuários</CardTitle>
                  <CardDescription>
                    Visualize e gerencie todos os usuários da plataforma
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Último Acesso</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gradient-to-br from-golden/20 to-blue-dark/20">
                              {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.lastAccess.toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.createdAt.toLocaleDateString('pt-BR')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'view')}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                              <Ban className="mr-2 h-4 w-4" />
                              {user.status === 'suspended' ? 'Reativar' : 'Suspender'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle>Gerenciamento de Permissões</CardTitle>
              <CardDescription>
                Configure permissões e acessos por tipo de usuário
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sistema de Permissões</h3>
                <p className="text-muted-foreground">
                  Configure permissões detalhadas conectando ao Supabase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Gerencie configurações globais da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configurações Avançadas</h3>
                <p className="text-muted-foreground">
                  Configurações de sistema e integrações disponíveis com backend
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle>Logs do Sistema</CardTitle>
              <CardDescription>
                Monitore atividades e eventos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Logs de Auditoria</h3>
                <p className="text-muted-foreground">
                  Logs detalhados e rastreamento de ações disponíveis com Supabase
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}