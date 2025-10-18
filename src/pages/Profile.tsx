import { NavBar } from '@/components/NavBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Settings, 
  Bell, 
  HelpCircle, 
  FileText, 
  LogOut 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
  const { user, logout } = useAuth();

  const sections = [
    {
      title: 'Conta',
      items: [
        { icon: User, label: 'Informações Pessoais', action: () => {} },
        { icon: Mail, label: 'Email e Senha', action: () => {} },
        { icon: Shield, label: 'Privacidade e Segurança', action: () => {} },
      ]
    },
    {
      title: 'Preferências',
      items: [
        { icon: Settings, label: 'Configurações Gerais', action: () => {} },
        { icon: Bell, label: 'Notificações', action: () => {} },
      ]
    },
    {
      title: 'Suporte',
      items: [
        { icon: HelpCircle, label: 'Central de Ajuda', action: () => {} },
        { icon: FileText, label: 'Documentação', action: () => {} },
      ]
    },
  ];

  return (
    <div className="min-h-screen">
      <NavBar />
      
      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Perfil</h1>
            <p className="text-muted-foreground">Gerencie sua conta e preferências</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="gradient-card border-border md:col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{user?.name || 'Usuário'}</CardTitle>
                <CardDescription className="text-sm">{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pt-4">
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </div>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              {sections.map((section) => (
                <Card key={section.title} className="gradient-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-secondary/50 transition-colors text-left"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="flex-1">{item.label}</span>
                        <span className="text-muted-foreground">›</span>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <Card className="gradient-card border-border border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-lg">Zona de Perigo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
