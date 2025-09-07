import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Download, BarChart3, Calendar, FileSpreadsheet, Image, Settings } from 'lucide-react';

interface ReportConfig {
  type: string;
  title: string;
  description: string;
  datasets: string[];
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeRawData: boolean;
  includeAnalysis: boolean;
  format: 'pdf' | 'csv' | 'excel';
}

export default function Reports() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: '',
    title: '',
    description: '',
    datasets: [],
    dateRange: {
      start: '',
      end: '',
    },
    includeCharts: true,
    includeRawData: false,
    includeAnalysis: true,
    format: 'pdf',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recentReports, setRecentReports] = useState([
    {
      id: '1',
      title: 'Pacific Kelp Survey Analysis',
      type: 'Species Analysis',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'completed',
      format: 'pdf',
      size: '2.4 MB',
    },
    {
      id: '2',
      title: 'Monthly Biodiversity Summary',
      type: 'Biodiversity Report',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed',
      format: 'excel',
      size: '1.8 MB',
    },
    {
      id: '3',
      title: 'Temperature Trends Q3 2024',
      type: 'Environmental Report',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      format: 'pdf',
      size: '3.1 MB',
    },
  ]);

  const { toast } = useToast();

  const reportTypes = [
    {
      id: 'species-analysis',
      name: 'Species Analysis',
      description: 'Comprehensive analysis of species distribution and abundance',
      icon: BarChart3,
    },
    {
      id: 'biodiversity',
      name: 'Biodiversity Report',
      description: 'Assessment of biodiversity indices and ecosystem health',
      icon: FileText,
    },
    {
      id: 'environmental',
      name: 'Environmental Report',
      description: 'Environmental conditions and oceanographic parameters',
      icon: Settings,
    },
    {
      id: 'custom',
      name: 'Custom Report',
      description: 'Build a custom report with selected datasets and parameters',
      icon: FileSpreadsheet,
    },
  ];

  const availableDatasets = [
    'Pacific Kelp Survey 2024',
    'Coral Reef eDNA Samples',
    'Salmon Migration Data',
    'Temperature Monitoring Network',
    'Plankton Distribution Study',
  ];

  const handleGenerateReport = async () => {
    if (!reportConfig.type || !reportConfig.title) {
      toast({
        title: "Missing required fields",
        description: "Please select a report type and enter a title.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate report generation with progress
    const progressSteps = [
      { step: 'Collecting data...', progress: 20 },
      { step: 'Processing datasets...', progress: 40 },
      { step: 'Generating charts...', progress: 60 },
      { step: 'Compiling report...', progress: 80 },
      { step: 'Finalizing...', progress: 100 },
    ];

    for (const { step, progress } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(progress);
      
      if (progress < 100) {
        toast({
          title: step,
          description: `Report generation ${progress}% complete`,
        });
      }
    }

    // Add new report to recent reports
    const newReport = {
      id: Date.now().toString(),
      title: reportConfig.title,
      type: reportTypes.find(t => t.id === reportConfig.type)?.name || 'Custom Report',
      generatedAt: new Date(),
      status: 'completed',
      format: reportConfig.format,
      size: '2.1 MB',
    };

    setRecentReports(prev => [newReport, ...prev]);
    setIsGenerating(false);
    setGenerationProgress(0);

    toast({
      title: "Report generated successfully",
      description: "Your report is ready for download.",
    });
  };

  const handleDownloadReport = (reportId: string) => {
    // In a real app, this would trigger actual download
    console.log('Downloading report:', reportId);
    toast({
      title: "Download started",
      description: "Your report download has begun.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'generating':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const breadcrumbs = [
    { label: 'Reports' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Report Generation</h1>
            <p className="text-muted-foreground">
              Generate comprehensive reports from your marine research data
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Report Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          reportConfig.type === type.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setReportConfig(prev => ({ ...prev, type: type.id }))}
                        data-testid={`report-type-${type.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-medium mb-1">{type.name}</h3>
                            <p className="text-sm text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Report Configuration */}
            {reportConfig.type && (
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input
                        id="report-title"
                        value={reportConfig.title}
                        onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter report title"
                        data-testid="input-report-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="report-format">Output Format</Label>
                      <Select
                        value={reportConfig.format}
                        onValueChange={(value: 'pdf' | 'csv' | 'excel') => 
                          setReportConfig(prev => ({ ...prev, format: value }))
                        }
                      >
                        <SelectTrigger id="report-format" data-testid="select-report-format">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">Excel Workbook</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report-description">Description (Optional)</Label>
                    <Textarea
                      id="report-description"
                      value={reportConfig.description}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the report purpose..."
                      rows={3}
                      data-testid="textarea-report-description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date-start">Start Date</Label>
                      <Input
                        id="date-start"
                        type="date"
                        value={reportConfig.dateRange.start}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, start: e.target.value }
                        }))}
                        data-testid="input-date-start"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date-end">End Date</Label>
                      <Input
                        id="date-end"
                        type="date"
                        value={reportConfig.dateRange.end}
                        onChange={(e) => setReportConfig(prev => ({
                          ...prev,
                          dateRange: { ...prev.dateRange, end: e.target.value }
                        }))}
                        data-testid="input-date-end"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Datasets to Include</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border border-border rounded p-3">
                      {availableDatasets.map((dataset) => (
                        <div key={dataset} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dataset-${dataset}`}
                            checked={reportConfig.datasets.includes(dataset)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setReportConfig(prev => ({
                                  ...prev,
                                  datasets: [...prev.datasets, dataset]
                                }));
                              } else {
                                setReportConfig(prev => ({
                                  ...prev,
                                  datasets: prev.datasets.filter(d => d !== dataset)
                                }));
                              }
                            }}
                            data-testid={`checkbox-dataset-${dataset.replace(/\s+/g, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={`dataset-${dataset}`} className="text-sm">
                            {dataset}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Report Content</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-charts"
                          checked={reportConfig.includeCharts}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeCharts: !!checked }))
                          }
                          data-testid="checkbox-include-charts"
                        />
                        <Label htmlFor="include-charts">Include Charts and Visualizations</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-analysis"
                          checked={reportConfig.includeAnalysis}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeAnalysis: !!checked }))
                          }
                          data-testid="checkbox-include-analysis"
                        />
                        <Label htmlFor="include-analysis">Include Statistical Analysis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-raw-data"
                          checked={reportConfig.includeRawData}
                          onCheckedChange={(checked) => 
                            setReportConfig(prev => ({ ...prev, includeRawData: !!checked }))
                          }
                          data-testid="checkbox-include-raw-data"
                        />
                        <Label htmlFor="include-raw-data">Include Raw Data Tables</Label>
                      </div>
                    </div>
                  </div>

                  {isGenerating && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Generating report...</span>
                          <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                        </div>
                        <Progress value={generationProgress} className="w-full" data-testid="progress-report-generation" />
                      </CardContent>
                    </Card>
                  )}

                  <Button 
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="w-full"
                    data-testid="button-generate-report"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating Report...' : 'Generate Report'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recent Reports */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="p-4 border border-border rounded-lg"
                    data-testid={`recent-report-${report.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1" data-testid={`report-title-${report.id}`}>
                          {report.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{report.type}</p>
                      </div>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.generatedAt.toLocaleDateString()}
                      </span>
                      <span>{report.size}</span>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleDownloadReport(report.id)}
                      data-testid={`button-download-${report.id}`}
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download {report.format.toUpperCase()}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
