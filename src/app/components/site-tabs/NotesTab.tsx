"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  AllCommunityModule,
  ICellRendererParams,
} from "ag-grid-community";
import { themeQuartz } from "ag-grid-community";
import { Plus, NotePencil } from "@phosphor-icons/react";
import { SiteDetails } from "../SiteDetailsModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

export interface Note {
  id: number;
  createdDate: string;
  createdBy: string;
  comment: string;
  priority: "Low" | "Medium" | "High";
  category: "General" | "Maintenance" | "Safety" | "Delivery" | "Operations";
  status: "Open" | "In Review" | "Closed";
  closedDate?: string;
  closedBy?: string;
  closingComment?: string;
}

interface NotesTabProps {
  site: SiteDetails;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export default function NotesTab({ site, notes, setNotes }: NotesTabProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editForm, setEditForm] = useState<{
    status: "Open" | "In Review" | "Closed";
    closingComment: string;
  }>({
    status: "Open",
    closingComment: ""
  });

  const [newNote, setNewNote] = useState<{
    comment: string;
    priority: Note["priority"];
    category: Note["category"];
  }>({
    comment: "",
    priority: "Medium",
    category: "General"
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.comment.trim()) return;

    const note: Note = {
      id: Math.max(...notes.map(n => n.id), 0) + 1, // Generate next available ID
      createdDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      createdBy: "Current User", // In real app, this would come from authentication
      comment: newNote.comment,
      priority: newNote.priority,
      category: newNote.category,
      status: "Open" // New notes are always Open
    };

    setNotes([note, ...notes]);
    setNewNote({ comment: "", priority: "Medium", category: "General" });
    setOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setEditForm({
      status: note.status,
      closingComment: ""
    });
    setEditOpen(true);
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    // Validate closing comment if status is being changed to Closed
    if (editForm.status === "Closed" && !editForm.closingComment.trim()) {
      alert("Please provide a closing comment when closing a note.");
      return;
    }

    setNotes(notes.map(note => {
      if (note.id === selectedNote.id) {
        const updatedNote = { 
          ...note, 
          status: editForm.status 
        };
        
        // Add close information when closing a note
        if (editForm.status === "Closed") {
          updatedNote.closedDate = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          updatedNote.closedBy = "Current User"; // In real app, this would come from authentication
          updatedNote.closingComment = editForm.closingComment;
        } else if (note.status === "Closed" && (editForm.status === "Open" || editForm.status === "In Review")) {
          // Remove close information if reopening
          delete updatedNote.closedDate;
          delete updatedNote.closedBy;
          delete updatedNote.closingComment;
        }
        
        return updatedNote;
      }
      return note;
    }));

    setEditOpen(false);
    setSelectedNote(null);
    setEditForm({ status: "Open", closingComment: "" });
  };

  const openNotes = notes.filter(note => note.status !== "Closed");

  // Edit button cell renderer
  const ActionButtonsRenderer = (params: ICellRendererParams) => {
    const note = params.data;
    return (
      <div className="flex items-center justify-center h-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEditNote(note)}
          className="p-1 h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <NotePencil size={14} />
        </Button>
      </div>
    );
  };

  // Status cell renderer
  const StatusCellRenderer = (params: ICellRendererParams) => {
    const status = params.value as "Open" | "In Review" | "Closed";
    const colorClass = {
      Open: "bg-green-100 text-green-700",
      "In Review": "bg-yellow-100 text-yellow-700",
      Closed: "bg-gray-100 text-gray-700"
    }[status] || "bg-gray-100 text-gray-700";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  // Priority cell renderer
  const PriorityCellRenderer = (params: ICellRendererParams) => {
    const priority = params.value as "High" | "Medium" | "Low";
    const colorClass = {
      High: "bg-red-100 text-red-700",
      Medium: "bg-yellow-100 text-yellow-700",
      Low: "bg-green-100 text-green-700"
    }[priority] || "bg-gray-100 text-gray-700";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {priority}
      </span>
    );
  };

