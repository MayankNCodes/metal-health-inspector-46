import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, ChevronDown, ChevronRight, FlaskConical, Calculator, FileSpreadsheet, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationService } from './LocationService';
import { WaterQualityClassification } from './WaterQualityClassification';
import { IndexChart } from './IndexChart';
import { UserRoleDisplay } from './UserRoleDisplay';

// Types for our data structures
interface SampleData {
  sampleId: string;
  latitude: number | '';
  longitude: number | '';
  wellDepth: number | '';
  samplingDate: string;
}

interface MetalConcentrations {
  [key: string]: number | '';
}

interface Standards {
  [key: string]: number;
}

interface HMPIResults {
  HPI: number;
  HEI: number;
  HMPI: number;
  HCI: number;
  Cd: number;
  PI: number;
  PLI: number;
  classification: string;
}

// WHO guidelines and metal data
const METALS = [
  { symbol: 'Pb', name: 'Lead', whoStandard: 0.01, idealValue: 0, category: 'toxic' },
  { symbol: 'Cd', name: 'Cadmium', whoStandard: 0.003, idealValue: 0, category: 'toxic' },
  { symbol: 'Cr', name: 'Chromium', whoStandard: 0.05, idealValue: 0, category: 'toxic' },
  { symbol: 'As', name: 'Arsenic', whoStandard: 0.01, idealValue: 0, category: 'toxic' },
  { symbol: 'Hg', name: 'Mercury', whoStandard: 0.001, idealValue: 0, category: 'toxic' },
  { symbol: 'Ni', name: 'Nickel', whoStandard: 0.07, idealValue: 0, category: 'toxic' },
  { symbol: 'Cu', name: 'Copper', whoStandard: 2.0, idealValue: 0, category: 'essential' },
  { symbol: 'Zn', name: 'Zinc', whoStandard: 3.0, idealValue: 0, category: 'essential' },
  { symbol: 'Fe', name: 'Iron', whoStandard: 0.3, idealValue: 0.3, category: 'essential' },
  { symbol: 'Mn', name: 'Manganese', whoStandard: 0.1, idealValue: 0.1, category: 'essential' },
  { symbol: 'Co', name: 'Cobalt', whoStandard: 0.05, idealValue: 0, category: 'trace' },
];

