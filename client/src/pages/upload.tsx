import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Upload, FileText, Dna, Fish } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface UploadData {
  name: string;
  type: string;
  location: string;
  description: string;
  files: File[];
}

export default function UploadPage() {
  const [activeTab, setActiveTab] = useState('ocean');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (data: Omit<UploadData, 'files'> & { size: string }) => {
      const response = await apiRequest('POST', '/api/upload', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Upload successful",
        description: "Your data has been uploaded and is being processed.",
      });
      setUploadProgress(100);
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload data",
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const handleUpload = (data: UploadData) => {
    setUploading(true);
    setUploadProgress(10);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    const totalSize = data.files.reduce((acc, file) => acc + file.size, 0);
    const sizeInMB = (totalSize / (1024 * 1024)).toFixed(1);

    uploadMutation.mutate({
      name: data.name,
      type: data.type,
      location: data.location,
      description: data.description,
      size: `${sizeInMB} MB`,
    });
  };

  const FileUploadZone = ({ onDrop, accept }: { onDrop: (files: File[]) => void; accept: string }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: { [accept]: [] },
      multiple: true,
    });

    return (
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "hover:border-primary/50"
        )}
        data-testid="dropzone-upload"
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">
          {isDragActive ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-muted-foreground mb-4">or click to select files</p>
        <Button variant="outline" type="button" data-testid="button-select-files">
          Select Files
        </Button>
      </div>
    );
  };

  const UploadForm = ({ type }: { type: string }) => {
    const [formData, setFormData] = useState<UploadData>({
      name: '',
      type,
      location: '',
      description: '',
      files: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name || !formData.location || formData.files.length === 0) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields and select files to upload.",
          variant: "destructive",
        });
        return;
      }
      handleUpload(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <FileUploadZone
          onDrop={(files) => setFormData(prev => ({ ...prev, files }))}
          accept="*/*"
        />

        {formData.files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {formData.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm" data-testid={`file-${index}`}>{file.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Dataset Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter dataset name"
              required
              data-testid="input-dataset-name"
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Pacific Ocean, California Coast"
              required
              data-testid="input-location"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your dataset..."
            rows={3}
            data-testid="textarea-description"
          />
        </div>

        {uploading && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" data-testid="progress-upload" />
            </CardContent>
          </Card>
        )}

        <Button type="submit" disabled={uploading} className="w-full" data-testid="button-upload">
          {uploading ? 'Uploading...' : 'Upload Dataset'}
        </Button>
      </form>
    );
  };

  const uploadTabs = [
    { id: 'ocean', label: 'Ocean Data', icon: Upload, type: 'Ocean Data' },
    { id: 'fish', label: 'Fish Data', icon: Fish, type: 'Fish Data' },
    { id: 'otoliths', label: 'Otoliths', icon: FileText, type: 'Otolith Data' },
    { id: 'edna', label: 'eDNA', icon: Dna, type: 'eDNA' },
  ];

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Upload Data' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Data</h1>
          <p className="text-muted-foreground">
            Upload your marine research data for analysis and processing.
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4" data-testid="tabs-upload-types">
                {uploadTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="flex items-center gap-2"
                      data-testid={`tab-${tab.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {uploadTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{tab.label} Upload</h3>
                    <p className="text-muted-foreground text-sm">
                      {tab.id === 'ocean' && "Upload oceanographic data including temperature, salinity, and current measurements."}
                      {tab.id === 'fish' && "Upload fish population data, catch records, and biological measurements."}
                      {tab.id === 'otoliths' && "Upload otolith images and morphological data for age and growth analysis."}
                      {tab.id === 'edna' && "Upload environmental DNA samples for biodiversity assessment."}
                    </p>
                  </div>
                  <UploadForm type={tab.type} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
