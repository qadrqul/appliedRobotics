import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Vehicle, Status } from "@/types/api";

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  currentVehicle: Vehicle | null;
}

export function VehicleDialog({ open, onOpenChange, onSubmit, currentVehicle }: VehicleDialogProps) {
  const [vehicleForm, setVehicleForm] = useState<Partial<Vehicle>>({
    plateNumber: currentVehicle?.plateNumber || "",
    owner: currentVehicle?.owner || "",
    status: currentVehicle?.status || "active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(vehicleForm);
    setVehicleForm({ plateNumber: "", owner: "", status: "active" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentVehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Plate Number</label>
            <Input
              value={vehicleForm.plateNumber}
              onChange={(e) => setVehicleForm({ ...vehicleForm, plateNumber: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Owner</label>
            <Input
              value={vehicleForm.owner}
              onChange={(e) => setVehicleForm({ ...vehicleForm, owner: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={vehicleForm.status}
              onValueChange={(value: Status) => setVehicleForm({ ...vehicleForm, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            {currentVehicle ? "Update" : "Add"} Vehicle
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}