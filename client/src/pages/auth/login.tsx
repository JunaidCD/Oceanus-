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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Ocean Wave Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="oceanWaves" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
                <path d="M0 60 Q30 30 60 60 T120 60" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
                <path d="M0 80 Q30 50 60 80 T120 80" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2"/>
                <circle cx="20" cy="40" r="2" fill="currentColor" opacity="0.3"/>
                <circle cx="80" cy="100" r="1.5" fill="currentColor" opacity="0.2"/>
                <circle cx="100" cy="20" r="1" fill="currentColor" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#oceanWaves)" />
          </svg>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding & Features */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo and Main Heading */}
            <div className="space-y-6">
              <div className="inline-block">
                <Logo size="xl" showText={true} className="transform hover:scale-105 transition-transform duration-300" />
              </div>
              
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Unlock the Secrets of{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                    Marine Ecosystems
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  Advanced AI-powered platform for oceanographic research, fisheries analysis, and molecular biodiversity insights.
                </p>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Real-time Analysis</h3>
                  <p className="text-xs text-muted-foreground">Oceanographic data</p>
                </div>
              </div>

              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI-Powered</h3>
                  <p className="text-xs text-muted-foreground">Species identification</p>
                </div>
              </div>

              <div className="group flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <div className="w-6 h-6 rounded-full bg-white"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Comprehensive</h3>
                  <p className="text-xs text-muted-foreground">Biodiversity insights</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-sm">
              <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
                <CardHeader className="space-y-2 pb-4">
                  <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      Welcome back
                    </h2>
                    <p className="text-sm text-muted-foreground">Sign in to your Oceanus account</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Email</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Enter your email" 
                                data-testid="input-email"
                                className="h-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
                          <FormItem className="space-y-1">
                            <FormLabel className="text-sm font-medium">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your password"
                                data-testid="input-password"
                                className="h-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0 py-1">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-remember-me"
                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full h-10 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                        disabled={loginMutation.isPending}
                        data-testid="button-login"
                      >
                        {loginMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  </Form>

                  {/* Demo Credentials */}
                  <div className="mt-4 p-3 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-lg border border-slate-200/50 dark:border-slate-600/50">
                    <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">Demo Credentials:</p>
                    <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Admin:</span>
                        <span className="text-blue-600 dark:text-blue-400">admin@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Researcher:</span>
                        <span className="text-cyan-600 dark:text-cyan-400">researcher@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Policy User:</span>
                        <span className="text-emerald-600 dark:text-emerald-400">policy@oceanus.com</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 bg-white/50 dark:bg-slate-700/50 rounded">
                        <span className="font-medium">Guest:</span>
                        <span className="text-purple-600 dark:text-purple-400">guest@oceanus.com</span>
                      </div>
                      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                        Password: <span className="font-mono">password</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
