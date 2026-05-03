import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Trash2, Send, Loader2 } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export default function ProjectNotes({ project }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const data = await base44.entities.Note.filter({ project_id: project.id }, "-created_date");
    setNotes(data);
    setLoading(false);
  };

  const addNote = async () => {
    if (!text.trim()) return;
    setSaving(true);
    const note = await base44.entities.Note.create({ project_id: project.id, content: text.trim() });
    setNotes([note, ...notes]);
    setText("");
    setSaving(false);
  };

  const deleteNote = async (id) => {
    await base44.entities.Note.delete(id);
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-display font-semibold">Anotações do Projeto</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Registre observações, decisões e próximos passos.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Textarea
          placeholder="Escreva uma anotação..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) addNote(); }}
        />
        <div className="flex justify-end">
          <Button onClick={addNote} disabled={saving || !text.trim()} size="sm" className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Adicionar nota
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhuma anotação ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div key={note.id} className="p-4 bg-card border border-border rounded-xl group relative">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{note.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {note.created_by} · {moment(note.created_date).fromNow()}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}