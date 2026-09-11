import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--border)",
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 12,
    color: "var(--foreground)",
  },
  cursor: { fill: "var(--muted)", opacity: 0.5 },
} as const;

export function ActivityChart({ data }: { data: { day: string; hours: number }[] }) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="day" {...axis} />
          <YAxis {...axis} width={40} />
          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}h`, "Studied"]} />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#activityFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductivityChart({
  data,
  highlight,
}: {
  data: { hour: string; focus: number }[];
  highlight: string[];
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="hour" {...axis} />
          <YAxis {...axis} width={40} />
          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}% focus`, "Focus"]} />
          <Bar dataKey="focus" radius={[6, 6, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.hour}
                fill={highlight.includes(d.hour) ? "var(--primary)" : "var(--primary-soft)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChart({
  data,
  xKey,
  yKey,
  suffix = "%",
}: {
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  suffix?: string;
}) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey={xKey} {...axis} />
          <YAxis {...axis} width={40} />
          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}${suffix}`, "Score"]} />
          <Line
            type="monotone"
            dataKey={yKey}
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectBarChart({ data }: { data: { subject: string; progress: number }[] }) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="subject" {...axis} />
          <YAxis {...axis} width={40} />
          <Tooltip {...tooltipStyle} formatter={(v) => [`${v}%`, "Progress"]} />
          <Bar dataKey="progress" radius={[6, 6, 0, 0]} fill="var(--primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
