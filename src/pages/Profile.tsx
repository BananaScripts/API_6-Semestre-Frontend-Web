import { useState } from "react";
import { User, Mail, Lock, Bell, Shield, Info, Save, Eye, EyeOff, Trash2, LogOut } from "lucide-react";
import { User, Mail, Lock, Bell, Shield, Info, Save, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
  name: (user as any)?.nome || '',
    email: user?.email || '',
    phone: '',
    company: '',
    position: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    weeklyReports: true,
    systemUpdates: false,
    marketingEmails: false
  });

  const handleProfileSave = async () => {
    if (!user?.id) {
      toast({
        title: "Sem ID do usuário",
        description: "Não foi possível identificar o usuário para atualizar.",
        variant: "destructive"
      });
      return;
    }
    try {
      const payload: any = {};
      if (profileData.name && profileData.name !== user.nome) payload.nome = profileData.name;
      if (profileData.email && profileData.email !== user.email) payload.email = profileData.email;
      if (Object.keys(payload).length === 0) {
        toast({ title: "Nada para atualizar", description: "Nenhuma alteração detectada." });
        return;
      }
      const updated = await apiService.updateUser(user.id, payload);
      // Atualiza storage local (akasys_user) mantendo possíveis campos extras
      const stored = localStorage.getItem('akasys_user');
      let storedObj: any = stored ? JSON.parse(stored) : {};
      storedObj = { ...storedObj, nome: updated.nome, email: updated.email };
      localStorage.setItem('akasys_user', JSON.stringify(storedObj));
      // Força reload leve da página ou poderia expor método no contexto para setUser
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (e: any) {
      toast({
        title: "Erro ao atualizar",
        description: e.message || 'Falha ao salvar alterações.',
        variant: 'destructive'
      });
    }
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Senha alterada",
      description: "Sua senha foi atualizada com sucesso.",
    });
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleNotificationSave = () => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas.",
    });
  };


  const handleLogout = () => {
    const confirmLogout = window.confirm('Tem certeza que deseja sair da sua conta?');
    if (confirmLogout) {
      logout();
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) {
      toast({ title: 'Sem ID para excluir', description: 'Não foi possível identificar o usuário.', variant: 'destructive' });
      return;
    }
    const confirmDelete = window.confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.');
    if (!confirmDelete) return;
    try {
      await apiService.deleteUser(user.id);
      localStorage.removeItem('akasys_user');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } catch (e: any) {
      toast({ title: 'Erro ao excluir', description: e.message || 'Falha ao excluir conta.', variant: 'destructive' });
    }
  };


  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-golden to-golden-hover text-primary-foreground text-2xl font-bold">
            {(user as any)?.nome?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-golden to-blue-dark bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e preferências
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={user?.role === 'admin' ? 'bg-golden/20 text-golden border-golden/20' : 'bg-blue-dark/20 text-blue-dark border-blue-dark/20'}>
              {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              Conta Ativa
            </Badge>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="about" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Sobre
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-golden" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações básicas de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="focus:border-golden smooth-transition"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="focus:border-golden smooth-transition"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="focus:border-golden smooth-transition"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                    placeholder="Nome da empresa"
                    className="focus:border-golden smooth-transition"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                    placeholder="Seu cargo na empresa"
                    className="focus:border-golden smooth-transition"
                  />
                </div>
              </div>
              

              <div className="flex justify-between pt-4 gap-4 flex-wrap">
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleLogout} className="border-destructive text-destructive hover:bg-destructive/10">
                    <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
                  </Button>
                  <Button type="button" variant="outline" onClick={handleDeleteAccount} disabled={!user?.id} className="border-destructive text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Excluir Conta
                  </Button>
                </div>

              <div className="flex justify-between pt-4 gap-4 flex-wrap">
                <Button type="button" variant="outline" onClick={handleDeleteAccount} disabled={!user?.id} className="border-destructive text-destructive hover:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Conta
                </Button>

                <Button variant="golden" onClick={handleProfileSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-golden" />
                Alterar Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua conta segura com uma senha forte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="pr-10 focus:border-golden smooth-transition"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="pr-10 focus:border-golden smooth-transition"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="pr-10 focus:border-golden smooth-transition"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="golden" onClick={handlePasswordChange}>
                  <Shield className="mr-2 h-4 w-4" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-golden" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como você deseja receber atualizações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Alertas por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações sobre alterações importantes nos dados
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Relatórios Semanais</Label>
                    <p className="text-sm text-muted-foreground">
                      Resumo semanal dos principais insights e métricas
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Atualizações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre novas funcionalidades e manutenções
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Emails de Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Dicas, novidades e conteúdo educacional sobre análise de dados
                    </p>
                  </div>
                  <Switch
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button variant="golden" onClick={handleNotificationSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Preferências
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          <Card className="card-elevation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-golden" />
                Sobre a Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Akasys Platform</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Versão 2.1.0 - Sistema de Business Intelligence com Inteligência Artificial
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <p><strong>Suporte:</strong> suporte@akasys.com</p>
                    <p><strong>Documentação:</strong> docs.akasys.com</p>
                    <p><strong>Status:</strong> status.akasys.com</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Recursos Disponíveis</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Dashboard interativo em tempo real</li>
                    <li>• Chat com IA especializada</li>
                    <li>• Análise preditiva avançada</li>
                    <li>• Relatórios personalizáveis</li>
                    <li>• Integração com múltiplas fontes</li>
                    <li>• Alertas inteligentes</li>
                  </ul>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm">
                    Termos de Uso
                  </Button>
                  <Button variant="outline" size="sm">
                    Política de Privacidade
                  </Button>
                  <Button variant="outline" size="sm">
                    Central de Ajuda
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}