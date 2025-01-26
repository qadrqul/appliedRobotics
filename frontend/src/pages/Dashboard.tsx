import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { logsApi } from "@/lib/api";
import { Car, Users, Camera } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [cameraStatus, setCameraStatus] = useState<"online" | "offline">("online");

  // Fetch logs
  const { data: logs = [], isError } = useQuery({
    queryKey: ['logs'],
    queryFn: logsApi.getLogs,
  });

  useEffect(() => {
    if (isError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch logs. Please try again.",
      });
    }
  }, [isError, toast]);

  // Calculate stats
  const todayScans = logs.filter(log => {
    const logDate = new Date(log.createdAt).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;

  const totalVehicles = new Set(logs.map(log => log.plateNumber)).size;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Scans</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camera Status</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${cameraStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm font-medium capitalize">{cameraStatus}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Camera Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Live Camera Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src={`${import.meta.env.VITE_API_URL}api/camera/stream`}
              alt="Camera feed"
              className="w-full h-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plate Number</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.slice(0, 5).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.plateNumber}</TableCell>
                  <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "entered" ? "default" : "secondary"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