export const HMPICalculator: React.FC = () => {
  const { toast } = useToast();
  
  // Form state
  const [sampleData, setSampleData] = useState<SampleData>({
    sampleId: '',
    latitude: '',
    longitude: '',
    wellDepth: '',
    samplingDate: '',
  });

  // Initialize concentrations and standards
  const [concentrations, setConcentrations] = useState<MetalConcentrations>(
    METALS.reduce((acc, metal) => ({ ...acc, [metal.symbol]: '' }), {})
  );
  
  const [standards, setStandards] = useState<Standards>(
    METALS.reduce((acc, metal) => ({ ...acc, [metal.symbol]: metal.whoStandard }), {})
  );
  
  const [idealValues, setIdealValues] = useState<Standards>(
    METALS.reduce((acc, metal) => ({ ...acc, [metal.symbol]: metal.idealValue }), {})
  );

  const [results, setResults] = useState<HMPIResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // Section expansion states
  const [expandedSections, setExpandedSections] = useState({
    metadata: true,
    toxic: true,
    essential: true,
    trace: true,
    standards: false,
    results: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const validateInputs = (): boolean => {
    // Check required fields
    if (!sampleData.sampleId) {
      toast({ title: "Validation Error", description: "Sample ID is required", variant: "destructive" });
      return false;
    }
    
    // Check if at least one concentration is provided
    const hasConcentration = METALS.some(metal => concentrations[metal.symbol] !== '');
    if (!hasConcentration) {
      toast({ title: "Validation Error", description: "At least one metal concentration is required", variant: "destructive" });
      return false;
    }
    
    return true;
  };

  // Simulate HMPI calculations (replace with actual backend call)
  const calculateHMPI = async (): Promise<HMPIResults> => {
    // Placeholder calculation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    
    const mockResults: HMPIResults = {
      HPI: 75.5,
      HEI: 42.3,
      HMPI: 58.9,
      HCI: 1.24,
      Cd: 2.1,
      PI: 0.89,
      PLI: 1.45,
      classification: "Moderately Polluted"
    };
    
    return mockResults;
  };

  const handleCalculate = async () => {
    if (!validateInputs()) return;
    
    setIsCalculating(true);
    try {
      const calculatedResults = await calculateHMPI();
      setResults(calculatedResults);
      setExpandedSections(prev => ({ ...prev, results: true }));
      toast({ title: "Calculation Complete", description: "HMPI indices have been computed successfully" });
    } catch (error) {
      toast({ title: "Calculation Error", description: "Failed to compute HMPI indices", variant: "destructive" });
    } finally {
      setIsCalculating(false);
    }
  };

  const updateConcentration = (symbol: string, value: string) => {
    setConcentrations(prev => ({ ...prev, [symbol]: value === '' ? '' : Number(value) }));
  };

  const updateStandard = (symbol: string, value: string) => {
    setStandards(prev => ({ ...prev, [symbol]: Number(value) }));
  };

  const updateIdealValue = (symbol: string, value: string) => {
    setIdealValues(prev => ({ ...prev, [symbol]: Number(value) }));
  };

  const handleLocationUpdate = (latitude: number, longitude: number) => {
    setSampleData(prev => ({ ...prev, latitude, longitude }));
  };

  const getClassificationColor = (classification: string): string => {
    if (classification.toLowerCase().includes('low') || classification.toLowerCase().includes('clean')) return 'success';
    if (classification.toLowerCase().includes('moderate')) return 'warning';
    return 'destructive';
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gradient-card shadow-card border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <FlaskConical className="h-8 w-8 text-primary" />
              <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Heavy Metal Pollution Index Calculator
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Compute comprehensive water quality indices for environmental monitoring
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Role Display */}
        <UserRoleDisplay role="Researcher" username="Environmental Scientist" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Sample Metadata */}
            <Card className="shadow-card">
              <Collapsible open={expandedSections.metadata} onOpenChange={() => toggleSection('metadata')}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                        Sample Metadata
                      </CardTitle>
                      {expandedSections.metadata ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sampleId">Sample ID *</Label>
                      <Input
                        id="sampleId"
                        value={sampleData.sampleId}
                        onChange={(e) => setSampleData(prev => ({ ...prev, sampleId: e.target.value }))}
                        placeholder="e.g., WQ-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="samplingDate">Sampling Date</Label>
                      <Input
                        id="samplingDate"
                        type="date"
                        value={sampleData.samplingDate}
                        onChange={(e) => setSampleData(prev => ({ ...prev, samplingDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude (°)</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={sampleData.latitude}
                        onChange={(e) => setSampleData(prev => ({ ...prev, latitude: e.target.value === '' ? '' : Number(e.target.value) }))}
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude (°)</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={sampleData.longitude}
                        onChange={(e) => setSampleData(prev => ({ ...prev, longitude: e.target.value === '' ? '' : Number(e.target.value) }))}
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <LocationService 
                        onLocationUpdate={handleLocationUpdate}
                        isLoading={isLocationLoading}
                        setIsLoading={setIsLocationLoading}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="wellDepth">Well Depth (m)</Label>
                      <Input
                        id="wellDepth"
                        type="number"
                        step="any"
                        value={sampleData.wellDepth}
                        onChange={(e) => setSampleData(prev => ({ ...prev, wellDepth: e.target.value === '' ? '' : Number(e.target.value) }))}
                        placeholder="e.g., 25.5"
                      />
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Metal Concentrations - Grouped by category */}
            {[
              { key: 'toxic', title: 'Toxic Metals', category: 'toxic', color: 'destructive' },
              { key: 'essential', title: 'Essential Elements', category: 'essential', color: 'accent' },
              { key: 'trace', title: 'Trace Elements', category: 'trace', color: 'secondary' }
            ].map((group) => {
              const groupMetals = METALS.filter(metal => metal.category === group.category);
              return (
                <Card key={group.key} className="shadow-card">
                  <Collapsible open={expandedSections[group.key as keyof typeof expandedSections]} onOpenChange={() => toggleSection(group.key as keyof typeof expandedSections)}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="secondary" className={`bg-${group.color}/10 text-${group.color}`}>
                              {groupMetals.length}
                            </Badge>
                            {group.title}
                          </CardTitle>
                          {expandedSections[group.key as keyof typeof expandedSections] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupMetals.map((metal) => (
                            <div key={metal.symbol} className="space-y-2">
                              <Label htmlFor={`conc-${metal.symbol}`}>
                                {metal.name} ({metal.symbol})
                                <span className="text-sm text-muted-foreground ml-1">(mg/L)</span>
                              </Label>
                              <Input
                                id={`conc-${metal.symbol}`}
                                type="number"
                                step="any"
                                min="0"
                                value={concentrations[metal.symbol]}
                                onChange={(e) => updateConcentration(metal.symbol, e.target.value)}
                                placeholder={`WHO: ${metal.whoStandard}`}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}

          </div>

          {/* Right Column - Controls and Results */}
          <div className="space-y-6">
            
            {/* Calculate Button */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <Button 
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent mr-2" />
                      Computing...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-5 w-5 mr-2" />
                      Calculate HMPI
                    </>
                  )}
                </Button>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" disabled>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Upload CSV/Excel
                  </Button>
                  <Button variant="outline" className="w-full" disabled={!results}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <>
                <Card className="shadow-elevated">
                  <Collapsible open={expandedSections.results} onOpenChange={() => toggleSection('results')}>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-primary" />
                            HMPI Results
                          </CardTitle>
                          {expandedSections.results ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'HPI', value: results.HPI },
                            { label: 'HEI', value: results.HEI },
                            { label: 'HMPI', value: results.HMPI },
                            { label: 'HCI', value: results.HCI },
                            { label: 'Cd', value: results.Cd },
                            { label: 'PI', value: results.PI },
                            { label: 'PLI', value: results.PLI },
                          ].map((item) => (
                            <div key={item.label} className="p-3 rounded-lg bg-muted/50">
                              <div className="text-sm text-muted-foreground">{item.label}</div>
                              <div className="text-lg font-semibold">{item.value.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
                
                <WaterQualityClassification
                  hmpiValue={results.HMPI}
                  hpiValue={results.HPI}
                  heiValue={results.HEI}
                  pliValue={results.PLI}
                />
                
                <IndexChart results={results} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};