  // Category cell renderer
  const CategoryCellRenderer = (params: ICellRendererParams) => {
    const category = params.value as "General" | "Maintenance" | "Safety" | "Delivery" | "Operations";
    const colorClass = {
      General: "bg-blue-100 text-blue-700",
      Maintenance: "bg-orange-100 text-orange-700",
      Safety: "bg-red-100 text-red-700",
      Delivery: "bg-green-100 text-green-700",
      Operations: "bg-purple-100 text-purple-700"
    }[category] || "bg-gray-100 text-gray-700";

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {category}
      </span>
    );
  };

  // Column definitions
  const columnDefs: ColDef[] = [
    {
      field: "createdDate",
      headerName: "Created Date",
      flex: 1,
      minWidth: 140,
      cellClass: "text-sm",
      comparator: (valueA: string, valueB: string) => {
        const dateA = new Date(valueA.replace(' ', 'T'));
        const dateB = new Date(valueB.replace(' ', 'T'));
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      minWidth: 120,
      cellClass: "text-sm font-medium",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.8,
      minWidth: 100,
      cellRenderer: CategoryCellRenderer,
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0.8,
      minWidth: 100,
      cellRenderer: PriorityCellRenderer,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      field: "closedDate",
      headerName: "Closed Date",
      flex: 1,
      minWidth: 140,
      cellClass: "text-sm text-gray-600",
      valueFormatter: (params) => params.value || "-",
      comparator: (valueA: string, valueB: string) => {
        if (!valueA && !valueB) return 0;
        if (!valueA) return 1;
        if (!valueB) return -1;
        const dateA = new Date(valueA.replace(' ', 'T'));
        const dateB = new Date(valueB.replace(' ', 'T'));
        return dateA.getTime() - dateB.getTime();
      }
    },
    {
      field: "closedBy",
      headerName: "Closed By",
      flex: 1,
      minWidth: 120,
      cellClass: "text-sm text-gray-600",
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "closingComment",
      headerName: "Closing Comment",
      flex: 2,
      minWidth: 200,
      cellClass: "text-sm text-gray-600 italic",
      autoHeight: true,
      cellStyle: { 
        whiteSpace: 'normal',
        lineHeight: '1.4',
        paddingTop: '8px',
        paddingBottom: '8px'
      },
      valueFormatter: (params) => params.value || "-",
    },
    {
      field: "comment",
      headerName: "Comment",
      flex: 2.5,
      minWidth: 250,
      cellClass: "text-sm",
      autoHeight: true,
      cellStyle: { 
        whiteSpace: 'normal',
        lineHeight: '1.4',
        paddingTop: '8px',
        paddingBottom: '8px'
      },
    },
    {
      headerName: "Actions",
      flex: 1,
      minWidth: 120,
      cellRenderer: ActionButtonsRenderer,
      sortable: false,
      filter: false,
    },
  ];

  // Grid options
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Add Note Button */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <NotePencil size={24} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Site Notes</h3>
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {notes.length} total
            </span>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              {openNotes.length} open
            </span>
          </div>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Note</DialogTitle>
              <DialogDescription>
                Add a note for {site.siteName}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <select
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value as Note["category"] })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="General">General</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Safety">Safety</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-medium text-gray-700">
                  Priority
                </Label>
                <select
                  id="priority"
                  value={newNote.priority}
                  onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as Note["priority"] })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
                  Comment *
                </Label>
                <textarea
                  id="comment"
                  value={newNote.comment}
                  onChange={(e) => setNewNote({ ...newNote, comment: e.target.value })}
                  placeholder="Enter your note..."
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Note</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 overflow-hidden">
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact
            rowData={notes}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            rowHeight={60}
            headerHeight={45}
            suppressMenuHide={true}
            theme={themeQuartz}
            onGridReady={(params: GridReadyEvent) => {
              params.api.sizeColumnsToFit();
            }}
          />
        </div>
      </div>

      {/* Edit Note Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note Status</DialogTitle>
            <DialogDescription>
              Update the status of this note
              {selectedNote?.status === "Closed" && selectedNote.closingComment && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Current closing comment:</strong> {selectedNote.closingComment}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStatusUpdate} className="space-y-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <select
                id="status"
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Note["status"] })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Review">In Review</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {editForm.status === "Closed" && (
              <div>
                <Label htmlFor="closingComment" className="text-sm font-medium text-gray-700">
                  Closing Comment *
                </Label>
                <textarea
                  id="closingComment"
                  value={editForm.closingComment}
                  onChange={(e) => setEditForm({ ...editForm, closingComment: e.target.value })}
                  placeholder="Please provide a reason for closing this note..."
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setEditOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Status</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
