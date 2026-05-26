import { BarChart3, Loader2 } from 'lucide-react';
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
import { Skeleton } from '@repo/ui/components/skeleton';
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
import { BAR_HEIGHTS_1, BAR_HEIGHTS_2, buildMetricCards } from '../data/online-metrics.data';
import { MetricCard } from './metric-card';

interface OnlineMetricsProps {
  onlineMetrics: OnlineMetricItem[];
  strategyDistribution: StrategyDistItem[];
  isLoading?: boolean;
}


/**
 * Component to render online recommendation performance charts and tables.
 * Shows skeleton placeholders while data is loading, with a spinner synced to the table card.
 * @param {OnlineMetricsProps} props - The component properties.
 */
export function OnlineMetrics({
  onlineMetrics = [],
  strategyDistribution = [],
  isLoading = false,
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
      {/* ── Summary metric cards ─────────────────────────────────────── */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className='border-border/60 overflow-hidden border shadow-sm'>
                <CardHeader className='pb-2'>
                  <Skeleton className='h-4 w-36' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-8 w-32' />
                  <Skeleton className='mt-2 h-3 w-40' />
                </CardContent>
              </Card>
            ))
          : buildMetricCards(summary).map((card) => (
              <MetricCard key={card.title} {...card} />
            ))}
      </div>

      {/* ── Charts grid ──────────────────────────────────────────────── */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Strategy Distribution Pie */}
        <Card className='border-border/60 border shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base'>Strategy Distribution</CardTitle>
            <CardDescription>Active request split percentage</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center justify-center pt-0'>
            {isLoading ? (
              <div className='flex w-full flex-col items-center justify-center gap-4 py-6'>
                <Skeleton className='h-[160px] w-[160px] rounded-full sm:h-[180px] sm:w-[180px]' />
                <div className='flex flex-wrap justify-center gap-2'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className='h-3.5 w-16' />
                  ))}
                </div>
              </div>
            ) : normalizedStrategyDistribution.length > 0 ? (
              <ChartContainer
                config={strategyChartConfig}
                className='mx-auto h-[220px] w-full max-w-[240px] sm:h-[260px] sm:max-w-[260px]'
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
                    className='flex-wrap justify-center gap-2 text-xs'
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className='text-muted-foreground py-10 text-sm'>
                No distribution data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impressions by Strategy Bar */}
        <Card className='border-border/60 border shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base'>Impressions by Strategy</CardTitle>
            <CardDescription>Total volume of served impressions</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            {isLoading ? (
              <div className='flex h-[220px] w-full items-end justify-between gap-2 px-2 sm:h-[250px]'>
                {BAR_HEIGHTS_1.map((pct, i) => (
                  <div key={i} className='flex flex-1 flex-col items-center gap-2'>
                    <Skeleton
                      className='w-full rounded-t-sm'
                      style={{ height: `${pct}%` }}
                    />
                    <Skeleton className='h-3 w-10' />
                  </div>
                ))}
              </div>
            ) : strategyAggregates.length > 0 ? (
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
              <div className='text-muted-foreground flex h-[220px] items-center justify-center text-sm sm:h-[250px]'>
                No performance data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Avg Latency by Strategy Bar */}
        <Card className='border-border/60 border shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base'>Average Latency (ms)</CardTitle>
            <CardDescription>Response speed of recommendation pipelines</CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            {isLoading ? (
              <div className='flex h-[220px] w-full items-end justify-between gap-2 px-2 sm:h-[250px]'>
                {BAR_HEIGHTS_2.map((pct, i) => (
                  <div key={i} className='flex flex-1 flex-col items-center gap-2'>
                    <Skeleton
                      className='w-full rounded-t-sm'
                      style={{ height: `${pct}%` }}
                    />
                    <Skeleton className='h-3 w-10' />
                  </div>
                ))}
              </div>
            ) : strategyAggregates.length > 0 ? (
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
              <div className='text-muted-foreground flex h-[220px] items-center justify-center text-sm sm:h-[250px]'>
                No latency data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Historical Daily Log table ────────────────────────────────── */}
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
                {isLoading ? (
                  // Single spinner row while fetching
                  <TableRow>
                    <TableCell colSpan={7} className='h-32 text-center'>
                      <Loader2 className='text-primary mx-auto h-5 w-5 animate-spin' />
                    </TableCell>
                  </TableRow>
                ) : normalizedOnlineMetrics.length > 0 ? (
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
                    <TableCell colSpan={7} className='py-12 text-center'>
                      <div className='flex flex-col items-center gap-3'>
                        <div className='bg-muted rounded-full p-4'>
                          <BarChart3 className='text-muted-foreground h-8 w-8' />
                        </div>
                        <div className='space-y-1'>
                          <p className='text-foreground font-medium'>No records found</p>
                          <p className='text-muted-foreground text-sm'>
                            There are currently no online recommendation metrics available.
                          </p>
                        </div>
                      </div>
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
