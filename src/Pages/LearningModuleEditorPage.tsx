import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  getUnitsQueryOptions,
  useCreateUnitMutation,
  useDeleteUnitMutation,
  useUpdateUnitMutation,
} from "@/Features/Units/query-options";
import {
  getChaptersQueryOptions,
  useCreateChapterMutation,
  useDeleteChapterMutation,
  useUpdateChapterMutation,
} from "@/Features/Chapters/query-options";
import {
  getLessonsQueryOptions,
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useUpdateLessonMutation,
} from "@/Features/Lessons/query-options";
import {
  getActivitiesQueryOptions,
  useCreateActivityMutation,
  useDeleteActivityMutation,
  useUpdateActivityMutation,
} from "@/Features/Activities/query-options";
import { Button } from "@/Shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Shared/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Shared/components/ui/dialog";
import { Input } from "@/Shared/components/ui/input";
import { Label } from "@/Shared/components/ui/label";
import { Textarea } from "@/Shared/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Shared/components/ui/table";
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

export default function LearningModuleEditorPage() {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="font-bold text-3xl">Learning Module Editor</h1>
        <p className="text-muted-foreground">
          Map Pillars (units) → Chapters → Lessons → Activities
        </p>
      </div>

      <UnitsSection
        selectedUnitId={selectedUnitId}
        onSelectUnit={setSelectedUnitId}
        onClearUnit={() => {
          setSelectedUnitId(null);
          setSelectedChapterId(null);
          setSelectedLessonId(null);
        }}
      />
      {selectedUnitId && (
        <ChaptersSection
          unitId={selectedUnitId}
          selectedChapterId={selectedChapterId}
          onSelectChapter={setSelectedChapterId}
          onClearChapter={() => {
            setSelectedChapterId(null);
            setSelectedLessonId(null);
          }}
        />
      )}
      {selectedChapterId && (
        <LessonsSection
          chapterId={selectedChapterId}
          selectedLessonId={selectedLessonId}
          onSelectLesson={setSelectedLessonId}
        />
      )}
      {selectedLessonId && (
        <ActivitiesSection lessonId={selectedLessonId} />
      )}
    </div>
  );
}

