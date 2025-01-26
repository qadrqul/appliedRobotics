import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { adminApi } from "@/lib/api";
import type { User, Vehicle } from "@/types/api";
import { VehicleDialog } from "@/components/admin/VehicleDialog";
import { VehicleList } from "@/components/admin/VehicleList";
import { UserDialog } from "@/components/admin/UserDialog";
import { UserList } from "@/components/admin/UserList";

export default function Admin() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("vehicles");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedVehicles] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getVehicles()
        ]);
        setUsers(fetchedUsers);
        setVehicles(fetchedVehicles);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch data. Please try again.",
        });
      }
    };

    fetchData();
  }, [toast]);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVehicleSubmit = async (vehicleData: Partial<Vehicle>) => {
    try {
      if (currentVehicle) {
        await adminApi.updateVehicle(currentVehicle.id, vehicleData);
      } else {
        await adminApi.createVehicle(vehicleData as Vehicle);
      }
      const updatedVehicles = await adminApi.getVehicles();
      setVehicles(updatedVehicles);
      setShowVehicleDialog(false);
      setCurrentVehicle(null);
      toast({
        title: currentVehicle ? "Vehicle updated" : "Vehicle created",
        description: `Vehicle has been successfully ${currentVehicle ? "updated" : "created"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${currentVehicle ? "update" : "create"} vehicle. Please try again.`,
      });
    }
  };

  const handleUserSubmit = async (userData: any) => {
    try {
      if (currentUser) {
        const { password, ...updateData } = userData;
        await adminApi.updateUser(currentUser.id, updateData);
      } else {
        await adminApi.createUser(userData);
      }
      const updatedUsers = await adminApi.getUsers();
      setUsers(updatedUsers);
      setShowUserDialog(false);
      setCurrentUser(null);
      toast({
        title: currentUser ? "User updated" : "User created",
        description: `User has been successfully ${currentUser ? "updated" : "created"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${currentUser ? "update" : "create"} user. Please try again.`,
      });
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    try {
      await adminApi.deleteVehicle(id);
      setVehicles(vehicles.filter(v => v.id !== id));
      toast({
        title: "Vehicle deleted",
        description: "Vehicle has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Vehicle Management</h2>
            <Button
              onClick={() => {
                setCurrentVehicle(null);
                setShowVehicleDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Button>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Search plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <VehicleList
            vehicles={filteredVehicles}
            onEdit={(vehicle) => {
              setCurrentVehicle(vehicle);
              setShowVehicleDialog(true);
            }}
            onDelete={handleDeleteVehicle}
          />

          <VehicleDialog
            open={showVehicleDialog}
            onOpenChange={setShowVehicleDialog}
            onSubmit={handleVehicleSubmit}
            currentVehicle={currentVehicle}
          />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Button
              onClick={() => {
                setCurrentUser(null);
                setShowUserDialog(true);
              }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="flex gap-4">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <UserList
            users={filteredUsers}
            onEdit={(user) => {
              setCurrentUser(user);
              setShowUserDialog(true);
            }}
            onDelete={handleDeleteUser}
          />

          <UserDialog
            open={showUserDialog}
            onOpenChange={setShowUserDialog}
            onSubmit={handleUserSubmit}
            currentUser={currentUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
