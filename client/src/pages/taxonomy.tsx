import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronDown, 
  ChevronRight, 
  TreePine, 
  Search, 
  Filter,
  BookOpen,
  Globe,
  Eye,
  BarChart3,
  Info,
  MapPin,
  Waves,
  Fish,
  Heart,
  Shield,
  AlertTriangle,
  Download,
  Share2,
  Grid3X3,
  Star,
  Microscope,
  Camera,
  Layers,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Layout } from '@/components/layout/Layout';

// Custom CSS for enhanced scrollbar and animations
const customStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(59, 130, 246, 0.5) rgba(30, 41, 59, 0.3);
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.3);
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, rgba(59, 130, 246, 0.6), rgba(16, 185, 129, 0.6));
    border-radius: 4px;
    border: 1px solid rgba(71, 85, 105, 0.3);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8));
  }
  
  .ocean-gradient {
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(16, 185, 129, 0.1) 25%, 
      rgba(139, 92, 246, 0.1) 50%, 
      rgba(236, 72, 153, 0.1) 75%, 
      rgba(251, 146, 60, 0.1) 100%);
  }
  
  .floating-animation {
    animation: float 6s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes pulse-glow {
    from { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    to { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
  }
`;

interface TaxonomyNode {
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  species?: string[];
  children?: TaxonomyNode[];
}

interface SpeciesProfile {
  scientificName: string;
  commonName: string;
  habitat: string;
  distribution: string;
  conservation: string;
  description: string;
  characteristics: string[];
  imageUrl?: string;
}

export default function Taxonomy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const { data: taxonomyTree, isLoading } = useQuery<TaxonomyNode>({
    queryKey: ['/api/taxonomy/tree'],
  });

  // Mock species profile data
  const getSpeciesProfile = (species: string): SpeciesProfile => {
    const profiles: Record<string, SpeciesProfile> = {
      'Thunnus thynnus': {
        scientificName: 'Thunnus thynnus',
        commonName: 'Atlantic Bluefin Tuna',
        habitat: 'Pelagic, open ocean',
        distribution: 'North Atlantic Ocean',
        conservation: 'Endangered',
        description: 'The Atlantic bluefin tuna is a species of tuna native to both the western and eastern Atlantic Ocean, as well as the Mediterranean Sea.',
        characteristics: [
          'Large size up to 4.6m length',
          'Dark blue dorsally, silver ventrally',
          'Highly migratory',
          'Warm-blooded (endothermic)',
          'Fast swimmer up to 70 km/h'
        ],
      },
      'Katsuwonus pelamis': {
        scientificName: 'Katsuwonus pelamis',
        commonName: 'Skipjack Tuna',
        habitat: 'Epipelagic zone of tropical and warm-temperate oceans',
        distribution: 'Worldwide in tropical and subtropical waters',
        conservation: 'Least Concern',
        description: 'The skipjack tuna is a medium-sized perciform fish in the tuna family Scombridae.',
        characteristics: [
          'Streamlined body shape',
          'Dark horizontal stripes on lower sides',
          'Size typically 40-100cm',
          'Schooling behavior',
          'Important commercial species'
        ],
      },
      'Seriola dumerili': {
        scientificName: 'Seriola dumerili',
        commonName: 'Greater Amberjack',
        habitat: 'Reef-associated, pelagic-neritic',
        distribution: 'Western and Eastern Atlantic, Mediterranean',
        conservation: 'Near Threatened',
        description: 'The greater amberjack is a jack of the genus Seriola. It is found in temperate, subtropical, and tropical seas around the world.',
        characteristics: [
          'Robust, elongated body',
          'Bronze-olive coloration',
          'Can reach 1.9m in length',
          'Predatory behavior',
          'Popular sport fish'
        ],
      },
      'Caranx hippos': {
        scientificName: 'Caranx hippos',
        commonName: 'Crevalle Jack',
        habitat: 'Coastal waters, estuaries',
        distribution: 'Western Atlantic from Nova Scotia to Uruguay',
        conservation: 'Least Concern',
        description: 'The crevalle jack is a common species of large marine fish classified within the jack family, Carangidae.',
        characteristics: [
          'Deep, compressed body',
          'Golden-yellow to silvery coloration',
          'Size up to 1.2m length',
          'Aggressive predator',
          'Forms large schools'
        ],
      },
    };

    return profiles[species] || {
      scientificName: species,
      commonName: 'Unknown Species',
      habitat: 'Marine environment',
      distribution: 'Various locations',
      conservation: 'Not Assessed',
      description: 'Species information not available.',
      characteristics: ['Information pending'],
    };
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTaxonomyLevel = (
    node: TaxonomyNode, 
    level: number = 0, 
    parentPath: string = ''
  ): React.ReactNode => {
    if (!node) return null;

    const entries = [
      node.kingdom && { type: 'kingdom', value: node.kingdom },
      node.phylum && { type: 'phylum', value: node.phylum },
      node.class && { type: 'class', value: node.class },
      node.order && { type: 'order', value: node.order },
      node.family && { type: 'family', value: node.family },
    ].filter(Boolean);

    const getTaxonomyColor = (type: string) => {
      switch (type) {
        case 'kingdom': return 'from-purple-500/20 to-purple-600/20 text-purple-300 border-purple-500/30';
        case 'phylum': return 'from-blue-500/20 to-blue-600/20 text-blue-300 border-blue-500/30';
        case 'class': return 'from-emerald-500/20 to-emerald-600/20 text-emerald-300 border-emerald-500/30';
        case 'order': return 'from-yellow-500/20 to-yellow-600/20 text-yellow-300 border-yellow-500/30';
        case 'family': return 'from-red-500/20 to-red-600/20 text-red-300 border-red-500/30';
        default: return 'from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30';
      }
    };

    return (
      <div>
        {entries.map((entry, index) => {
          if (!entry) return null;
          
          const nodePath = `${parentPath}/${entry.type}/${entry.value}`;
          const isExpanded = expandedNodes.has(nodePath);
          const hasChildren = node.children && node.children.length > 0;
          const hasSpecies = node.species && node.species.length > 0;
          const colorClasses = getTaxonomyColor(entry.type);

          return (
            <div key={nodePath} style={{ marginLeft: `${level * 16}px` }}>
              <div 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                  "hover:bg-white/10 hover:scale-105 hover:shadow-lg",
                  `bg-gradient-to-r ${colorClasses}`,
                  isExpanded && "bg-white/10 shadow-md"
                )}
                onClick={() => toggleNode(nodePath)}
                data-testid={`taxonomy-node-${entry.type}-${entry.value}`}
              >
                <div className="flex items-center gap-2 flex-1">
                  {(hasChildren || hasSpecies) && (
                    <div className="transition-transform duration-200">
                      {isExpanded ? 
                        <ChevronDown className="w-4 h-4 text-white" /> : 
                        <ChevronRight className="w-4 h-4 text-white" />
                      }
                    </div>
                  )}
                  <div className="p-1 bg-white/20 rounded">
                    <TreePine className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold capitalize text-white text-sm">{entry.type}</span>
                  <span className="italic font-medium">{entry.value}</span>
                </div>
                {(hasChildren || hasSpecies) && (
                  <div className="text-xs bg-white/20 px-2 py-1 rounded-full text-white">
                    {hasChildren ? node.children?.length : node.species?.length}
                  </div>
                )}
              </div>

              {isExpanded && hasChildren && (
                <div className="mt-2 space-y-1">
                  {node.children?.map((child, childIndex) => (
                    <div key={childIndex}>
                      {renderTaxonomyLevel(child, level + 1, nodePath)}
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && hasSpecies && (
                <div className="mt-2 space-y-1" style={{ marginLeft: `${(level + 1) * 16}px` }}>
                  {node.species?.map((species, speciesIndex) => (
                    <div 
                      key={speciesIndex}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border border-white/10",
                        "bg-gradient-to-r from-teal-500/10 to-blue-500/10 hover:from-teal-500/20 hover:to-blue-500/20",
                        "hover:scale-105 hover:shadow-lg",
                        selectedSpecies === species && "bg-gradient-to-r from-teal-500/30 to-blue-500/30 shadow-lg scale-105"
                      )}
                      onClick={() => setSelectedSpecies(species)}
                      data-testid={`species-${species.replace(' ', '-')}`}
                    >
                      <div className="p-1 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded">
                        <Fish className="w-4 h-4 text-teal-300" />
                      </div>
                      <span className="italic text-teal-300 font-medium flex-1">{species}</span>
                      <Eye className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const filteredSpecies = selectedSpecies ? getSpeciesProfile(selectedSpecies) : null;

  const breadcrumbs = [
    { label: 'Taxonomy Browser' },
  ];

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <style>{customStyles}</style>
      
      {/* Full Screen Advanced Layout */}
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl floating-animation" />
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl floating-animation" style={{animationDelay: '4s'}} />
        </div>
        
        {/* Hero Header */}
        <div className="relative z-10 px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-4 mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-2xl backdrop-blur-xl border border-white/10 pulse-glow">
                  <Microscope className="w-12 h-12 text-blue-400" />
                </div>
                <div className="text-left">
                  <h1 className="text-6xl font-black bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                    Marine Taxonomy
                  </h1>
                  <p className="text-2xl text-slate-300 font-light">
                    Advanced Species Classification System
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-4 text-lg">
                  <Download className="w-5 h-5 mr-3" />
                  Export Database
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-8 py-4 text-lg">
                  <Share2 className="w-5 h-5 mr-3" />
                  Share Collection
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl px-8 py-4 text-lg">
                  <Camera className="w-5 h-5 mr-3" />
                  Gallery View
                </Button>
              </div>
              
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 pulse-glow">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl mb-4">
                      <Fish className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-blue-300 text-lg font-semibold mb-2">Marine Species</p>
                    <p className="text-4xl font-black text-white">2,847</p>
                    <p className="text-blue-400/70 text-sm mt-1">+127 this month</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-500/10 to-teal-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '0.5s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-teal-500/20 to-teal-600/20 rounded-2xl mb-4">
                      <TreePine className="w-10 h-10 text-teal-400" />
                    </div>
                    <p className="text-teal-300 text-lg font-semibold mb-2">Families</p>
                    <p className="text-4xl font-black text-white">156</p>
                    <p className="text-teal-400/70 text-sm mt-1">Across 8 kingdoms</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '1s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl mb-4">
                      <Globe className="w-10 h-10 text-emerald-400" />
                    </div>
                    <p className="text-emerald-300 text-lg font-semibold mb-2">Ecosystems</p>
                    <p className="text-4xl font-black text-white">89</p>
                    <p className="text-emerald-400/70 text-sm mt-1">Global coverage</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-2xl rounded-3xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 pulse-glow" style={{animationDelay: '1.5s'}}>
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl mb-4">
                      <Layers className="w-10 h-10 text-purple-400" />
                    </div>
                    <p className="text-purple-300 text-lg font-semibold mb-2">Research</p>
                    <p className="text-4xl font-black text-white">1,234</p>
                    <p className="text-purple-400/70 text-sm mt-1">Active studies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Search Bar */}
        <div className="relative z-10 px-8 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                <div className="flex-1 relative min-w-0">
                  <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Search marine species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 rounded-2xl w-full"
                    data-testid="input-search-taxonomy"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-3">
                  <Select>
                    <SelectTrigger className="w-full sm:w-48 h-14 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Conservation Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Status</SelectItem>
                      <SelectItem value="endangered" className="text-red-400 hover:bg-red-500/20 focus:bg-red-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Endangered
                        </div>
                      </SelectItem>
                      <SelectItem value="threatened" className="text-orange-400 hover:bg-orange-500/20 focus:bg-orange-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Near Threatened
                        </div>
                      </SelectItem>
                      <SelectItem value="concern" className="text-green-400 hover:bg-green-500/20 focus:bg-green-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Least Concern
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select>
                    <SelectTrigger className="w-full sm:w-48 h-14 bg-white/5 border-white/10 text-white backdrop-blur-xl hover:bg-white/10 transition-all duration-200 rounded-2xl">
                      <SelectValue placeholder="Habitat Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900/95 border-slate-700/50 backdrop-blur-xl">
                      <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10">All Habitats</SelectItem>
                      <SelectItem value="reef" className="text-blue-400 hover:bg-blue-500/20 focus:bg-blue-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Coral Reef
                        </div>
                      </SelectItem>
                      <SelectItem value="deep" className="text-purple-400 hover:bg-purple-500/20 focus:bg-purple-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          Deep Sea
                        </div>
                      </SelectItem>
                      <SelectItem value="coastal" className="text-teal-400 hover:bg-teal-500/20 focus:bg-teal-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                          Coastal Waters
                        </div>
                      </SelectItem>
                      <SelectItem value="pelagic" className="text-cyan-400 hover:bg-cyan-500/20 focus:bg-cyan-500/20">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          Pelagic Zone
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="h-14 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white border-0 rounded-2xl text-lg font-semibold px-8 whitespace-nowrap">
                    <Filter className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="relative z-10 px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Ultra-Modern Taxonomy Tree */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl">
                          <TreePine className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white">Taxonomic Explorer</h2>
                          <p className="text-slate-300">Interactive classification tree</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Layers className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Zap className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-white/10 rounded-lg animate-pulse" />
                              <div className="h-3 bg-white/5 rounded-lg animate-pulse w-2/3" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : taxonomyTree ? (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {renderTaxonomyLevel(taxonomyTree)}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl" />
                          </div>
                          <div className="relative z-10">
                            <TreePine className="w-20 h-20 text-slate-400 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-white mb-3">No Data Available</h3>
                            <p className="text-slate-400 max-w-md mx-auto">
                              Taxonomy data is currently being loaded or unavailable
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ultra-Modern Species Profile */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900/80 to-teal-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl">
                          <Fish className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white">Species Profile</h2>
                          <p className="text-slate-300">Detailed biological information</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    {filteredSpecies ? (
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4 bg-white/10 border-white/20 mb-8">
                          <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="habitat" className="text-slate-300 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">
                            <Globe className="w-4 h-4 mr-2" />
                            Habitat
                          </TabsTrigger>
                          <TabsTrigger value="features" className="text-slate-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300">
                            <Eye className="w-4 h-4 mr-2" />
                            Features
                          </TabsTrigger>
                          <TabsTrigger value="data" className="text-slate-300 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-300">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Data
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-6">
                          {/* Species Header */}
                          <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-2xl p-6 border border-white/10">
                            <h3 className="text-4xl font-bold italic text-white mb-2" data-testid="species-scientific-name">
                              {filteredSpecies.scientificName}
                            </h3>
                            <p className="text-2xl text-slate-300 mb-4" data-testid="species-common-name">
                              {filteredSpecies.commonName}
                            </p>
                            
                            {/* Conservation Status with Icon */}
                            <div className="flex items-center gap-3">
                              {filteredSpecies.conservation === 'Endangered' && <AlertTriangle className="w-6 h-6 text-red-400" />}
                              {filteredSpecies.conservation === 'Near Threatened' && <Shield className="w-6 h-6 text-yellow-400" />}
                              {filteredSpecies.conservation === 'Least Concern' && <Heart className="w-6 h-6 text-green-400" />}
                              <Badge 
                                className={cn(
                                  "px-4 py-2 text-base font-semibold border-0 rounded-xl",
                                  filteredSpecies.conservation === 'Endangered' ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-300' :
                                  filteredSpecies.conservation === 'Near Threatened' ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300' :
                                  filteredSpecies.conservation === 'Least Concern' ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-300' :
                                  'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300'
                                )}
                                data-testid="species-conservation-status"
                              >
                                {filteredSpecies.conservation}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Description */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                              <Info className="w-6 h-6 text-blue-400" />
                              Species Description
                            </h4>
                            <p className="text-slate-300 leading-relaxed text-lg" data-testid="species-description">
                              {filteredSpecies.description}
                            </p>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="habitat" className="space-y-6">
                          {/* Habitat Information */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                              <Waves className="w-6 h-6 text-teal-400" />
                              Habitat & Distribution
                            </h4>
                            <div className="grid grid-cols-1 gap-6">
                              <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-xl p-4 border border-teal-500/20">
                                <p className="text-sm font-semibold text-teal-300 mb-2">Primary Habitat</p>
                                <p className="text-white text-lg">{filteredSpecies.habitat}</p>
                              </div>
                              <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl p-4 border border-blue-500/20">
                                <p className="text-sm font-semibold text-blue-300 mb-2">Geographic Distribution</p>
                                <p className="text-white text-lg">{filteredSpecies.distribution}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Interactive Distribution Map */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                              <MapPin className="w-6 h-6 text-emerald-400" />
                              Distribution Map
                            </h4>
                            <div className="relative h-80 bg-gradient-to-br from-blue-900/50 to-teal-900/50 rounded-xl overflow-hidden border border-white/10">
                              {/* Animated Ocean Background */}
                              <div className="absolute inset-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-teal-500/20 to-emerald-500/20" />
                                <div className="absolute top-6 left-6 w-20 h-20 bg-blue-400/30 rounded-full blur-xl floating-animation" />
                                <div className="absolute bottom-10 right-10 w-16 h-16 bg-teal-400/30 rounded-full blur-lg floating-animation" style={{animationDelay: '2s'}} />
                                <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl floating-animation" style={{animationDelay: '4s'}} />
                              </div>
                              <div className="relative z-10 flex items-center justify-center h-full">
                                <div className="text-center">
                                  <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                  <p className="text-white text-xl font-semibold">Interactive Distribution Map</p>
                                  <p className="text-slate-300 text-base mt-2">Showing species range and habitat zones</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="features" className="space-y-6">
                          {/* Key Characteristics */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                              <Target className="w-6 h-6 text-purple-400" />
                              Key Characteristics
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                              {filteredSpecies.characteristics.map((char, index) => (
                                <div 
                                  key={index}
                                  className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-200"
                                  data-testid={`characteristic-${index}`}
                                >
                                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl mt-1">
                                    <div className="w-3 h-3 bg-purple-400 rounded-full" />
                                  </div>
                                  <span className="text-white text-lg leading-relaxed">{char}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="data" className="space-y-6">
                          {/* Population Trends */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                              <TrendingUp className="w-6 h-6 text-orange-400" />
                              Population Trends
                            </h4>
                            <div className="space-y-6">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-white text-lg">Population Stability</span>
                                  <span className="text-orange-300 font-bold text-xl">78%</span>
                                </div>
                                <Progress value={78} className="h-3 bg-white/10" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-white text-lg">Habitat Quality</span>
                                  <span className="text-emerald-300 font-bold text-xl">85%</span>
                                </div>
                                <Progress value={85} className="h-3 bg-white/10" />
                              </div>
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-white text-lg">Research Coverage</span>
                                  <span className="text-blue-300 font-bold text-xl">62%</span>
                                </div>
                                <Progress value={62} className="h-3 bg-white/10" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Research Data */}
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                              <Microscope className="w-6 h-6 text-teal-400" />
                              Research Data
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-yellow-500/20">
                                <div className="flex items-center justify-center mb-4">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-6 h-6 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />
                                  ))}
                                </div>
                                <p className="text-white text-lg font-semibold">Research Quality</p>
                              </div>
                              <div className="text-center p-6 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-xl border border-blue-500/20">
                                <p className="text-4xl font-black text-white mb-2">127</p>
                                <p className="text-white text-lg font-semibold">Published Studies</p>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="text-center py-20">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl" />
                          </div>
                          <div className="relative z-10">
                            <Fish className="w-24 h-24 text-slate-400 mx-auto mb-8" />
                            <h3 className="text-3xl font-bold text-white mb-4">Select a Species</h3>
                            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                              Choose a species from the taxonomic tree to explore detailed information, habitat data, and research insights
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
