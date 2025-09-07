import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Brain, Upload, Dna, Eye, FileImage, Microscope } from 'lucide-react';

interface SpeciesPrediction {
  species: string;
  commonName: string;
  confidence: number;
  alternates: Array<{
    species: string;
    commonName: string;
    confidence: number;
  }>;
}

interface DNAMatch {
  species: string;
  commonName: string;
  similarity: number;
}

export default function AITools() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [dnaSequence, setDnaSequence] = useState('');
  const [predictionResult, setPredictionResult] = useState<SpeciesPrediction | null>(null);
  const [dnaMatches, setDnaMatches] = useState<DNAMatch[] | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const speciesPredictionMutation = useMutation({
    mutationFn: async (imageFile: File) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await apiRequest('POST', '/api/ai/species-predict', formData);
      return response.json();
    },
    onSuccess: (data) => {
      setPredictionResult(data.prediction);
      setStep(3);
      toast({
        title: "Analysis complete",
        description: "Species prediction results are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze image",
        variant: "destructive",
      });
    },
  });

  const dnaMatchMutation = useMutation({
    mutationFn: async (sequence: string) => {
      const response = await apiRequest('POST', '/api/ai/dna-match', { sequence });
      return response.json();
    },
    onSuccess: (data) => {
      setDnaMatches(data.matches);
      toast({
        title: "DNA analysis complete",
        description: "Matching results are ready.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "DNA analysis failed",
        description: error.message || "Failed to analyze DNA sequence",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setStep(2);
    }
  };

  const handleSpeciesPrediction = () => {
    if (selectedImage) {
      speciesPredictionMutation.mutate(selectedImage);
    }
  };

  const handleDNAAnalysis = () => {
    if (dnaSequence.trim()) {
      dnaMatchMutation.mutate(dnaSequence);
    } else {
      toast({
        title: "Missing DNA sequence",
        description: "Please enter a DNA sequence to analyze.",
        variant: "destructive",
      });
    }
  };

  const resetSpeciesAnalysis = () => {
    setSelectedImage(null);
    setPredictionResult(null);
    setStep(1);
  };

  const resetDNAAnalysis = () => {
    setDnaSequence('');
    setDnaMatches(null);
  };

  const breadcrumbs = [
    { label: 'AI Tools' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Tools</h1>
            <p className="text-muted-foreground">
              Advanced AI-powered analysis tools for marine research
            </p>
          </div>
        </div>

        <Tabs defaultValue="species" className="w-full" data-testid="tabs-ai-tools">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="species" data-testid="tab-species">
              <Brain className="w-4 h-4 mr-2" />
              Species Prediction
            </TabsTrigger>
            <TabsTrigger value="otolith" data-testid="tab-otolith">
              <Microscope className="w-4 h-4 mr-2" />
              Otolith Viewer
            </TabsTrigger>
            <TabsTrigger value="dna" data-testid="tab-dna">
              <Dna className="w-4 h-4 mr-2" />
              DNA Matcher
            </TabsTrigger>
          </TabsList>

          <TabsContent value="species" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Species Identification</CardTitle>
                <p className="text-muted-foreground">
                  Upload an image of a marine species for AI-powered identification
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((stepNum) => (
                      <div key={stepNum} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          step >= stepNum ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {stepNum}
                        </div>
                        <span className={`ml-2 text-sm ${step >= stepNum ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {stepNum === 1 && 'Upload Image'}
                          {stepNum === 2 && 'Analyze'}
                          {stepNum === 3 && 'Results'}
                        </span>
                        {stepNum < 3 && <div className="w-16 h-px bg-border ml-4" />}
                      </div>
                    ))}
                  </div>

                  {step === 1 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Upload Species Image</p>
                      <p className="text-muted-foreground mb-4">
                        Select a clear image of the marine species you want to identify
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="species-image-upload"
                        data-testid="input-species-image"
                      />
                      <Label htmlFor="species-image-upload">
                        <Button variant="outline" asChild>
                          <span>
                            <Upload className="w-4 h-4 mr-2" />
                            Choose Image
                          </span>
                        </Button>
                      </Label>
                    </div>
                  )}

                  {step === 2 && selectedImage && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                        <FileImage className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">{selectedImage.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedImage.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                        <Button variant="outline" onClick={resetSpeciesAnalysis} data-testid="button-change-image">
                          Change Image
                        </Button>
                      </div>

                      {speciesPredictionMutation.isPending && (
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Analyzing image...</span>
                              <span className="text-sm text-muted-foreground">Processing</span>
                            </div>
                            <Progress value={50} className="w-full" data-testid="progress-species-analysis" />
                            <p className="text-xs text-muted-foreground mt-2">
                              AI model is analyzing the image for species identification
                            </p>
                          </CardContent>
                        </Card>
                      )}

                      <Button 
                        onClick={handleSpeciesPrediction}
                        disabled={speciesPredictionMutation.isPending}
                        className="w-full"
                        data-testid="button-analyze-species"
                      >
                        {speciesPredictionMutation.isPending ? 'Analyzing...' : 'Analyze Species'}
                      </Button>
                    </div>
                  )}

                  {step === 3 && predictionResult && (
                    <div className="space-y-4">
                      <Card className="border-primary">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary" />
                            Primary Identification
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <p className="text-2xl font-bold" data-testid="text-predicted-species">
                                {predictionResult.species}
                              </p>
                              <p className="text-lg text-muted-foreground" data-testid="text-common-name">
                                {predictionResult.commonName}
                              </p>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400" data-testid="badge-confidence">
                              {(predictionResult.confidence * 100).toFixed(1)}% Confidence
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {predictionResult.alternates && predictionResult.alternates.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Alternative Matches</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {predictionResult.alternates.map((alt, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg" data-testid={`alt-match-${index}`}>
                                  <div>
                                    <p className="font-medium">{alt.species}</p>
                                    <p className="text-sm text-muted-foreground">{alt.commonName}</p>
                                  </div>
                                  <Badge variant="outline">
                                    {(alt.confidence * 100).toFixed(1)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <Button onClick={resetSpeciesAnalysis} className="w-full" data-testid="button-analyze-another">
                        Analyze Another Image
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="otolith" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3D Otolith Viewer</CardTitle>
                <p className="text-muted-foreground">
                  Interactive 3D visualization of otolith structures for age and growth analysis
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                    {/* Mock 3D viewer interface */}
                    <div className="absolute top-4 left-4 bg-background/90 p-2 rounded text-sm">
                      3D Otolith Model
                    </div>
                    <div className="absolute bottom-4 right-4 space-y-2">
                      <Button size="sm" variant="outline" data-testid="button-rotate-otolith">
                        <Eye className="w-4 h-4 mr-2" />
                        Rotate
                      </Button>
                      <Button size="sm" variant="outline" data-testid="button-measure-otolith">
                        <Microscope className="w-4 h-4 mr-2" />
                        Measure
                      </Button>
                    </div>
                    
                    {/* Mock 3D object */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-20 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-full opacity-80 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Measurements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Length:</span>
                        <span>12.4 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Width:</span>
                        <span>8.2 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thickness:</span>
                        <span>2.1 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span>213.6 mm³</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Estimated Age:</span>
                        <span>3.2 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Growth Rings:</span>
                        <span>3 detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Species:</span>
                        <span>Blue Rockfish</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span>89.3%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dna" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DNA Sequence Matcher</CardTitle>
                <p className="text-muted-foreground">
                  Input DNA sequences in FASTA format for species identification and phylogenetic analysis
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="dna-sequence">DNA Sequence (FASTA format)</Label>
                    <Textarea
                      id="dna-sequence"
                      value={dnaSequence}
                      onChange={(e) => setDnaSequence(e.target.value)}
                      placeholder=">Sample_Sequence_1&#10;ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG&#10;TCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA"
                      rows={8}
                      className="font-mono text-sm"
                      data-testid="textarea-dna-sequence"
                    />
                  </div>

                  {dnaMatchMutation.isPending && (
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Analyzing DNA sequence...</span>
                          <span className="text-sm text-muted-foreground">Processing</span>
                        </div>
                        <Progress value={75} className="w-full" data-testid="progress-dna-analysis" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Comparing against marine species database
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleDNAAnalysis}
                      disabled={dnaMatchMutation.isPending || !dnaSequence.trim()}
                      data-testid="button-analyze-dna"
                    >
                      <Dna className="w-4 h-4 mr-2" />
                      {dnaMatchMutation.isPending ? 'Analyzing...' : 'Analyze DNA'}
                    </Button>
                    <Button variant="outline" onClick={resetDNAAnalysis} data-testid="button-clear-dna">
                      Clear
                    </Button>
                  </div>

                  {dnaMatches && dnaMatches.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>DNA Matches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {dnaMatches.map((match, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg" data-testid={`dna-match-${index}`}>
                              <div>
                                <p className="font-medium">{match.species}</p>
                                <p className="text-sm text-muted-foreground">{match.commonName}</p>
                              </div>
                              <div className="text-right">
                                <Badge className={
                                  match.similarity > 95 ? 'bg-green-500/20 text-green-400' :
                                  match.similarity > 90 ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }>
                                  {match.similarity.toFixed(1)}% Match
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
