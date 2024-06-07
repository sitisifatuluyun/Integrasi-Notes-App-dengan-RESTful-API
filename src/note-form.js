
class NoteForm extends HTMLElement {
  constructor() {
    super();
 
    this.innerHTML = `<form id="addNoteForm">
    <label for="noteTitle">Title:</label>
    <input type="text" id="noteTitle" name="noteTitle" required>
    <label for="noteContent">Content:</label>
    <textarea id="noteContent" name="noteContent" required></textarea>
    <button type="submit">Add Note</button>
    </form>`;
  }
}
 
customElements.define('note-form', NoteForm);
// note-form.js

// Fungsi untuk menambahkan catatan baru
async function addNote() {
    const title = document.getElementById('titleInput').value;
    const content = document.getElementById('contentInput').value;

    const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
        // Refresh daftar catatan setelah berhasil menambahkan catatan baru
        getNotes();
    } else {
        console.error('Gagal menambahkan catatan');
    }
}

// Fungsi untuk mengambil dan menampilkan daftar catatan
async function getNotes() {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    const data = await response.json();

    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '';

    data.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <button onclick="deleteNote('${note.id}')">Hapus</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}

// Fungsi untuk menghapus catatan
async function deleteNote(noteId) {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        // Refresh daftar catatan setelah berhasil menghapus catatan
        getNotes();
    } else {
        console.error('Gagal menghapus catatan');
    }
}

// Panggil fungsi getNotes() saat halaman dimuat untuk pertama kali
document.addEventListener('DOMContentLoaded', () => {
    getNotes();
});
