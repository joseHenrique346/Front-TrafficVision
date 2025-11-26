import Card from './Card';
import ChooseModuleCard from './ChooseModuleCard';
import VehicleMonitorCard from './VehicleMonitorCard';
import ReportGeneratorCard from './ReportGeneratorCard';

export default function SearchCard({ type, styles, onSelectMode, onBack }){
  const variant = type === 'choose' ? 'choose' : (type === 'veiculos' ? 'veiculo' : 'registro');
  return (
    <Card variant={variant}>
      {type === 'choose' ? (
        <ChooseModuleCard 
          onSelectRegistros={() => onSelectMode('registros')} 
          onSelectVeiculos={() => onSelectMode('veiculos')} 
        />
      ) : type === 'veiculos' ? (
        <VehicleMonitorCard styles={styles} onBack={onBack} />
      ) : (
        <ReportGeneratorCard styles={styles} onBack={onBack} />
      )}
    </Card>
  );
}

