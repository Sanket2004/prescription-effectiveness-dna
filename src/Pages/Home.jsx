"use client";

import { useEffect } from "react";
import useStore from "../stores/store";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  InfoIcon,
  LinkIcon,
  Users,
  TrendingDown,
  Activity,
} from "lucide-react";
import { Link } from "react-router-dom";
import SubjectSelect from "../components/global/subjectSelect";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function HomePage() {
  const {
    subjects,
    belowThresholdSubjects,
    loading,
    error,
    fetchSubjects,
    fetchSubjectsBelowThreshold,
    fetchLowAdherenceSummary,
    lowAdherenceSummary,
  } = useStore();

  useEffect(() => {
    fetchSubjects();
    fetchSubjectsBelowThreshold();
    fetchLowAdherenceSummary();
  }, [fetchSubjects, fetchSubjectsBelowThreshold, fetchLowAdherenceSummary]);

  if (loading) {
    return (
      <div className="container p-6 space-y-6 mx-auto">
        <div className="px-4 py-8">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
          <Skeleton className="h-6 w-2/3 mx-auto mb-8" />
          <Skeleton className="h-10 w-64 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full rounded-md" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
        <div className="text-destructive text-xl mb-4">Error loading data</div>
        <div className="bg-destructive/10 p-4 rounded-lg max-w-md">
          <p className="text-destructive-foreground">{error}</p>
        </div>
      </div>
    );

  const totalSubjects = subjects.length;
  const belowThresholdCount = belowThresholdSubjects.length;
  const aboveThresholdCount = totalSubjects - belowThresholdCount;
  const adherenceRate =
    totalSubjects > 0
      ? Math.round((aboveThresholdCount / totalSubjects) * 100)
      : 0;

  // Data for Pie Chart
  const pieData = [
    { name: "Above Threshold", value: aboveThresholdCount },
    { name: "Below Threshold", value: belowThresholdCount },
  ];

  // Filtered Data for Line Chart (only below threshold subjects)
  // Limit to top 10 records
  const lineData = belowThresholdSubjects.slice(0, 10).map((subject) => ({
    name: subject.subject_id,
    adherenceScore: subject.avg_score || 0,
  }));

  // Colors for Pie Chart
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  // Data for team members
  const teamMembers = [
    { name: "Abhishek Mukherjee", role: "Project Manager" },
    {
      name: "Soumili Dey",
      role: "Team Member",
      link: import.meta.env.VITE_SOUMILI_GITHUB_LINK,
    },
    {
      name: "Sanket Banerjee",
      role: "Team Member",
      link: import.meta.env.VITE_SANKET_GITHUB_LINK,
    },
    {
      name: "Santanu Pal",
      role: "Team Member",
      link: import.meta.env.VITE_SANTANU_GITHUB_LINK,
    },
  ];

  // Data for Bar Chart of Age Group
  const groupedData = [];

  lowAdherenceSummary.forEach(({ age_group, gender, count }) => {
    let entry = groupedData.find((item) => item.age_group === age_group);
    if (!entry) {
      entry = { age_group };
      groupedData.push(entry);
    }
    entry[gender] = count;
  });

  return (
    <section className="container p-6 space-y-10 mx-auto">
      {/* Header Section */}
      <div className="px-4 py-8 bg-gradient-to-b from-background to-muted/30 rounded-2xl shadow-sm">
        <h1 className="text-4xl font-black tracking-tight mb-6 text-center max-w-screen-lg mx-auto font-mono">
          Prescription Effectiveness Dashboard
        </h1>

        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <p className="text-lg text-muted-foreground  text-center leading-relaxed">
              Analyze prescription effectiveness and regional trend data to gain
              insights into medication impact on patient outcomes.
            </p>
          </div>

          <Separator />

          <div className="pb-2">
            <h3 className="text-center text-sm font-medium text-muted-foreground mb-3">
              Research Team
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {teamMembers.map((member, index) => (
                <Link
                  key={index}
                  to={member.link || "#"}
                  className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-all"
                  target="_blank"
                >
                  <LinkIcon size={14} className="mr-1.5" />
                  <span className="font-medium text-sm font-mono tracking-tight">{member.name}</span>
                  <span className="ml-1.5 text-xs text-primary font-mono font-black tracking-tight">
                    {member.role === "Project Manager" ? "PM" : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          <div className="pb-2">
            <h3 className="text-center font-bold text-primary mb-3 font-mono tracking-tight">
              Select a subject for detailed insights
            </h3>
            <SubjectSelect />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-primary-foreground shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-primary ">
              <Users className="mr-2 h-5 w-5" />
              Total Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {totalSubjects.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground  mt-1">
              Enrolled in the study
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-primary-foreground  shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-primary ">
              <TrendingDown className="mr-2 h-5 w-5" />
              Below Threshold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {belowThresholdCount.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground  mt-1">
              Subjects with adherence score &lt; 7
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-primary-foreground   shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-primary ">
              <Activity className="mr-2 h-5 w-5" />
              Adherence Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {adherenceRate}%
            </div>
            <p className="text-sm text-muted-foreground  mt-1">
              Subjects meeting adherence threshold
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Section */}
      <div>
        <h2 className="mb-8 text-center text-2xl font-black text-primary font-mono tracking-tight ">
          Detailed Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {/* Pie Chart Card */}
          <Card className="shadow-md overflow-hidden">
            <CardHeader className="bg-primary-foreground  border-b border-primary/20">
              <CardTitle className="font-mono font-black tracking-tight text-lg">Adherence Distribution</CardTitle>
              <CardDescription>
                Subjects above vs. below threshold
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    stroke="#fff"
                    strokeWidth={2}
                    label={({ percent }) => ` ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(percent) =>
                      ` ${((percent / subjects.length) * 100).toFixed(0)}%`
                    }
                  />
                  <Legend />
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    fill={"#000"}
                    fontSize="1.5rem"
                    fontWeight="bold"
                  >
                    {totalSubjects}
                  </text>
                  <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    fill={"#64748b"}
                    fontSize="0.8rem"
                  >
                    Total
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="bg-primary-foreground  border-t border-primary/20 px-4 py-3">
              <div className="flex items-center text-xs text-muted-foreground  w-full">
                <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Threshold is defined as an adherence score of 7 or higher
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Age Group Bar Chart */}
          <Card className="shadow-md overflow-hidden border-primary/20 ">
            <CardHeader className="bg-primary-foreground  border-b border-primary/20 ">
              <CardTitle className="font-mono font-black tracking-tight text-lg">
                Age & Gender Distribution
              </CardTitle>
              <CardDescription>
                Subjects with low adherence by demographics
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={groupedData}
                  margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    label={{
                      value: "Age Group",
                      position: "insideBottom",
                    }}
                    dataKey="age_group"
                    tick={{
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                      style: {
                        fill: "#64748b",
                      },
                    }}
                    tick={{
                      fill: "#64748b",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value}`}
                    labelFormatter={(value) => `Age Group: ${value}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: `1px solid ${"#e2e8f0"}`,
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="F"
                    fill="hsl(var(--chart-1))"
                    name="Female"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="M"
                    fill="hsl(var(--chart-2))"
                    name="Male"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="bg-primary-foreground  border-t border-primary/20  px-4 py-3">
              <div className="flex items-center text-xs text-muted-foreground  w-full">
                <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Only includes subjects with adherence scores below 7
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Line Chart for Adherence Scores */}
          <Card className="shadow-md overflow-hidden border-primary/20 ">
            <CardHeader className="bg-primary-foreground  border-b border-primary/20 ">
              <CardTitle className="font-mono font-black tracking-tight text-lg">Low Adherence Subjects</CardTitle>
              <CardDescription>
                Individual adherence scores of lowest 10 subjects
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={lineData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    tick={{
                      fontSize: 13,
                      fill: "#64748b",
                    }}
                  />
                  <YAxis
                    domain={[0, 7]}
                    ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                    label={{
                      value: "Adherence Score",
                      angle: -90,
                      position: "center",
                      style: {
                        fill: "#64748b",
                      },
                    }}
                    tick={{
                      fill: "#64748b",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)}`}
                    labelFormatter={(subject) => `Subject ID: ${subject}`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: `1px solid ${"#e2e8f0"}`,
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="adherenceScore"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "#fff", r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(var(--chart-1))" }}
                  />
                  {/* Threshold line */}
                  <Line
                    type="monotone"
                    dataKey={() => 7}
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Threshold"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
            <CardFooter className="bg-primary-foreground  border-t border-primary/20  px-4 py-3">
              <div className="flex items-center text-xs text-muted-foreground  w-full">
                <InfoIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  Red dashed line indicates the adherence threshold (7.0)
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
