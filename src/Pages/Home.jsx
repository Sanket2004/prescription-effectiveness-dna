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
import { InfoIcon, LinkIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SubjectSelect from "../components/global/subjectSelect";

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const totalSubjects = subjects.length;
  const belowThresholdCount = belowThresholdSubjects.length;
  const aboveThresholdCount = totalSubjects - belowThresholdCount;

  // Data for Pie Chart
  const pieData = [
    { name: "Above Threshold", value: aboveThresholdCount },
    { name: "Below Threshold", value: belowThresholdCount },
  ];

  // Filtered Data for Bar Chart (only below threshold subjects)
  // Limit to top 10 records
  const barData = belowThresholdSubjects
    .slice(0, 10) // Take only the first 10 entries
    .map((subject) => ({
      name: subject.subject_id,
      adherenceScore: subject.avg_score || 0,
    }));

  // Colors for Pie Chart
  const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))"];

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

  //// Data for Line Chart of Age Group
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
    <section className="container p-6 space-y-6 mx-auto">
      <div className="max-w-xl mx-auto px-4 py-8 min-h-[50vh]">
        <h2 className="text-4xl font-black tracking-tight mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-gray-500 font-mono">
          Prescription Effectiveness and Regional Trend Analysis
        </h2>
        <p className="text-lg text-muted-foreground text-center">
          Analyze prescription effectiveness and regional trend data to gain a
          deep understanding of the impact of medications on patients.
        </p>
        <p className="text-lg text-muted-foreground text-center mt-8 gap-2 flex items-center justify-center flex-wrap">
          created by{" "}
          {teamMembers.map(
            (member, index) =>
              member.role === "Team Member" && (
                <Link
                  key={index}
                  to={member.link && member.link}
                  className="inline-flex items-center justify-center gap-1 text-primary font-mono tracking-tight hover:font-semibold transition-all"
                  target="_blank"
                >
                  <LinkIcon size={15} />
                  {member.name}
                  {index < teamMembers.length - 1 && ", "}
                </Link>
              )
          )}
        </p>

        <SubjectSelect />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 md:gap-x-6 pb-12">
        {/* Existing Pie Chart Card */}
        <Card className="text-center col-span-1">
          <CardHeader>
            <CardTitle>Total Subjects</CardTitle>
            <CardDescription>Based on the latest data</CardDescription>
          </CardHeader>
          <CardContent>
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
                  strokeWidth={1}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
                <text
                  x="50%"
                  y="45%"
                  textAnchor="middle"
                  fill="black"
                  fontSize="2rem"
                  fontWeight="bold"
                >
                  {totalSubjects.toLocaleString()}
                </text>
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  fill="gray"
                  fontSize="0.9rem"
                >
                  Subjects
                </text>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-center flex items-center justify-center text-sm">
            Showing total subjects having poor adherence
          </CardFooter>
        </Card>

        {/* lowAdherenceSummary */}
        <Card className="text-center col-span-1">
          <CardHeader>
            <CardTitle>Total Subjects Grouped by Age Group</CardTitle>
            <CardDescription>Based on the latest data</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={groupedData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis
                  label={{ value: "Count", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="F" fill="hsl(var(--primary))" name="Female" />
                <Bar
                  dataKey="M"
                  fill="hsl(var(--muted-foreground))"
                  name="Male"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="text-center flex items-center justify-center text-sm">
            Showing total subjects having poor adherence
          </CardFooter>
        </Card>

        {/* New Bar Chart Card for Below Threshold Subjects */}
        <Card className="text-center col-span-1">
          <CardHeader>
            <CardTitle>Adherence Scores of Subjects Below Threshold</CardTitle>
            <CardDescription>
              Adherence scores for subjects below the threshold
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={barData}
                margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={60}
                  fontSize={13}
                />
                <YAxis
                  label={{
                    value: "Adherence Score",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Line
                  type={"linear"}
                  dataKey="adherenceScore"
                  stroke="hsl(var(--primary))"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardFooter className="inline-flex justify-center items-center gap-2 text-sm">
            <InfoIcon size={16} cla />
            Limit of 10 subjects having poor adherence
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}

export default HomePage;
