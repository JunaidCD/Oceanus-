import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Download, Play, Eye, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Dataset {
  id: string;
  name: string;
  type: string;
  location: string;
  size: string;
  status: string;
  createdAt: Date;
  metadata?: any;
}

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ['/api/datasets'],
  });

  const filteredDatasets = datasets?.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || dataset.type === filterType;
    const matchesStatus = filterStatus === 'all' || dataset.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || dataset.location.includes(filterLocation);
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  }) || [];

  const handleDownload = (dataset: Dataset) => {
    // In a real app, this would trigger actual download
    console.log('Downloading dataset:', dataset.id);
  };

  const handleAnalyze = (dataset: Dataset) => {
    // In a real app, this would redirect to analysis page
    console.log('Analyzing dataset:', dataset.id);
  };

  const handleView = (dataset: Dataset) => {
    // In a real app, this would open dataset details
    console.log('Viewing dataset:', dataset.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    // Return appropriate icon based on type
    return '🌊';
  };

  const breadcrumbs = [
    { label: 'Explorer' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Explorer</h1>
            <p className="text-muted-foreground">
              Browse and analyze marine research datasets
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search datasets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-datasets"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger data-testid="select-filter-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Ocean Data">Ocean Data</SelectItem>
                    <SelectItem value="Fish Data">Fish Data</SelectItem>
                    <SelectItem value="eDNA">eDNA</SelectItem>
                    <SelectItem value="Otolith Data">Otolith Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger data-testid="select-filter-status">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger data-testid="select-filter-location">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="California">California Coast</SelectItem>
                    <SelectItem value="Great Barrier Reef">Great Barrier Reef</SelectItem>
                    <SelectItem value="Alaska">Alaska Peninsula</SelectItem>
                    <SelectItem value="Pacific">Pacific Ocean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterStatus('all');
                    setFilterLocation('all');
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Dataset Results ({filteredDatasets.length} found)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-export-results">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : filteredDatasets.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No datasets found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDatasets.map((dataset) => (
                  <div 
                    key={dataset.id} 
                    className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    data-testid={`dataset-${dataset.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getTypeIcon(dataset.type)}</span>
                          <div>
                            <h3 className="font-semibold text-lg" data-testid={`dataset-name-${dataset.id}`}>
                              {dataset.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {dataset.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(dataset.createdAt), 'MMM dd, yyyy')}
                              </span>
                              <span>{dataset.size}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" data-testid={`dataset-type-${dataset.id}`}>
                            {dataset.type}
                          </Badge>
                          <Badge 
                            className={getStatusColor(dataset.status)}
                            data-testid={`dataset-status-${dataset.id}`}
                          >
                            {dataset.status}
                          </Badge>
                        </div>

                        {dataset.metadata && (
                          <div className="text-sm text-muted-foreground">
                            {Object.entries(dataset.metadata).map(([key, value]) => (
                              <span key={key} className="mr-4">
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(dataset)}
                          data-testid={`button-view-${dataset.id}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(dataset)}
                          data-testid={`button-download-${dataset.id}`}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {dataset.status === 'processed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAnalyze(dataset)}
                            data-testid={`button-analyze-${dataset.id}`}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
