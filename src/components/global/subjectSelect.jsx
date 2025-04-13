import useStore from "../../stores/store"; // your Zustand store
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function SubjectSelect() {
  const { subjects } = useStore();
  const [selectedSubject, setSelectedSubject] = useState("");
  const navigate = useNavigate();

  const handleSearchSelectedSubject = () => {
    // Handle search logic here
    selectedSubject
      ? navigate(`/subject/${selectedSubject}`)
      : toast.error("Please select a subject", { action: { label: "OK" } });
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-4 md:flex-row flex-col w-full">
      <div className="w-full">
        <Select onValueChange={(value) => setSelectedSubject(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="w-full md:w-auto"
        onClick={handleSearchSelectedSubject}
      >
        <SearchIcon size={20} />
        Search
      </Button>
    </div>
  );
}
