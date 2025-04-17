import React, { useEffect, useState } from "react";
import useStore from "../../stores/store";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export default function CriticalSubjects() {
  const {
    recentCriticalSubjects,
    selectedDays,
    setSelectedDays,
    loading,
    error,
  } = useStore();

  const navigate = useNavigate();

  return (
    <Card className="max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="tracking-tight mb-2 font-mono font-semibold">
          Recent Critical Subjects
        </CardTitle>
        <div className="w-48 mt-2">
          <Select
            value={selectedDays}
            onValueChange={(value) => setSelectedDays(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder="Select range"
                defaultValue={selectedDays}
              >
                {selectedDays ? `Last ${selectedDays} Days` : "Select range"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="15">Last 15 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="max-h-60 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : recentCriticalSubjects.length === 0 ? (
          <p className="text-gray-500">No critical subjects found.</p>
        ) : (
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead className="min-w-30 text-xs font-bold uppercase text-primary">
                  Assessment ID
                </TableHead>
                <TableHead className="min-w-30 text-xs font-bold uppercase text-primary">
                  Subject ID
                </TableHead>
                <TableHead className="min-w-30 text-xs font-bold uppercase text-primary">
                  Assessment Date
                </TableHead>
                <TableHead className="min-w-30 text-xs font-bold uppercase text-primary">
                  Adherence Score
                </TableHead>
                <TableHead className="min-w-30 text-xs font-bold uppercase text-primary">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCriticalSubjects.map((subj, index) => (
                <TableRow key={index}>
                  <TableCell>{subj.assessment_id}</TableCell>
                  <TableCell>{subj.subject_id}</TableCell>
                  <TableCell>{subj.assessment_date}</TableCell>
                  <TableCell>{subj.adherence_score}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/subject/${subj.subject_id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
