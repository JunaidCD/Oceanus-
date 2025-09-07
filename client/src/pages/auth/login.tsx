import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/ui/logo';
import { loginSchema, type LoginData } from '@shared/schema';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast({
        title: "Login successful",
        description: "Welcome to Oceanus!",
      });
      
      // Redirect based on role
      const redirectPath = data.user.role === 'admin' ? '/admin' :
                          data.user.role === 'researcher' ? '/dashboard' :
                          data.user.role === 'policy_user' ? '/visualize' :
                          '/explorer';
      setLocation(redirectPath);
    },
    onError: (error: any) => {
      toast({
        title: "Login failed", 
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding and Visual */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="oceanPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1" fill="currentColor" />
                <circle cx="50" cy="10" r="1" fill="currentColor" />
                <circle cx="10" cy="50" r="1" fill="currentColor" />
                <circle cx="50" cy="50" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#oceanPattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="space-y-6">
            <Logo size="xl" showText={true} className="text-white [&_h1]:text-white [&_p]:text-blue-100" />
            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Unlock the Secrets of <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Marine Ecosystems
                </span>
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed max-w-md">
                Advanced AI-powered platform for oceanographic research, fisheries analysis, and molecular biodiversity insights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-8 max-w-md">
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                </div>
                <span>Real-time oceanographic data analysis</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                </div>
                <span>AI-powered species identification</span>
              </div>
              <div className="flex items-center gap-3 text-blue-100">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span>Comprehensive biodiversity insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo (only shown on small screens) */}
          <div className="lg:hidden text-center">
            <Logo size="lg" showText={true} />
          </div>

          <div className="text-center lg:text-left">
            <h1 className="text-2xl lg:text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">Sign in to your Oceanus account</p>
          </div>

          <Card className="border-0 shadow-none lg:shadow-md lg:border">
            <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        data-testid="input-email"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your password"
                        data-testid="input-password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-remember-me"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Remember me</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </Form>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Demo Credentials:</p>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <p><strong>Admin:</strong> admin@oceanus.com / password</p>
                  <p><strong>Researcher:</strong> researcher@oceanus.com / password</p>
                  <p><strong>Policy User:</strong> policy@oceanus.com / password</p>
                  <p><strong>Guest:</strong> guest@oceanus.com / password</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
