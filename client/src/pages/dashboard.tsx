import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Database, Gauge, Dna, Brain, Upload, FileText, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

interface DashboardData {
  datasets: number;
  sensors: number;
  ednaSamples: number;
  aiAnalyses: number;
  recentUploads: Array<{
    id: string;
    name: string;
    type: string;
    location: string;
    date: Date;
    status: string;
  }>;
}

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ['/api/dashboard/summary'],
  });

  const metrics = [
    {
      title: 'Total Datasets',
      value: dashboardData?.datasets?.toLocaleString() || '0',
      change: '+12.3%',
      description: '+142 this month',
      icon: Database,
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Active Gauge', 
      value: dashboardData?.sensors?.toLocaleString() || '0',
      change: '+8.7%',
      description: '87% operational',
      icon: Gauge,
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
    {
      title: 'eDNA Samples',
      value: dashboardData?.ednaSamples?.toLocaleString() || '0', 
      change: '+24.1%',
      description: 'Processing queue: 47',
      icon: Dna,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/20',
    },
    {
      title: 'AI Analyses',
      value: dashboardData?.aiAnalyses?.toLocaleString() || '0',
      change: '+5.2%', 
      description: '94% accuracy rate',
      icon: Brain,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/20',
    },
  ];

  const quickActions = [
    {
      title: 'Upload Data',
      description: 'Add new datasets',
      icon: Upload,
      href: '/upload',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
    },
    {
      title: 'Run Analysis', 
      description: 'AI-powered insights',
      icon: Brain,
      href: '/ai-tools',
      color: 'text-secondary',
      bgColor: 'bg-secondary/20',
    },
    {
      title: 'Generate Report',
      description: 'Export findings',
      icon: FileText,
      href: '/reports',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/20',
    },
  ];

  const systemStatus = [
    { service: 'API Services', status: 'Operational', color: 'bg-green-400' },
    { service: 'Data Processing', status: 'Online', color: 'bg-green-400' },
    { service: 'AI Models', status: 'Updating', color: 'bg-yellow-400' },
    { service: 'Storage', status: '78% Used', color: 'bg-green-400' },
  ];

  const breadcrumbs = [
    { label: 'Dashboard' },
    { label: 'Overview' },
  ];

  if (isLoading) {
    return (
      <Layout breadcrumbs={breadcrumbs}>
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground mb-4">Your latest marine research data awaits analysis.</p>
          <div className="flex gap-3">
            <Link href="/ai-tools">
              <Button data-testid="button-start-analysis">
                Start New Analysis
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="outline" data-testid="button-view-reports">
                View Recent Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="metric-card cursor-pointer" data-testid={`metric-${metric.title.toLowerCase().replace(' ', '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-green-400 bg-green-500/20">
                      {metric.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{metric.title}</h3>
                  <p className="text-3xl font-bold" data-testid={`value-${metric.title.toLowerCase().replace(' ', '-')}`}>
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Data Uploads */}
          <div className="lg:col-span-2">
            <Card className="data-table">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Data Uploads</CardTitle>
                  <Link href="/explorer" className="text-primary hover:text-primary/80 text-sm font-medium">
                    View all
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Dataset</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Location</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentUploads?.map((upload) => (
                        <tr key={upload.id} className="border-b border-border hover:bg-accent/10" data-testid={`upload-row-${upload.id}`}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium" data-testid={`upload-name-${upload.id}`}>{upload.name}</p>
                                <p className="text-sm text-muted-foreground">2.4 GB</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" data-testid={`upload-type-${upload.id}`}>
                              {upload.type}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm" data-testid={`upload-location-${upload.id}`}>{upload.location}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {format(new Date(upload.date), 'MMM dd, HH:mm')}
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={upload.status === 'processed' ? 'default' : 'secondary'}
                              className={upload.status === 'processed' ? 'text-green-400 bg-green-500/20' : 'text-yellow-400 bg-yellow-500/20'}
                              data-testid={`upload-status-${upload.id}`}
                            >
                              {upload.status}
                            </Badge>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No recent uploads
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & System Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.title} href={action.href}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-3 h-auto p-3 hover:bg-accent"
                        data-testid={`button-${action.title.toLowerCase().replace(' ', '-')}`}
                      >
                        <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStatus.map((status) => (
                  <div key={status.service} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${status.color} rounded-full`}></div>
                      <span className="text-sm">{status.service}</span>
                    </div>
                    <span className={`text-sm ${status.color === 'bg-green-400' ? 'text-green-400' : status.color === 'bg-yellow-400' ? 'text-yellow-400' : 'text-muted-foreground'}`}>
                      {status.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
