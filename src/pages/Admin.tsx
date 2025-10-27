import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { Usuario, CreateUsuario, UpdateUsuario } from "@/types/api";

interface AdminUser extends Usuario {
  // Extend with additional fields for admin view
  status?: 'active' | 'suspended' | 'pending';
  role?: 'admin' | 'user';
  lastAccess?: Date;
  createdAt?: Date;
}

const adminStats = [
  {
    title: "Total de Usuários",
    value: "0",
    change: "Carregando...",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Usuários Ativos",
    value: "0",
    change: "Carregando...",
    icon: Activity,
    color: "text-green-600"
  },
  {
    title: "Alertas Pendentes",
    value: "0",
    change: "Nenhum alerta",
    icon: AlertTriangle,
    color: "text-yellow-600"
  },
  {
    title: "Sistema",
    value: "Conectado",
    change: "API funcionando",
    icon: BarChart3,
    color: "text-golden"
  }
];

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(adminStats);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState<CreateUsuario>({
    nome: '',
    email: '',
    senha: ''
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      // For now, we'll simulate getting all users by trying different IDs
      // In a real scenario, you'd have an endpoint to get all users
      const userList: AdminUser[] = [];
      
      // Try to get current user info
      if (user?.id) {
        try {
          const currentUser = await apiService.getUser(user.id);
          userList.push({
            ...currentUser,
            status: 'active',
            role: 'admin', // Assume current user is admin
            lastAccess: new Date(),
            createdAt: new Date()
          });
        } catch (error) {
          console.error('Error fetching current user:', error);
        }
      }

      setUsers(userList);
      updateStats(userList);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.nome || !newUser.email || !newUser.senha) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para criar o usuário.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCreatingUser(true);
      const createdUser = await apiService.createUser(newUser);
      
      // Add to local state
      const adminUser: AdminUser = {
        ...createdUser,
        status: 'active',
        role: 'user',
        lastAccess: new Date(),
        createdAt: new Date()
      };
      
      setUsers([...users, adminUser]);
      updateStats([...users, adminUser]);
      
      // Reset form
      setNewUser({ nome: '', email: '', senha: '' });
      setIsCreateDialogOpen(false);
      
      toast({
        title: "Usuário criado",
        description: `${createdUser.nome} foi criado com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Não foi possível criar o usuário. Verifique os dados.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const updateStats = (userList: AdminUser[]) => {
    const totalUsers = userList.length;
    const activeUsers = userList.filter(u => u.status === 'active').length;
    
    setStats(prevStats => prevStats.map(stat => {
      if (stat.title === "Total de Usuários") {
        return { ...stat, value: totalUsers.toString(), change: "atualizado" };
      }
      if (stat.title === "Usuários Ativos") {
        return { ...stat, value: activeUsers.toString(), change: `${activeUsers} ativos` };
      }
      return stat;
    }));
  };

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = async (userId: number, action: string) => {
    const foundUser = users.find(u => u.id === userId);
    
    switch (action) {
      case 'view':
        toast({
          title: "Visualizar usuário",
          description: `Abrindo perfil de ${foundUser?.nome}`,
        });
        break;
      case 'edit':
        // Set form data for editing
        setNewUser({
          nome: foundUser?.nome || '',
          email: foundUser?.email || '',
          senha: ''
        });
        setIsCreateDialogOpen(true);
        break;
      case 'suspend':
        // Note: Backend doesn't have suspend functionality, this would need backend changes
        toast({
          title: "Funcionalidade não implementada",
          description: "Suspensão de usuários não está disponível na API atual.",
        });
        break;
      case 'delete':


        const confirmDelete = window.confirm(`Tem certeza que deseja excluir o usuário ${foundUser?.nome}?`);
        if (!confirmDelete) return;
        

        try {
          await apiService.deleteUser(userId);
          setUsers(users.filter(u => u.id !== userId));
          toast({
            title: "Usuário removido",
            description: `${foundUser?.nome} foi removido do sistema.`,
            variant: "destructive",
          });
          updateStats(users.filter(u => u.id !== userId));
        } catch (error) {
          toast({
            title: "Erro ao remover usuário",
            description: "Não foi possível remover o usuário.",
            variant: "destructive",
          });
        }

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

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="golden">
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>

              <DialogTitle>
                {newUser.nome && newUser.email ? 'Editar Usuário' : 'Criar Novo Usuário'}
              </DialogTitle>
              <DialogDescription>
                {newUser.nome && newUser.email ? 'Edite as informações do usuário.' : 'Adicione um novo usuário ao sistema.'}
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Adicione um novo usuário ao sistema.

              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={newUser.nome}
                  onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div>
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={newUser.senha}
                  onChange={(e) => setNewUser({ ...newUser, senha: e.target.value })}
                  placeholder="Senha segura"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={isCreatingUser}
                >

                  {isCreatingUser ? "Salvando..." : (newUser.nome && newUser.email ? "Salvar Alterações" : "Criar Usuário")}

                  {isCreatingUser ? "Criando..." : "Criar Usuário"}

                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                              {user.nome.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.nome}</p>
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
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
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