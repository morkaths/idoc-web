import { Eye, Clock, Activity, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@repo/ui/components/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import {
  useOnlineMetrics,
  type OnlineMetricItem,
  type StrategyDistItem,
} from '../data/use-online-metrics';
import { MetricCard } from './metric-card';

interface OnlineMetricsProps {
  onlineMetrics: OnlineMetricItem[];
  strategyDistribution: StrategyDistItem[];
}

/**
 * Component to render online recommendation performance charts and tables.
 * @param {OnlineMetricsProps} props - The component properties.
 */
export function OnlineMetrics({
  onlineMetrics = [],
  strategyDistribution = [],
}: OnlineMetricsProps) {
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
        <MetricCard
          title='Online Impressions'
          value={summary.totalImpressions.toLocaleString()}
          icon={Eye}
          description='Total served recommendations'
        />

        <MetricCard
          title='Average Latency'
          value={`${summary.avgLatencyMs.toFixed(1)} ms`}
          icon={Clock}
          description='Weighted response latency'
        />

        <MetricCard
          title='Overall CTR / CVR'
          value={`${summary.ctr.toFixed(2)}% / ${summary.cvr.toFixed(2)}%`}
          icon={Activity}
          description='Click & Borrow conversion rates'
        />

        <MetricCard
          title='Fallback Rate'
          value={`${summary.fallbackRate.toFixed(2)}%`}
          icon={AlertCircle}
          description='Percentage of fallback triggers'
        />
      </div>

      {/* Charts Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Traffic Distribution Pie */}
        <Card className='border-border/60 border shadow-sm lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Strategy Distribution</CardTitle>
            <CardDescription>Active request split percentage</CardDescription>
          </CardHeader>
          <CardContent className='flex h-[280px] flex-col items-center justify-center pt-0 sm:h-[300px]'>
            {normalizedStrategyDistribution.length > 0 ? (
              <ChartContainer
                config={strategyChartConfig}
                className='mx-auto h-[220px] w-full max-w-[220px] sm:h-[250px] sm:max-w-[250px]'
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value: unknown, name: unknown) => {
                          const strategyName = name !== undefined ? String(name) : 'unknown';
                          const item = normalizedStrategyDistribution.find(
                            (d: StrategyDistItem) => d.strategy === strategyName
                          );
                          const displayValue = typeof value === 'number' ? value : 0;
                          const percentage =
                            item?.percentage !== undefined ? item.percentage.toFixed(2) : '0.00';
                          return (
                            <div className='flex items-center gap-2'>
                              <div
                                className='h-2 w-2 rounded-full'
                                style={{
                                  backgroundColor: strategyChartConfig[strategyName]?.color,
                                }}
                              />
                              <span className='font-medium'>{strategyName}:</span>
                              <span>
                                {displayValue.toLocaleString()} calls ({percentage}%)
                              </span>
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
                      const strategyColor =
                        strategyChartConfig[entry.strategy]?.color || 'var(--primary)';
                      return <Cell key={`cell-${index}`} fill={strategyColor} />;
                    })}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey='strategy' />}
                    className='flex-wrap justify-center gap-2 text-xs sm:justify-start'
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className='text-muted-foreground text-sm'>No distribution data available</div>
            )}
          </CardContent>
        </Card>

        {/* Impressions by Strategy */}
        <Card className='border-border/60 border shadow-sm lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Impressions by Strategy</CardTitle>
            <CardDescription>Total volume of served impressions</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='h-[280px] w-full sm:h-[300px]'>
              {strategyAggregates.length > 0 ? (
                <ChartContainer
                  config={impressionsChartConfig}
                  className='h-[220px] w-full sm:h-[250px]'
                >
                  <BarChart data={strategyAggregates}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='strategy'
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar
                      dataKey='impressions'
                      fill='var(--color-impressions)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
                  No performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Avg Latency by Strategy */}
        <Card className='border-border/60 border shadow-sm lg:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>Average Latency (ms)</CardTitle>
            <CardDescription>Response speed of recommendation pipelines</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='h-[280px] w-full sm:h-[300px]'>
              {strategyAggregates.length > 0 ? (
                <ChartContainer
                  config={latencyChartConfig}
                  className='h-[220px] w-full sm:h-[250px]'
                >
                  <BarChart data={strategyAggregates}>
                    <CartesianGrid strokeDasharray='3 3' vertical={false} />
                    <XAxis
                      dataKey='strategy'
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `${v}ms`}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator='dashed' />}
                    />
                    <Bar
                      dataKey='avgLatencyMs'
                      fill='var(--color-avgLatencyMs)'
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className='text-muted-foreground flex h-full items-center justify-center text-sm'>
                  No latency data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Metrics Detailed Table */}
      <Card className='border-border/60 border shadow-sm'>
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
                  <TableHead className='pr-6 text-right'>CVR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {normalizedOnlineMetrics.length > 0 ? (
                  normalizedOnlineMetrics.map((row, idx) => (
                    <TableRow key={`${row.date}-${row.strategy}-${idx}`}>
                      <TableCell className='pl-6 font-medium'>{row.date}</TableCell>
                      <TableCell className='capitalize'>{row.strategy}</TableCell>
                      <TableCell className='text-right'>
                        {row.impressions.toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>{row.avgLatencyMs.toFixed(1)} ms</TableCell>
                      <TableCell className='text-right'>{row.fallbacks}</TableCell>
                      <TableCell className='text-right'>{(row.ctr * 100).toFixed(2)}%</TableCell>
                      <TableCell className='pr-6 text-right'>
                        {(row.cvr * 100).toFixed(2)}%
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className='text-muted-foreground h-24 text-center'>
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
