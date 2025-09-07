import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Database, 
  Activity, 
  Shield, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  UserPlus,
  Settings
} from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: Date | null;
  createdAt: Date;
}

interface Dataset {
  id: string;
  name: string;
  uploadedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  size: string;
  uploadedAt: Date;
}

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: Date;
  ip: string;
}

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [datasetFilter, setDatasetFilter] = useState('pending');
  const { toast } = useToast();

  // Mock data
  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      email: 'res@oceanus',
      role: 'researcher',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Policy Analyst',
      email: 'policy@oceanus',
      role: 'policy_user',
      status: 'active',
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Guest User',
      email: 'guest@oceanus',
      role: 'guest',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      name: 'Dr. John Marine',
      email: 'john@marine.org',
      role: 'researcher',
      status: 'pending',
      lastLogin: null,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [datasets] = useState<Dataset[]>([
    {
      id: '1',
      name: 'Deep Sea Coral Survey',
      uploadedBy: 'Dr. Marine Research',
      status: 'pending',
      size: '3.2 GB',
      uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Arctic Plankton Distribution',
      uploadedBy: 'Research Institute',
      status: 'pending',
      size: '1.8 GB',
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Coastal Water Quality',
      uploadedBy: 'Environmental Agency',
      status: 'approved',
      size: '850 MB',
      uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: '1',
      user: 'Dr. Sarah Chen',
      action: 'Dataset Upload',
      target: 'Pacific Kelp Survey 2024',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      ip: '192.168.1.100',
    },
    {
      id: '2',
      user: 'Admin User',
      action: 'User Role Change',
      target: 'policy@oceanus',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ip: '192.168.1.50',
    },
    {
      id: '3',
      user: 'Policy Analyst',
      action: 'Report Generation',
      target: 'Monthly Biodiversity Summary',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ip: '192.168.1.120',
    },
    {
      id: '4',
      user: 'Dr. Sarah Chen',
      action: 'AI Analysis',
      target: 'Species Identification',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      ip: '192.168.1.100',
    },
  ]);

  const handleApproveDataset = (datasetId: string) => {
    toast({
      title: "Dataset approved",
      description: "The dataset has been approved and is now available.",
    });
  };

  const handleRejectDataset = (datasetId: string) => {
    toast({
      title: "Dataset rejected",
      description: "The dataset has been rejected and removed from the queue.",
      variant: "destructive",
    });
  };

  const handleUserStatusChange = (userId: string, newStatus: string) => {
    toast({
      title: "User status updated",
      description: `User status has been changed to ${newStatus}.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'inactive':
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/20 text-purple-400';
      case 'researcher':
        return 'bg-blue-500/20 text-blue-400';
      case 'policy_user':
        return 'bg-orange-500/20 text-orange-400';
      case 'guest':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = datasetFilter === 'all' || dataset.status === datasetFilter;
    return matchesSearch && matchesFilter;
  });

  const systemStats = [
    { label: 'Total Users', value: users.length, icon: Users, change: '+3 this week' },
    { label: 'Pending Approvals', value: datasets.filter(d => d.status === 'pending').length, icon: Clock, change: '2 new today' },
    { label: 'Active Datasets', value: datasets.filter(d => d.status === 'approved').length, icon: Database, change: '+5 this month' },
    { label: 'System Health', value: '99.9%', icon: Activity, change: 'All systems operational' },
  ];

  const breadcrumbs = [
    { label: 'Administration' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">System Administration</h1>
            <p className="text-muted-foreground">
              Manage users, datasets, and system settings
            </p>
          </div>
          <Button data-testid="button-add-user">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="metric-card" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</h3>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="users" className="w-full" data-testid="tabs-admin">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" data-testid="tab-users">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="datasets" data-testid="tab-datasets">
              <Database className="w-4 h-4 mr-2" />
              Dataset Approvals
            </TabsTrigger>
            <TabsTrigger value="logs" data-testid="tab-logs">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                        data-testid="input-search-users"
                      />
                    </div>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-32" data-testid="select-user-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Login</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-accent/10" data-testid={`user-row-${user.id}`}>
                          <td className="p-4">
                            <div>
                              <p className="font-medium" data-testid={`user-name-${user.id}`}>{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getRoleColor(user.role)} data-testid={`user-role-${user.id}`}>
                              {user.role.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(user.status)} data-testid={`user-status-${user.id}`}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {user.lastLogin ? format(user.lastLogin, 'MMM dd, HH:mm') : 'Never'}
                          </td>
                          <td className="p-4">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              data-testid={`button-user-actions-${user.id}`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datasets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dataset Approvals</CardTitle>
                  <Select value={datasetFilter} onValueChange={setDatasetFilter}>
                    <SelectTrigger className="w-32" data-testid="select-dataset-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDatasets.map((dataset) => (
                    <div 
                      key={dataset.id} 
                      className="p-4 border border-border rounded-lg"
                      data-testid={`dataset-${dataset.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1" data-testid={`dataset-name-${dataset.id}`}>
                            {dataset.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>Uploaded by: {dataset.uploadedBy}</span>
                            <span>Size: {dataset.size}</span>
                            <span>{format(dataset.uploadedAt, 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          <Badge className={getStatusColor(dataset.status)} data-testid={`dataset-status-${dataset.id}`}>
                            {dataset.status}
                          </Badge>
                        </div>
                        
                        {dataset.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveDataset(dataset.id)}
                              data-testid={`button-approve-${dataset.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectDataset(dataset.id)}
                              data-testid={`button-reject-${dataset.id}`}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border hover:bg-accent/10" data-testid={`log-${log.id}`}>
                          <td className="p-4 font-medium">{log.user}</td>
                          <td className="p-4">{log.action}</td>
                          <td className="p-4 text-muted-foreground">{log.target}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                          </td>
                          <td className="p-4 text-sm font-mono text-muted-foreground">{log.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