function UnitsSection({
  selectedUnitId,
  onSelectUnit,
  onClearUnit,
}: {
  selectedUnitId: string | null;
  onSelectUnit: (id: string | null) => void;
  onClearUnit: () => void;
}) {
  const { data: units = [] } = useQuery(getUnitsQueryOptions());
  const createUnit = useCreateUnitMutation({
    onSuccess: () => toast.success("Unit created"),
    onError: (e) => toast.error(e.message),
  });
  const updateUnit = useUpdateUnitMutation({
    onSuccess: () => toast.success("Unit updated"),
    onError: (e) => toast.error(e.message),
  });
  const deleteUnit = useDeleteUnitMutation({
    onSuccess: () => {
      toast.success("Unit deleted");
      onClearUnit();
    },
    onError: (e) => toast.error(e.message),
  });
  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setDialog("add");
  };
  const openEdit = (u: { id: string; name: string; description: string | null }) => {
    setEditingId(u.id);
    setName(u.name);
    setDescription(u.description ?? "");
    setDialog("edit");
  };
  const save = () => {
    if (dialog === "add") {
      createUnit.mutate({ name, description: description || null });
      setDialog(null);
    } else if (dialog === "edit" && editingId) {
      updateUnit.mutate({
        id: editingId,
        updates: { name, description: description || null },
      });
      setDialog(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pillars (Units)</CardTitle>
        <CardDescription>Create and edit units. Select one to manage chapters.</CardDescription>
        <Button onClick={openAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add unit
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.map((u) => (
              <TableRow
                key={u.id}
                className={selectedUnitId === u.id ? "bg-muted/50" : ""}
              >
                <TableCell>
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    onClick={() =>
                      onSelectUnit(selectedUnitId === u.id ? null : u.id)
                    }
                  >
                    {u.name}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.description ?? "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(u)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(u.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "add" ? "Add unit" : "Edit unit"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete unit?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the unit and may affect chapters, lessons, and activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteUnit.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function ChaptersSection({
  unitId,
  selectedChapterId,
  onSelectChapter,
  onClearChapter,
}: {
  unitId: string;
  selectedChapterId: string | null;
  onSelectChapter: (id: string | null) => void;
  onClearChapter: () => void;
}) {
  const { data: chapters = [] } = useQuery(getChaptersQueryOptions(unitId));
  const createChapter = useCreateChapterMutation({
    onSuccess: () => toast.success("Chapter created"),
    onError: (e) => toast.error(e.message),
  });
  const updateChapter = useUpdateChapterMutation({
    onSuccess: () => toast.success("Chapter updated"),
    onError: (e) => toast.error(e.message),
  });
  const deleteChapter = useDeleteChapterMutation({
    onSuccess: () => {
      toast.success("Chapter deleted");
      onClearChapter();
    },
    onError: (e) => toast.error(e.message),
  });
  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setSortOrder(chapters.length);
    setDialog("add");
  };
  const openEdit = (c: {
    id: string;
    name: string;
    description: string | null;
    sort_order: number;
  }) => {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description ?? "");
    setSortOrder(c.sort_order);
    setDialog("edit");
  };
  const save = () => {
    if (dialog === "add") {
      createChapter.mutate({
        unit_id: unitId,
        name,
        description: description || null,
        sort_order: sortOrder,
      });
      setDialog(null);
    } else if (dialog === "edit" && editingId) {
      updateChapter.mutate({
        id: editingId,
        updates: { name, description: description || null, sort_order: sortOrder },
      });
      setDialog(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapters</CardTitle>
        <CardDescription>Select a chapter to manage lessons.</CardDescription>
        <Button onClick={openAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add chapter
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters.map((c) => (
              <TableRow
                key={c.id}
                className={selectedChapterId === c.id ? "bg-muted/50" : ""}
              >
                <TableCell>{c.sort_order}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    onClick={() =>
                      onSelectChapter(selectedChapterId === c.id ? null : c.id)
                    }
                  >
                    {c.name}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.description ?? "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "add" ? "Add chapter" : "Edit chapter"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the chapter and its lessons and activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteChapter.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function LessonsSection({
  chapterId,
  selectedLessonId,
  onSelectLesson,
}: {
  chapterId: string;
  selectedLessonId: string | null;
  onSelectLesson: (id: string | null) => void;
}) {
  const { data: lessons = [] } = useQuery(getLessonsQueryOptions(chapterId));
  const createLesson = useCreateLessonMutation({
    onSuccess: () => toast.success("Lesson created"),
    onError: (e) => toast.error(e.message),
  });
  const updateLesson = useUpdateLessonMutation({
    onSuccess: () => toast.success("Lesson updated"),
    onError: (e) => toast.error(e.message),
  });
  const deleteLesson = useDeleteLessonMutation({
    onSuccess: () => toast.success("Lesson deleted"),
    onError: (e) => toast.error(e.message),
  });
  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setSortOrder(lessons.length);
    setDialog("add");
  };
  const openEdit = (l: {
    id: string;
    name: string;
    description: string | null;
    sort_order: number;
  }) => {
    setEditingId(l.id);
    setName(l.name);
    setDescription(l.description ?? "");
    setSortOrder(l.sort_order);
    setDialog("edit");
  };
  const save = () => {
    if (dialog === "add") {
      createLesson.mutate({
        chapter_id: chapterId,
        name,
        description: description || null,
        sort_order: sortOrder,
      });
      setDialog(null);
    } else if (dialog === "edit" && editingId) {
      updateLesson.mutate({
        id: editingId,
        updates: { name, description: description || null, sort_order: sortOrder },
      });
      setDialog(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons</CardTitle>
        <CardDescription>Select a lesson to manage activities.</CardDescription>
        <Button onClick={openAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add lesson
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((l) => (
              <TableRow
                key={l.id}
                className={selectedLessonId === l.id ? "bg-muted/50" : ""}
              >
                <TableCell>{l.sort_order}</TableCell>
                <TableCell>
                  <button
                    type="button"
                    className="font-medium hover:underline"
                    onClick={() =>
                      onSelectLesson(selectedLessonId === l.id ? null : l.id)
                    }
                  >
                    {l.name}
                  </button>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {l.description ?? "—"}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(l)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(l.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "add" ? "Add lesson" : "Edit lesson"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the lesson and its activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteLesson.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function ActivitiesSection({ lessonId }: { lessonId: string }) {
  const { data: activities = [] } = useQuery(getActivitiesQueryOptions(lessonId));
  const createActivity = useCreateActivityMutation({
    onSuccess: () => toast.success("Activity created"),
    onError: (e) => toast.error(e.message),
  });
  const updateActivity = useUpdateActivityMutation({
    onSuccess: () => toast.success("Activity updated"),
    onError: (e) => toast.error(e.message),
  });
  const deleteActivity = useDeleteActivityMutation({
    onSuccess: () => toast.success("Activity deleted"),
    onError: (e) => toast.error(e.message),
  });
  const [dialog, setDialog] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setUrl("");
    setSortOrder(activities.length);
    setDialog("add");
  };
  const openEdit = (a: {
    id: string;
    name: string;
    description: string | null;
    url: string | null;
    sort_order: number;
  }) => {
    setEditingId(a.id);
    setName(a.name);
    setDescription(a.description ?? "");
    setUrl(a.url ?? "");
    setSortOrder(a.sort_order);
    setDialog("edit");
  };
  const save = () => {
    if (dialog === "add") {
      createActivity.mutate({
        lesson_id: lessonId,
        name,
        description: description || null,
        url: url.trim() || null,
        sort_order: sortOrder,
      });
      setDialog(null);
    } else if (dialog === "edit" && editingId) {
      updateActivity.mutate({
        id: editingId,
        updates: {
          name,
          description: description || null,
          url: url.trim() || null,
          sort_order: sortOrder,
        },
      });
      setDialog(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activities</CardTitle>
        <CardDescription>
          Add activities (e.g. Google Sheets/Docs links). Students will see and submit work here.
        </CardDescription>
        <Button onClick={openAdd} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add activity
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.sort_order}</TableCell>
                <TableCell>
                  <span className="font-medium">{a.name}</span>
                  {a.description && (
                    <p className="text-muted-foreground text-xs">{a.description}</p>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {a.url ? (
                    <a
                      href={a.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => setDeleteId(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={dialog !== null} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "add" ? "Add activity" : "Edit activity"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label>URL (e.g. Google Doc/Sheet)</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Sort order</Label>
              <Input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialog(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={!name.trim()}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete activity?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the activity. Student submissions for it will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteId && deleteActivity.mutate(deleteId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
