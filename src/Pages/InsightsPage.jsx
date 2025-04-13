import React, { useEffect, useState } from "react";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  ChevronLeft,
  ChevronLeftIcon,
  InfoIcon,
  LinkIcon,
  RefreshCcwDotIcon,
  RefreshCwIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";

export default function InsightsPage() {
  const { fetchSubjectData, subjectData } = useStore();
  const { subject_id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjectData(subject_id);
  }, [subject_id]);

  useEffect(() => {
    //change the site title with the subject id
    document.title = `${subject_id} - Subject Prescription Effectiveness`;
  }, [subject_id]);

  useEffect(() => {
    // Set the default selected date to the first available assessment
    if (subjectData?.previous_bps?.length && !selectedDate) {
      setSelectedDate(subjectData.previous_bps[0].assessment_date);
    }
  }, [subjectData]);

  if (!subjectData || !subjectData.summary)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <section className="p-6 container mx-auto space-y-6 relative">
      <Button
        size={"icon"}
        className="absolute top-4 left-4"
        onClick={() => navigate(-1)}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-black tracking-tight mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-gray-500 font-mono">
          Prescription Effectiveness and Reginal Trend Analysis
        </h2>
        <p className="relative text-lg font-bold font-mono text-primary flex items-center justify-center mx-auto group overflow-hidden w-max p-2">
          <span className="relative z-10 font-mono flex gap-2 items-center justify-center">
            <LinkIcon size={20} /> SUBJECT ID - {subject_id}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-muted-foreground/20 scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-300 z-0" />
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-3 md:gap-x-6 gap-y-6 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Summary of all assessments for this subject
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Average Adherence Score</Label>
              <Input
                value={parseFloat(
                  subjectData.summary[0]?.avg_adherence_score,
                  10
                ).toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <Label>Average Diastolic Change</Label>
              <Input
                value={parseFloat(
                  subjectData.summary[0]?.avg_diastolic_change,
                  10
                ).toFixed(2)}
                readOnly
              />
            </div>
            <div>
              <Label>Average Systolic Change</Label>
              <Input
                value={parseFloat(
                  subjectData.summary[0]?.avg_systolic_change,
                  10
                ).toFixed(2)}
                readOnly
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 flex-col items-start">
            <p className="text-sm text-muted-foreground inline-flex gap-1 items-center">
              <InfoIcon size={16} /> Total {subjectData.previous_bps.length}{" "}
              assessments
            </p>
            <Button
              size={"lg"}
              onClick={() => fetchSubjectData(subject_id)}
              className="w-full"
            >
              <RefreshCwIcon size={16} />
              Refresh Data
            </Button>
          </CardFooter>
        </Card>

        {/* Select assessment date */}
        {subjectData.previous_bps?.length > 0 && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Trend Over Time</CardTitle>
              <CardDescription>
                Systolic, Diastolic BP and Adherence Score across all
                assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={subjectData.previous_bps}
                  margin={{ top: 20, right: 10, left: 0, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="assessment_date"
                    label={{ value: "Assessment Date", position: "bottom" }}
                    angle={-35}
                    textAnchor="end"
                    fontSize={12}
                    interval={0}
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="systolic_bp"
                    name="Systolic BP"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline_systolic"
                    name="Baseline Systolic"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="diastolic_bp"
                    name="Diastolic BP"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline_diastolic"
                    name="Baseline Diastolic"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="adherence_score"
                    name="Adherence Score"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </section>
    </section>
  );
}
