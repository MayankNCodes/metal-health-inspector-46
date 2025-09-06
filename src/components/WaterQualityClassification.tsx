import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ClassificationProps {
  hmpiValue: number;
  hpiValue: number;
  heiValue: number;
  pliValue: number;
}

interface QualityLevel {
  level: string;
  color: string;
  icon: React.ReactNode;
  description: string;
}

export const WaterQualityClassification: React.FC<ClassificationProps> = ({
  hmpiValue,
  hpiValue,
  heiValue,
  pliValue
}) => {
  const getQualityLevel = (value: number, index: string): QualityLevel => {
    let thresholds: { [key: string]: number[] } = {
      HMPI: [25, 50, 100], // Good < 25, Acceptable 25-50, Poor 50-100, Critical > 100
      HPI: [25, 50, 100],
      HEI: [10, 20, 40],
      PLI: [1, 2, 5]
    };

    const limits = thresholds[index] || [25, 50, 100];
    
    if (value < limits[0]) {
      return {
        level: 'Good',
        color: 'success',
        icon: <CheckCircle className="h-4 w-4" />,
        description: 'Water quality is excellent for consumption'
      };
    } else if (value < limits[1]) {
      return {
        level: 'Acceptable',
        color: 'warning',
        icon: <AlertCircle className="h-4 w-4" />,
        description: 'Water quality is acceptable with minor concerns'
      };
    } else if (value < limits[2]) {
      return {
        level: 'Poor',
        color: 'destructive',
        icon: <AlertTriangle className="h-4 w-4" />,
        description: 'Water quality is poor and requires treatment'
      };
    } else {
      return {
        level: 'Critical',
        color: 'destructive',
        icon: <XCircle className="h-4 w-4" />,
        description: 'Water quality is critical and unsafe for consumption'
      };
    }
  };

  const indices = [
    { name: 'HMPI', value: hmpiValue, label: 'Heavy Metal Pollution Index' },
    { name: 'HPI', value: hpiValue, label: 'Heavy Metal Pollution Index' },
    { name: 'HEI', value: heiValue, label: 'Heavy Metal Evaluation Index' },
    { name: 'PLI', value: pliValue, label: 'Pollution Load Index' }
  ];

  // Overall classification based on worst index
  const overallClassification = indices.reduce((worst, current) => {
    const currentLevel = getQualityLevel(current.value, current.name);
    const worstLevel = getQualityLevel(worst.value, worst.name);
    
    const levelRanking = { Good: 0, Acceptable: 1, Poor: 2, Critical: 3 };
    
    return levelRanking[currentLevel.level as keyof typeof levelRanking] > 
           levelRanking[worstLevel.level as keyof typeof levelRanking] ? current : worst;
  });

  const overallQuality = getQualityLevel(overallClassification.value, overallClassification.name);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {overallQuality.icon}
              Water Quality Classification
            </CardTitle>
            <CardDescription>{overallQuality.description}</CardDescription>
          </div>
          <Badge variant={overallQuality.color as any} className="text-lg px-3 py-1">
            {overallQuality.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {indices.map((index) => {
          const quality = getQualityLevel(index.value, index.name);
          const maxValue = index.name === 'PLI' ? 10 : 150;
          const percentage = Math.min((index.value / maxValue) * 100, 100);
          
          return (
            <div key={index.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{index.name}</span>
                  <span className="text-sm text-muted-foreground">{index.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{index.value.toFixed(2)}</span>
                  <Badge variant={quality.color as any}>
                    {quality.level}
                  </Badge>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}
        
        <div className="mt-6 p-4 rounded-lg bg-muted/50">
          <h4 className="font-medium mb-2">Quality Assessment Guidelines</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>Good: Safe for consumption</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-yellow-600" />
              <span>Acceptable: Monitor regularly</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 text-orange-600" />
              <span>Poor: Treatment required</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-3 w-3 text-red-600" />
              <span>Critical: Immediate action needed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};