"use client";

import { useEffect, useState } from "react";
import useStore from "../stores/store";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  HeartPulse,
  InfoIcon,
  LinkIcon,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function InsightsPage() {
  const { fetchSubjectData, subjectData, loading } = useStore();
  const { subject_id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectData(subject_id);
  }, [subject_id, fetchSubjectData]);

  useEffect(() => {
    document.title = `${subject_id} - Subject Prescription Effectiveness`;
  }, [subject_id]);

  useEffect(() => {
    if (subjectData?.previous_bps?.length && !selectedDate) {
      setSelectedDate(subjectData.previous_bps[0].assessment_date);
    }
  }, [subjectData, selectedDate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button size="sm" variant="ghost" className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <Skeleton className="h-4 w-16" />
          </Button>
        </div>

        <div className="max-w-xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-6">
          <Skeleton className="h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] col-span-2 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!subjectData || !subjectData.summary) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-xl font-medium text-primary mb-4">
          No data available
        </div>
        <p className="text-muted-foreground mb-6">
          Unable to load data for subject {subject_id}
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </div>
    );
  }

  // Calculate BP changes
  const avgAdherenceScore = Number.parseFloat(
    subjectData.summary[0]?.avg_adherence_score || "0"
  ).toFixed(2);
  const avgDiastolicChange = Number.parseFloat(
    subjectData.summary[0]?.avg_diastolic_change || "0"
  ).toFixed(2);
  const avgSystolicChange = Number.parseFloat(
    subjectData.summary[0]?.avg_systolic_change || "0"
  ).toFixed(2);

  // Determine if changes are positive or negative for styling
  const isDiastolicImproved = Number.parseFloat(avgDiastolicChange) < 0;
  const isSystolicImproved = Number.parseFloat(avgSystolicChange) < 0;
  const isAdherenceGood = Number.parseFloat(avgAdherenceScore) >= 7;

  // Format data for better display in charts
  const formattedTrendData = subjectData.previous_bps.map((assessment) => ({
    ...assessment,
    assessment_date: new Date(assessment.assessment_date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    ),
    // Ensure all values are numbers
    systolic_bp: Number(assessment.systolic_bp),
    diastolic_bp: Number(assessment.diastolic_bp),
    baseline_systolic: Number(assessment.baseline_systolic),
    baseline_diastolic: Number(assessment.baseline_diastolic),
    adherence_score: Number(assessment.adherence_score),
  }));

  return (
    <section className="container mx-auto p-6 space-y-8">
      {/* Header with navigation */}
      <div className="flex items-center mb-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-primary/20 hover:bg-primary/5"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 text-primary" />
          <span>Back to Dashboard</span>
        </Button>
      </div>

      {/* Title Section */}
      <div className="max-w-3xl mx-auto px-4 py-6 text-center border-b border-primary/10">
        <h1 className="text-3xl font-black tracking-tight mb-4 font-mono">
          Subject Prescription Effectiveness Analysis
        </h1>

        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-4">
          <LinkIcon size={16} className="text-primary" />
          <span className="font-medium text-primary font-mono">
            Subject ID: {subject_id}
          </span>
        </div>

        <p className="text-muted-foreground max-w-2xl mx-auto">
          Detailed analysis of blood pressure measurements and medication
          adherence over time
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 md:gap-x-6 ">
        {/* Summary Card */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader className="pb-2 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <span className="font-mono font-black tracking-tight">
                Health Summary
              </span>
            </CardTitle>
            <CardDescription>
              Aggregated data across all assessments
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Adherence Score</Label>
                  <Badge variant={isAdherenceGood ? "default" : "destructive"}>
                    {isAdherenceGood ? "Good" : "Poor"}
                  </Badge>
                </div>
                <div className="relative">
                  <Input
                    value={avgAdherenceScore}
                    readOnly
                    className={`text-center font-medium ${
                      isAdherenceGood
                        ? "text-primary border-primary/20"
                        : "text-destructive border-destructive/20"
                    }`}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-xs text-muted-foreground">/10</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAdherenceGood
                    ? "Good adherence to medication regimen"
                    : "Poor adherence to medication regimen"}
                </p>
              </div>

              <Separator className="my-2" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Systolic Change</Label>
                  <Badge variant={isSystolicImproved ? "default" : "outline"}>
                    {isSystolicImproved ? "Improved" : "No Change"}
                  </Badge>
                </div>
                <Input
                  value={`${avgSystolicChange} mmHg`}
                  readOnly
                  className={`text-center font-medium ${
                    isSystolicImproved
                      ? "text-primary border-primary/20"
                      : "border-muted-foreground/20"
                  }`}
                />
                <p className="text-xs text-muted-foreground">
                  {isSystolicImproved
                    ? "Reduction in systolic blood pressure"
                    : "No significant change in systolic blood pressure"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Diastolic Change
                  </Label>
                  <Badge variant={isDiastolicImproved ? "default" : "outline"}>
                    {isDiastolicImproved ? "Improved" : "No Change"}
                  </Badge>
                </div>
                <Input
                  value={`${avgDiastolicChange} mmHg`}
                  readOnly
                  className={`text-center font-medium ${
                    isDiastolicImproved
                      ? "text-primary border-primary/20"
                      : "border-muted-foreground/20"
                  }`}
                />
                <p className="text-xs text-muted-foreground">
                  {isDiastolicImproved
                    ? "Reduction in diastolic blood pressure"
                    : "No significant change in diastolic blood pressure"}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-stretch gap-4 border-t border-primary/10 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {subjectData.previous_bps.length} total assessments recorded
              </span>
            </div>

            <Button
              onClick={() => fetchSubjectData(subject_id)}
              className="w-full gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </CardFooter>
        </Card>

        {/* Trend Chart */}
        {subjectData.previous_bps?.length > 0 && (
          <Card className="col-span-2 border-primary/10 shadow-sm">
            <CardHeader className="pb-2 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-mono font-black tracking-tight">
                  Blood Pressure & Adherence Trends
                </span>
              </CardTitle>
              <CardDescription>
                Tracking changes in blood pressure and medication adherence over
                time
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="mb-4 px-2">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "hsl(var(--chart-1))" }}
                    ></div>
                    <span>Systolic BP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "hsl(var(--chart-2))" }}
                    ></div>
                    <span>Baseline Systolic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "hsl(var(--chart-3))" }}
                    ></div>
                    <span>Diastolic BP</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "hsl(var(--chart-4))" }}
                    ></div>
                    <span>Baseline Diastolic</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "hsl(var(--chart-5))" }}
                    ></div>
                    <span>Adherence Score</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={formattedTrendData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 25 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="assessment_date"
                    label={{
                      value: "Assessment Date",
                      position: "bottom",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    angle={-35}
                    textAnchor="end"
                    tick={{ fill: "hsl(var(--foreground))" }}
                    fontSize={12}
                    interval={0}
                    height={60}
                  />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Blood Pressure (mmHg)",
                      angle: -90,
                      position: "insideLeft",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    fontSize={12}
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 10]}
                    fontSize={12}
                    label={{
                      value: "Adherence Score",
                      angle: 90,
                      position: "insideRight",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    tick={{ fill: "hsl(var(--foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: "12px",
                    }}
                    formatter={(value, name) => {
                      if (name === "Adherence Score") {
                        return [`${value.toFixed(1)} / 10`, name];
                      }
                      return [`${value} mmHg`, name];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />

                  {/* Blood pressure lines (left axis) */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="systolic_bp"
                    name="Systolic BP"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="baseline_systolic"
                    name="Baseline Systolic"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="diastolic_bp"
                    name="Diastolic BP"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-3))" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="baseline_diastolic"
                    name="Baseline Diastolic"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: "hsl(var(--chart-4))" }}
                  />

                  {/* Adherence score line (right axis) */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="adherence_score"
                    name="Adherence Score"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-5))" }}
                    activeDot={{ r: 6 }}
                  />

                  {/* Adherence threshold reference line */}
                  <ReferenceLine
                    yAxisId="right"
                    y={7}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="3 3"
                    label={{
                      value: "Adherence Threshold",
                      position: "insideBottomRight",
                      fill: "hsl(var(--primary))",
                      fontSize: 10,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 px-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>
                      The chart shows blood pressure measurements compared to
                      baseline values and medication adherence over time.
                    </p>
                    <p className="mt-1">
                      An adherence score of 7 or higher (above the dashed line)
                      indicates good medication compliance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
