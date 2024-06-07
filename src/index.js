import './style/styles.css';
document.getElementById('addNoteForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const noteData = {
        title: formData.get('judul'),
        body: formData.get('isi')
    };

    // Kirim data ke API
    fetch('https://notes-api.dicoding.dev/v2/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
    })
    .then(response => response.json())
    .then(data => {
        // Tambahkan catatan baru ke daftar catatan
        const notesContainer = document.getElementById('notesContainer');
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.body}</p>
        `;
        notesContainer.appendChild(noteElement);

        // Reset form
        document.getElementById('addNoteForm').reset();
    })
    .catch(error => console.error('Error adding note:', error));
});
class NoteNavbar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav style="background-color: #496989; color: white; text-align: center;">
                <h1>Note App Js</h1>
            </nav>
        `;
    }
}

customElements.define('note-navbar', NoteNavbar);


class NoteForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <form id="addNoteForm">
                <label for="judul">Judul:</label>
                <input type="text" id="judul" name="judul">
                <label for="isi">Isi:</label>
                <textarea id="isi" name="isi"></textarea>
                <button type="submit">Tambah Catatan</button>
            </form>
        `;
        this.querySelector('form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const formData = new FormData(this);
            const noteData = {
                title: formData.get('judul'),
                body: formData.get('isi')
            };

            // Kirim data ke API
            fetch('https://notes-api.dicoding.dev/v2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(noteData),
            })
            .then(response => response.json())
            .then(data => {
                // Tambahkan catatan baru ke daftar catatan
                const notesContainer = document.getElementById('notesContainer');
                const noteElement = document.createElement('div');
                noteElement.classList.add('note');
                noteElement.innerHTML = `
                    <h2>${data.title}</h2>
                    <p>${data.body}</p>
                `;
                notesContainer.appendChild(noteElement);

                // Reset form
                document.getElementById('addNoteForm').reset();
            })
            .catch(error => console.error('Error adding note:', error));
        });
    }
}

class NoteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2024 Notes App Dicoding. SIFAA</p>
            </footer>
        `;
    }
}
customElements.define('note-footer', NoteFooter);


customElements.define('note-form', NoteForm);
// Fetch data dari API
fetch('https://notes-api.dicoding.dev/v2')
    .then(response => response.json())
    .then(data => {
        const notesContainer = document.getElementById('notesContainer');
        data.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.innerHTML = `
                <h2>${note.title}</h2>
                <p>${note.body}</p>
            `;
            notesContainer.appendChild(noteElement);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

    import './styles.css';

const API_URL = 'https://notes-api.dicoding.dev/v2';

document.addEventListener('DOMContentLoaded', () => {
  const addNoteForm = document.getElementById('addNoteForm');
  const notesContainer = document.getElementById('notesContainer');

  const showLoading = () => {
    notesContainer.innerHTML = '<p>Loading...</p>';
  };

  const hideLoading = () => {
    notesContainer.innerHTML = '';
  };

  const getNotes = async () => {
    showLoading();
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      hideLoading();
      if (data.data.length > 0) {
        data.data.forEach(note => {
          const noteElement = document.createElement('div');
          noteElement.classList.add('note');
          noteElement.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.body}</p>
            <button data-id="${note.id}" class="delete-note">Delete</button>
          `;
          notesContainer.appendChild(noteElement);
        });
      } else {
        notesContainer.innerHTML = '<p>No notes found.</p>';
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async (title, body) => {
    showLoading();
    try {
      await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, body }),
      });
      getNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    showLoading();
    try {
      await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
      });
      getNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  addNoteForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = event.target.noteTitle.value;
    const content = event.target.noteContent.value;
    addNote(title, content);
  });

  notesContainer.addEventListener('click', event => {
    if (event.target.classList.contains('delete-note')) {
      const noteId = event.target.getAttribute('data-id');
      deleteNote(noteId);
    }
  });

  getNotes();
});
