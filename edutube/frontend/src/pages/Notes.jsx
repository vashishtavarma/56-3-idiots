import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getNotesByJourney, getNotesByChapter } from '../Api/notes';
import { getJourneyById } from '../Api/journeys';
import { getChaptersByJourneyId } from '../Api/chapters';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/* Download icon (inline SVG – no external request) */
const IconDownload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

/** Force node and all descendants to use hex colors so html2canvas (no oklch support) can parse */
function forceHexColors(node, bg = '#ffffff', text = '#000000', border = '#e5e7eb') {
  if (!node) return;
  if (node.style) {
    node.style.backgroundColor = bg;
    node.style.color = text;
    node.style.borderColor = border;
  }
  try {
    const doc = node.ownerDocument || node;
    if (doc.body) {
      doc.body.style.backgroundColor = bg;
      doc.body.style.color = text;
    }
    if (doc.documentElement) {
      doc.documentElement.style.backgroundColor = bg;
      doc.documentElement.style.color = text;
    }
    Array.from(node.children || []).forEach((child) => forceHexColors(child, bg, text, border));
  } catch (_) {}
}

const Notes = () => {
  const { journeyId } = useParams();
  const [searchParams] = useSearchParams();
  const chapterId = searchParams.get('chapterId'); // When set, show only this chapter's notes
  const [notes, setNotes] = useState([]);
  const [jData, setJData] = useState({});
  const [chapterTitle, setChapterTitle] = useState(null);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    if (!journeyId) return;
    setError(null);
    try {
      const fetchJourney = await getJourneyById(journeyId);
      setJData(fetchJourney || {});

      if (chapterId) {
        // Per-chapter: only this video's notes (others not visible)
        const chapterNotes = await getNotesByChapter(chapterId);
        setNotes(Array.isArray(chapterNotes) ? chapterNotes : []);
        const chapters = await getChaptersByJourneyId(journeyId);
        const ch = (chapters || []).find((c) => c.id === chapterId);
        setChapterTitle(ch?.title || null);
      } else {
        // Playlist-level: all notes for this playlist (all PDFs)
        const journeyNotes = await getNotesByJourney(journeyId);
        setNotes(Array.isArray(journeyNotes) ? journeyNotes : []);
        setChapterTitle(null);
      }
    } catch (err) {
      setError('Failed to fetch notes');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [journeyId, chapterId]);

  // Function to handle PDF generation and download (html2canvas does not support oklch, so we force hex in clone)
  const downloadPDF = () => {
    const input = document.getElementById('notesContent');
    if (!input) return;

    html2canvas(input, {
      useCORS: true,
      onclone: (clonedDoc, clonedEl) => {
        // html2canvas doesn't support oklch; inject override so computed styles are hex
        const style = clonedDoc.createElement('style');
        style.textContent = `
          *, *::before, *::after {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #e5e7eb !important;
          }
          .bg-muted\\/40, .bg-muted\\/60 { background-color: #f3f4f6 !important; }
          .prose, .prose * { color: #000000 !important; }
        `;
        clonedDoc.head.appendChild(style);
        if (clonedDoc.body) {
          clonedDoc.body.style.backgroundColor = '#ffffff';
          clonedDoc.body.style.color = '#000000';
        }
        forceHexColors(clonedEl, '#f9fafb', '#000000', '#e5e7eb');
      },
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        const base = chapterTitle ? `${jData.title || 'Notes'}_${chapterTitle}` : (jData.title || 'Notes');
        pdf.save(`${base}_Notes.pdf`);
      })
      .catch((err) => {
        console.error('PDF export failed:', err);
        alert('Could not generate PDF. Please try again.');
      });
  };

  const descriptionText =
    chapterId && chapterTitle
      ? `${chapterTitle} · ${jData?.title || 'Journey'}`
      : jData?.title
        ? `All notes & PDFs for "${jData.title}"`
        : 'Journey notes';

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <section className="px-4 py-6 md:py-8">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Nav links only – clear row, no mixing with description */}
          <div className="flex flex-wrap items-center gap-4">
            {chapterId && (
              <Link
                to={`/notes/${journeyId}`}
                className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:underline"
              >
                View all playlist notes
              </Link>
            )}
            <Link
              to={journeyId ? `/journey/${journeyId}` : '/'}
              className="inline-flex items-center text-sm font-medium text-primary transition-colors hover:underline"
            >
              ← Back to playlist
            </Link>
          </div>

          {/* Description in its own card */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 md:px-5 md:py-4">
            <p className="text-sm text-muted-foreground md:text-base">{descriptionText}</p>
          </div>

          {/* Main content card */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {chapterId ? 'Chapter notes' : 'Playlist notes'}
            </h1>

            {error && (
              <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {notes.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium text-foreground">
                  No notes yet
                </p>
                <p className="mt-1 text-muted-foreground">
                  {chapterId
                    ? (chapterTitle ? `No notes for "${chapterTitle}".` : 'No notes for this chapter.')
                    : `No notes for ${jData?.title ? `"${jData.title}"` : 'this journey'} yet.`}
                </p>
                <Link
                  to={journeyId ? `/journey/${journeyId}` : '/'}
                  className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back to playlist
                </Link>
              </div>
            )}

            {notes.length > 0 && !error && (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={downloadPDF}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-0"
                  >
                    <IconDownload className="h-5 w-5 shrink-0" />
                    Download PDF
                  </button>
                </div>

                <div id="notesContent" className="mt-6 space-y-6">
                  <h2 className="sr-only">Notes content</h2>
                  <div className="space-y-6">
                    {notes.map((note) => (
                      <article
                        key={note.id}
                        className="rounded-xl border border-border bg-muted/40 p-6 transition-colors hover:bg-muted/60"
                      >
                        {note.title && (
                          <h3 className="mb-3 text-lg font-semibold text-foreground">
                            {note.title}
                          </h3>
                        )}
                        <div
                          className={`prose prose-sm max-w-none text-foreground md:prose-base ${note.title ? 'mt-2' : ''}`}
                          dangerouslySetInnerHTML={{ __html: note.content || '' }}
                          onClick={(e) => {
                            if (e.target.tagName === 'A') {
                              e.preventDefault();
                              const href = e.target.getAttribute('href');
                              if (href) window.open(href, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        />
                        <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
                          Created: {note.created_at ? new Date(note.created_at).toLocaleString() : '—'}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Notes;
