import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Download, Map, BarChart3, Layers, ZoomIn } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

// Mock data for charts
const temperatureData = [
  { month: 'Jan', fish: 65, coral: 82, plankton: 78 },
  { month: 'Feb', fish: 68, coral: 85, plankton: 82 },
  { month: 'Mar', fish: 72, coral: 88, plankton: 85 },
  { month: 'Apr', fish: 75, coral: 92, plankton: 88 },
  { month: 'May', fish: 78, coral: 95, plankton: 92 },
  { month: 'Jun', fish: 82, coral: 98, plankton: 95 },
];

const scatterData = [
  { temperature: 18, ph: 8.1 }, { temperature: 19, ph: 8.0 },
  { temperature: 20, ph: 7.9 }, { temperature: 21, ph: 7.8 },
  { temperature: 22, ph: 7.7 }, { temperature: 23, ph: 7.6 },
  { temperature: 24, ph: 7.5 }, { temperature: 25, ph: 7.4 },
];

export default function Visualize() {
  const [selectedDataset, setSelectedDataset] = useState('kelp-survey');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showCurrents, setShowCurrents] = useState(false);
  const [showSpecies, setShowSpecies] = useState(true);

  const handleExportPNG = () => {
    console.log('Exporting as PNG...');
  };

  const handleExportCSV = () => {
    console.log('Exporting as CSV...');
  };

  const breadcrumbs = [
    { label: 'Visualizations' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Data Visualizations</h1>
            <p className="text-muted-foreground">
              Interactive maps and charts for marine data analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPNG} data-testid="button-export-png">
              <Download className="w-4 h-4 mr-2" />
              Export PNG
            </Button>
            <Button variant="outline" onClick={handleExportCSV} data-testid="button-export-csv">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Tabs defaultValue="map" className="w-full" data-testid="tabs-visualization">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="map" data-testid="tab-map">
              <Map className="w-4 h-4 mr-2" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="charts" data-testid="tab-charts">
              <BarChart3 className="w-4 h-4 mr-2" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="layers" data-testid="tab-layers">
              <Layers className="w-4 h-4 mr-2" />
              Layer Control
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map Controls */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Map Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="dataset-select">Dataset</Label>
                    <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                      <SelectTrigger id="dataset-select" data-testid="select-dataset">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kelp-survey">Pacific Kelp Survey</SelectItem>
                        <SelectItem value="coral-reef">Coral Reef eDNA</SelectItem>
                        <SelectItem value="salmon-migration">Salmon Migration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="heatmap-toggle">Temperature Heatmap</Label>
                      <Switch
                        id="heatmap-toggle"
                        checked={showHeatmap}
                        onCheckedChange={setShowHeatmap}
                        data-testid="switch-heatmap"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="currents-toggle">Ocean Currents</Label>
                      <Switch
                        id="currents-toggle"
                        checked={showCurrents}
                        onCheckedChange={setShowCurrents}
                        data-testid="switch-currents"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="species-toggle">Species Points</Label>
                      <Switch
                        id="species-toggle"
                        checked={showSpecies}
                        onCheckedChange={setShowSpecies}
                        data-testid="switch-species"
                      />
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" data-testid="button-zoom-to-data">
                    <ZoomIn className="w-4 h-4 mr-2" />
                    Zoom to Data
                  </Button>
                </CardContent>
              </Card>

              {/* Map Area */}
              <Card className="lg:col-span-3">
                <CardContent className="p-0">
                  <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Mock Map Interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
                      {/* Sample points */}
                      {showSpecies && (
                        <>
                          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse" data-testid="map-point-1" />
                          <div className="absolute top-2/3 left-1/2 w-4 h-4 bg-chart-2 rounded-full animate-pulse" data-testid="map-point-2" />
                          <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-chart-3 rounded-full animate-pulse" data-testid="map-point-3" />
                        </>
                      )}
                      
                      {/* Heatmap overlay */}
                      {showHeatmap && (
                        <div className="absolute inset-0 bg-gradient-radial from-red-500/30 via-yellow-500/20 to-transparent" />
                      )}
                      
                      {/* Current vectors */}
                      {showCurrents && (
                        <>
                          <div className="absolute top-1/3 left-1/4 w-16 h-1 bg-white/60 transform rotate-45" />
                          <div className="absolute top-2/3 right-1/4 w-16 h-1 bg-white/60 transform rotate-12" />
                        </>
                      )}
                    </div>
                    
                    <div className="absolute bottom-4 right-4 bg-background/90 p-2 rounded text-sm">
                      Interactive Ocean Map
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sample Point Details */}
            <Card>
              <CardHeader>
                <CardTitle>Sample Point Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg" data-testid="sample-point-details-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-primary rounded-full" />
                      <span className="font-medium">Point A</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">37.7749°N, 122.4194°W</p>
                    <div className="text-sm space-y-1">
                      <p>Temperature: 18.5°C</p>
                      <p>Salinity: 34.2 PSU</p>
                      <p>Species: Blue Rockfish</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg" data-testid="sample-point-details-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-chart-2 rounded-full" />
                      <span className="font-medium">Point B</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">36.9741°N, 122.0308°W</p>
                    <div className="text-sm space-y-1">
                      <p>Temperature: 16.8°C</p>
                      <p>Salinity: 33.9 PSU</p>
                      <p>Species: Kelp Bass</p>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg" data-testid="sample-point-details-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-chart-3 rounded-full" />
                      <span className="font-medium">Point C</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">35.6870°N, 121.1817°W</p>
                    <div className="text-sm space-y-1">
                      <p>Temperature: 19.2°C</p>
                      <p>Salinity: 34.5 PSU</p>
                      <p>Species: Yellowtail</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Species Distribution Chart */}
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle>Species Distribution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={temperatureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="fish" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="coral" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      <Line type="monotone" dataKey="plankton" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Temperature vs pH Correlation */}
              <Card className="chart-container">
                <CardHeader>
                  <CardTitle>Temperature vs pH Correlation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="temperature" name="Temperature" unit="°C" />
                      <YAxis dataKey="ph" name="pH" domain={[7, 8.5]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter name="Samples" dataKey="ph" fill="hsl(var(--primary))" />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-3 bg-accent/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-primary">R² = 0.847</strong> - Strong negative correlation detected
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="layers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Layers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {[
                      { name: 'Bathymetry', enabled: true, color: 'bg-blue-500' },
                      { name: 'Temperature', enabled: showHeatmap, color: 'bg-red-500' },
                      { name: 'Salinity', enabled: false, color: 'bg-green-500' },
                      { name: 'Currents', enabled: showCurrents, color: 'bg-purple-500' },
                      { name: 'Species Density', enabled: showSpecies, color: 'bg-yellow-500' },
                      { name: 'Fishing Zones', enabled: false, color: 'bg-orange-500' },
                    ].map((layer) => (
                      <div key={layer.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${layer.color} rounded`} />
                          <span className="font-medium">{layer.name}</span>
                        </div>
                        <Switch checked={layer.enabled} readOnly />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Layer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Opacity</Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-full mt-2"
                      data-testid="slider-opacity"
                    />
                  </div>
                  
                  <div>
                    <Label>Time Range</Label>
                    <Select defaultValue="last-month">
                      <SelectTrigger className="mt-2" data-testid="select-time-range">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="last-week">Last Week</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="last-year">Last Year</SelectItem>
                        <SelectItem value="all-time">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Color Scale</Label>
                    <Select defaultValue="viridis">
                      <SelectTrigger className="mt-2" data-testid="select-color-scale">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viridis">Viridis</SelectItem>
                        <SelectItem value="plasma">Plasma</SelectItem>
                        <SelectItem value="inferno">Inferno</SelectItem>
                        <SelectItem value="turbo">Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
