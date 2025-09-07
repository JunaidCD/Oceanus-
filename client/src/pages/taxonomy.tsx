import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ChevronDown, Search, MapPin, Info, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

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

    return (
      <div>
        {entries.map((entry, index) => {
          if (!entry) return null;
          
          const nodePath = `${parentPath}/${entry.type}/${entry.value}`;
          const isExpanded = expandedNodes.has(nodePath);
          const hasChildren = node.children && node.children.length > 0;
          const hasSpecies = node.species && node.species.length > 0;

          return (
            <div key={nodePath} style={{ marginLeft: `${level * 20}px` }}>
              <div 
                className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                onClick={() => toggleNode(nodePath)}
                data-testid={`taxonomy-node-${entry.type}-${entry.value}`}
              >
                {(hasChildren || hasSpecies) && (
                  isExpanded ? 
                    <ChevronDown className="w-4 h-4" /> : 
                    <ChevronRight className="w-4 h-4" />
                )}
                <TreePine className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium capitalize">{entry.type}:</span>
                <span className="italic">{entry.value}</span>
              </div>

              {isExpanded && hasChildren && (
                <div>
                  {node.children?.map((child, childIndex) => (
                    <div key={childIndex}>
                      {renderTaxonomyLevel(child, level + 1, nodePath)}
                    </div>
                  ))}
                </div>
              )}

              {isExpanded && hasSpecies && (
                <div style={{ marginLeft: `${(level + 1) * 20}px` }}>
                  {node.species?.map((species, speciesIndex) => (
                    <div 
                      key={speciesIndex}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => setSelectedSpecies(species)}
                      data-testid={`species-${species.replace(' ', '-')}`}
                    >
                      <Info className="w-4 h-4 text-primary" />
                      <span className="italic text-primary hover:underline">{species}</span>
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
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Taxonomy Browser</h1>
            <p className="text-muted-foreground">
              Explore the hierarchical classification of marine species
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Taxonomy Tree */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="w-5 h-5" />
                Taxonomic Tree
              </CardTitle>
              <div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search species..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-taxonomy"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : taxonomyTree ? (
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {renderTaxonomyLevel(taxonomyTree)}
                </div>
              ) : (
                <p className="text-muted-foreground">No taxonomy data available</p>
              )}
            </CardContent>
          </Card>

          {/* Species Profile */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Species Profile</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSpecies ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-2xl font-bold italic" data-testid="species-scientific-name">
                      {filteredSpecies.scientificName}
                    </h3>
                    <p className="text-xl text-muted-foreground" data-testid="species-common-name">
                      {filteredSpecies.commonName}
                    </p>
                  </div>

                  {/* Conservation Status */}
                  <div>
                    <Badge 
                      className={cn(
                        filteredSpecies.conservation === 'Endangered' ? 'bg-red-500/20 text-red-400' :
                        filteredSpecies.conservation === 'Near Threatened' ? 'bg-yellow-500/20 text-yellow-400' :
                        filteredSpecies.conservation === 'Least Concern' ? 'bg-green-500/20 text-green-400' :
                        'bg-blue-500/20 text-blue-400'
                      )}
                      data-testid="species-conservation-status"
                    >
                      {filteredSpecies.conservation}
                    </Badge>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Habitat & Distribution
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Habitat:</strong> {filteredSpecies.habitat}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Distribution:</strong> {filteredSpecies.distribution}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground" data-testid="species-description">
                      {filteredSpecies.description}
                    </p>
                  </div>

                  {/* Characteristics */}
                  <div>
                    <h4 className="font-semibold mb-3">Key Characteristics</h4>
                    <div className="space-y-2">
                      {filteredSpecies.characteristics.map((char, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-2 text-sm"
                          data-testid={`characteristic-${index}`}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{char}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distribution Map Placeholder */}
                  <div>
                    <h4 className="font-semibold mb-3">Distribution Map</h4>
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Interactive distribution map
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TreePine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">Select a Species</p>
                  <p className="text-muted-foreground">
                    Choose a species from the taxonomy tree to view detailed information
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
