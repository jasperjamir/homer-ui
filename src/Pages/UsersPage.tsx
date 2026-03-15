import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Pencil, Plus, School, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { UserDialog } from "@/Features/Users/components/UserDialog";
import type { User } from "@/Features/Users/models";
import { getUsersQueryOptions, useDeleteUserMutation } from "@/Features/Users/query-options";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Shared/components/ui/alert-dialog";
import { Button } from "@/Shared/components/ui/button";
import { Input } from "@/Shared/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Shared/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
import { AppUserRole } from "@/Shared/models";

type TabValue = "educators" | "students";

function UsersTable({
  users,
  search,
  onSearchChange,
  onCreateUser,
  onEditUser,
  onDeleteUser,
  defaultRole,
  isLoading,
}: {
  users: User[];
  search: string;
  onSearchChange: (value: string) => void;
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  defaultRole: AppUserRole;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name, email, mobile..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={onCreateUser}>
          <Plus className="mr-2 h-4 w-4" />
          New {defaultRole === AppUserRole.EDUCATOR ? "Educator" : "Student"}
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No {defaultRole === AppUserRole.EDUCATOR ? "educators" : "students"} found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>{user.mobile_number || "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditUser(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeleteUser(user)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabValue>(
    tabParam === "students" ? "students" : "educators",
  );

  useEffect(() => {
    if (tabParam === "students" || tabParam === "educators") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [educatorsSearch, setEducatorsSearch] = useState("");
  const [studentsSearch, setStudentsSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data: educators = [], isLoading: educatorsLoading } = useQuery(
    getUsersQueryOptions({
      search: educatorsSearch || undefined,
      role: AppUserRole.EDUCATOR,
    }),
  );

  const { data: students = [], isLoading: studentsLoading } = useQuery(
    getUsersQueryOptions({
      search: studentsSearch || undefined,
      role: AppUserRole.STUDENT,
    }),
  );

  const deleteUser = useDeleteUserMutation({
    onSuccess: () => {
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCreateEducator = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleCreateStudent = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Users</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          const tab = v as TabValue;
          setActiveTab(tab);
          setSearchParams(tab === "educators" ? {} : { tab: "students" });
        }}
      >
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="educators" className="gap-2">
            <School className="h-4 w-4" />
            Educators
          </TabsTrigger>
          <TabsTrigger value="students" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="educators" className="mt-6">
          <UsersTable
            users={educators}
            search={educatorsSearch}
            onSearchChange={setEducatorsSearch}
            onCreateUser={handleCreateEducator}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            defaultRole={AppUserRole.EDUCATOR}
            isLoading={educatorsLoading}
          />
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <UsersTable
            users={students}
            search={studentsSearch}
            onSearchChange={setStudentsSearch}
            onCreateUser={handleCreateStudent}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            defaultRole={AppUserRole.STUDENT}
            isLoading={studentsLoading}
          />
        </TabsContent>
      </Tabs>

      <UserDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        user={selectedUser}
        defaultRole={activeTab === "educators" ? AppUserRole.EDUCATOR : AppUserRole.STUDENT}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete user{" "}
              <strong>{userToDelete?.name || userToDelete?.email || userToDelete?.id}</strong>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
