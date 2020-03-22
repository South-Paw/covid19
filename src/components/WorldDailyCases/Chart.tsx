import Chartjs from 'chart.js';
import { rgba } from 'polished';
import * as React from 'react';
import { DailyCase } from '../../api';

export interface DailyCasesChartProps {
  data: DailyCase[];
}

export const DailyCasesChart: React.FC<DailyCasesChartProps> = ({ data }) => {
  const chartCanvas = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    if (!chartCanvas?.current) {
      return;
    }

    const labels: string[] = [];

    const confirmedDataset: Chartjs.ChartDataSets = {
      label: 'Confirmed',
      data: [],
      backgroundColor: rgba('#1E1C1D', 0.2),
      borderColor: '#1E1C1D',
    };

    const activeDataset: Chartjs.ChartDataSets = {
      label: 'Active',
      data: [],
      backgroundColor: rgba('#F4B81F', 0.2),
      borderColor: '#F4B81F',
    };

    const recoveredDataset: Chartjs.ChartDataSets = {
      label: 'Recovered',
      data: [],
      backgroundColor: rgba('#0F9D58', 0.2),
      borderColor: '#0F9D58',
    };

    data.forEach(({ reportDate, confirmed, active, recovered }) => {
      labels.push(reportDate);
      confirmedDataset.data!.push(confirmed);
      activeDataset.data!.push(active);
      recoveredDataset.data!.push(recovered);
    });

    // eslint-disable-next-line no-new
    new Chartjs(chartCanvas.current, {
      type: 'line',
      data: { labels, datasets: [confirmedDataset, activeDataset, recoveredDataset] },
      options: {
        legend: { position: 'bottom' },
        scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
        tooltips: { mode: 'index' },
      },
    });
  }, [data]);

  return <canvas ref={chartCanvas} />;
};
