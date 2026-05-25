import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@repo/ui/components/chart';
import { Eye, Clock, Activity, AlertCircle } from 'lucide-react';
import {
  useOnlineMetrics,
  type OnlineMetricItem,
  type StrategyDistItem,
} from '../data/use-online-metrics';

interface OnlineMetricsProps {
  onlineMetrics: OnlineMetricItem[];
  strategyDistribution: StrategyDistItem[];
}

/**
 * Component to render online recommendation performance charts and tables.
 * @param {OnlineMetricsProps} props - The component properties.
 */
export function OnlineMetrics({ onlineMetrics = [], strategyDistribution = [] }: OnlineMetricsProps) {
  const {
    normalizedOnlineMetrics,
    normalizedStrategyDistribution,
    summary,
    strategyAggregates,
    strategyChartConfig,
    impressionsChartConfig,
    latencyChartConfig,
  } = useOnlineMetrics({ onlineMetrics, strategyDistribution });

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Online Impressions</CardTitle>
            <Eye className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.totalImpressions.toLocaleString()}</div>
            <p className='text-muted-foreground mt-1 text-xs'>Total served recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Average Latency</CardTitle>
            <Clock className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.avgLatencyMs.toFixed(1)} ms</div>
            <p className='text-muted-foreground mt-1 text-xs'>Weighted response latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Overall CTR / CVR</CardTitle>
            <Activity className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {summary.ctr.toFixed(2)}% / {summary.cvr.toFixed(2)}%
            </div>
            <p className='text-muted-foreground mt-1 text-xs'>Click & Borrow conversion rates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Fallback Rate</CardTitle>
            <AlertCircle className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summary.fallbackRate.toFixed(2)}%</div>
            <p className='text-muted-foreground mt-1 text-xs'>Percentage of fallback triggers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Traffic Distribution Pie */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Strategy Distribution</CardTitle>
            <CardDescription>Active request split percentage</CardDescription>
          </CardHeader>
          <CardContent className='flex h-[300px] flex-col items-center justify-center pt-0'>
            {normalizedStrategyDistribution.length > 0 ? (
              <ChartContainer config={strategyChartConfig} className='mx-auto h-[250px] w-full max-w-[250px]'>
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value: unknown, name: unknown) => {
                          const strategyName = name !== undefined ? String(name) : 'unknown';
                          const item = normalizedStrategyDistribution.find((d) => d.strategy === strategyName);
                          const displayValue = typeof value === 'number' ? value : 0;
                          const percentage = item?.percentage !== undefined ? item.percentage.toFixed(2) : '0.00';
                          return (
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-2 w-2 rounded-full'
                                style={{ backgroundColor: strategyChartConfig[strategyName]?.color }}
                              />
                              <span className='font-medium'>{strategyName}:</span>
                              <span>{displayValue.toLocaleString()} calls ({percentage}%)</span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Pie
                    data={normalizedStrategyDistribution}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey='count'
                    nameKey='strategy'
                  >
                    {normalizedStrategyDistribution.map((entry, index) => {
                      const strategyColor = strategyChartConfig[entry.strategy]?.color || 'var(--primary)';
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={strategyColor}
                        />
                      );
                    })}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey='strategy' />}
                    className='flex-wrap gap-2 text-xs'
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className='text-muted-foreground text-sm'>No distribution data available</div>
            )}
          </CardContent>
        </Card>

        {/* Impressions by Strategy */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Impressions by Strategy</CardTitle>
            <CardDescription>Total volume of served impressions</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='h-[300px] w-full'>
              {strategyAggregates.length > 0 ? (
                <ChartContainer config={impressionsChartConfig} className='h-[250px] w-full'>
                  <BarChart data={strategyAggregates}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='strategy' fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar dataKey='impressions' fill='var(--color-impressions)' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className='flex h-full items-center justify-center text-muted-foreground text-sm'>
                  No performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Avg Latency by Strategy */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Average Latency (ms)</CardTitle>
            <CardDescription>Response speed of recommendation pipelines</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='h-[300px] w-full'>
              {strategyAggregates.length > 0 ? (
                <ChartContainer config={latencyChartConfig} className='h-[250px] w-full'>
                  <BarChart data={strategyAggregates}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis dataKey='strategy' fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}ms`} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar dataKey='avgLatencyMs' fill='var(--color-avgLatencyMs)' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className='flex h-full items-center justify-center text-muted-foreground text-sm'>
                  No latency data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Metrics Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Historical Daily Log</CardTitle>
          <CardDescription>Detailed breakdown of daily recommendation performance</CardDescription>
        </CardHeader>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='pl-6'>Date</TableHead>
                  <TableHead>Strategy</TableHead>
                  <TableHead className='text-right'>Impressions</TableHead>
                  <TableHead className='text-right'>Avg Latency</TableHead>
                  <TableHead className='text-right'>Fallbacks</TableHead>
                  <TableHead className='text-right'>CTR</TableHead>
                  <TableHead className='text-right pr-6'>CVR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalizedOnlineMetrics.length > 0 ? (
                  normalizedOnlineMetrics.map((row, idx) => (
                    <TableRow key={`${row.date}-${row.strategy}-${idx}`}>
                      <TableCell className='font-medium pl-6'>{row.date}</TableCell>
                      <TableCell className='capitalize'>{row.strategy}</TableCell>
                      <TableCell className='text-right'>{row.impressions.toLocaleString()}</TableCell>
                      <TableCell className='text-right'>{row.avgLatencyMs.toFixed(1)} ms</TableCell>
                      <TableCell className='text-right'>{row.fallbacks}</TableCell>
                      <TableCell className='text-right'>{(row.ctr * 100).toFixed(2)}%</TableCell>
                      <TableCell className='text-right pr-6'>{(row.cvr * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className='h-24 text-center text-muted-foreground'>
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
