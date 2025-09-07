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
import { Brain, Upload, Dna, Eye, FileImage, Microscope, Sparkles, Waves } from 'lucide-react';

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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-48 h-48 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 p-6 space-y-8 max-w-7xl mx-auto">
          {/* Hero Header */}
          <div className="text-center space-y-6 py-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-pulse">
                <Brain className="w-12 h-12 text-purple-400" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent mb-4">
                AI Tools
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Advanced AI-powered analysis tools for marine research and species identification
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-xl px-6 py-3 transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                <Sparkles className="w-5 h-5 mr-2" />
                Quick Analysis
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-6 py-3">
                <Upload className="w-5 h-5 mr-2" />
                Batch Upload
              </Button>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-xl px-6 py-3">
                <Eye className="w-5 h-5 mr-2" />
                View Results
              </Button>
            </div>
          </div>

          <Tabs defaultValue="species" className="w-full" data-testid="tabs-ai-tools">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl border border-white/10 p-1 rounded-xl">
            <TabsTrigger 
              value="species" 
              data-testid="tab-species"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/20 data-[state=active]:to-emerald-600/20 data-[state=active]:text-white data-[state=active]:border-blue-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Brain className="w-4 h-4 mr-2" />
              Species Prediction
            </TabsTrigger>
            <TabsTrigger 
              value="otolith" 
              data-testid="tab-otolith"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600/20 data-[state=active]:to-yellow-600/20 data-[state=active]:text-white data-[state=active]:border-orange-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Microscope className="w-4 h-4 mr-2" />
              Otolith Viewer
            </TabsTrigger>
            <TabsTrigger 
              value="dna" 
              data-testid="tab-dna"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/20 data-[state=active]:to-pink-600/20 data-[state=active]:text-white data-[state=active]:border-purple-500/30 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-lg border border-transparent"
            >
              <Dna className="w-4 h-4 mr-2" />
              DNA Matcher
            </TabsTrigger>
          </TabsList>

            <TabsContent value="species" className="space-y-6">
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-400" />
                    Species Identification
                  </CardTitle>
                  <p className="text-slate-400">
                    Upload an image of a marine species for AI-powered identification
                  </p>
                </CardHeader>
                <CardContent className="p-6">
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
                    <div className="relative group">
                      {/* Enhanced Dropbox with Glassmorphism */}
                      <div className="bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 hover:border-blue-400/50 rounded-2xl p-12 text-center transition-all duration-300 group-hover:bg-white/10">
                        {/* Animated particles */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                          <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
                          <div className="absolute top-8 right-8 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse delay-300"></div>
                          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-teal-400/60 rounded-full animate-bounce delay-700"></div>
                        </div>
                        
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <FileImage className="w-8 h-8 text-blue-400" />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-3">Upload Species Image</h3>
                          <p className="text-slate-400 mb-8 max-w-md mx-auto">
                            Drag and drop or click to select a clear image of the marine species you want to identify
                          </p>
                          
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="species-image-upload"
                            data-testid="input-species-image"
                          />
                          <label 
                            htmlFor="species-image-upload"
                            className="group/btn relative inline-flex items-center gap-3 cursor-pointer overflow-hidden bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/50 hover:border-blue-400/70 hover:from-blue-500/30 hover:to-purple-500/30 backdrop-blur-xl transition-all duration-300 px-8 py-4 font-semibold hover:scale-105 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 rounded-xl"
                          >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                            
                            {/* Icon Container */}
                            <div className="relative z-10 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover/btn:rotate-12 transition-transform duration-300 shadow-lg">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                            
                            {/* Text Content */}
                            <div className="relative z-10 text-left">
                              <div className="text-white font-bold text-lg">Choose Image</div>
                              <div className="text-blue-200 text-sm font-normal">Upload marine species photo</div>
                            </div>
                            
                            {/* Pulse Ring Effect */}
                            <div className="absolute inset-0 rounded-xl border-2 border-blue-400/0 group-hover/btn:border-blue-400/50 group-hover/btn:animate-pulse transition-all duration-300"></div>
                          </label>
                        </div>
                      </div>
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
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-orange-400" />
                    3D Otolith Viewer
                  </CardTitle>
                  <p className="text-slate-400">
                    Interactive 3D visualization of otolith structures for age and growth analysis
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
                    {/* Mock 3D viewer interface */}
                    <div className="absolute top-4 left-4 bg-background/90 p-2 rounded text-sm">
                      3D Otolith Model
                    </div>
                    <div className="absolute bottom-6 right-6 flex gap-4">
                      <button 
                        className="group relative overflow-hidden bg-gradient-to-r from-orange-500/20 to-yellow-500/20 backdrop-blur-xl border border-orange-500/50 hover:border-orange-400/70 hover:from-orange-500/30 hover:to-yellow-500/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
                        data-testid="button-rotate-otolith"
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold">Rotate</span>
                        </div>
                        
                        {/* Pulse Ring Effect */}
                        <div className="absolute inset-0 rounded-xl border-2 border-orange-400/0 group-hover:border-orange-400/50 group-hover:animate-pulse transition-all duration-300"></div>
                      </button>
                      
                      <button 
                        className="group relative overflow-hidden bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-teal-500/50 hover:border-teal-400/70 hover:from-teal-500/30 hover:to-cyan-500/30 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40"
                        data-testid="button-measure-otolith"
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        
                        <div className="relative z-10 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                            <Microscope className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold">Measure</span>
                        </div>
                        
                        {/* Pulse Ring Effect */}
                        <div className="absolute inset-0 rounded-xl border-2 border-teal-400/0 group-hover:border-teal-400/50 group-hover:animate-pulse transition-all duration-300"></div>
                      </button>
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
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Dna className="w-5 h-5 text-purple-400" />
                    DNA Sequence Matcher
                  </CardTitle>
                  <p className="text-slate-400">
                    Input DNA sequences in FASTA format for species identification and phylogenetic analysis
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="dna-sequence" className="text-slate-300">DNA Sequence (FASTA format)</Label>
                    <Textarea
                      id="dna-sequence"
                      value={dnaSequence}
                      onChange={(e) => setDnaSequence(e.target.value)}
                      placeholder=">Sample_Sequence_1&#10;ATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCG&#10;TCGATCGATCGATCGATCGATCGATCGATCGATCGATCGATCGA"
                      rows={8}
                      className="font-mono text-sm bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-purple-400/50 focus:ring-purple-400/20 rounded-xl mt-2"
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
      </div>
    </Layout>
  );
}
