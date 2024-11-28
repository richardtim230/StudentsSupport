const quill = new Quill('#noteEditor', { theme: 'snow' });
const defaultCategories = ["Personal", "Academic", "Miscellaneous"];
let selectedCategory = "Personal";

const motivationalMessages = [
  "Keep pushing forward!", "Believe in yourself!", "Every day is a new opportunity to succeed!",
  "You are capable of amazing things!", "Never stop learning, because life never stops teaching.",
  "Success is not the key to happiness. Happiness is the key to success.",
  "Dream big, work hard, and make it happen.", "Don’t watch the clock; do what it does. Keep going.",
  "Learn from yesterday, live for today, hope for tomorrow.", "Education is the passport to the future.",
  "The only limit to your impact is your imagination and commitment.", "Strive for progress, not perfection.",
  "Education is not preparation for life; education is life itself.", "The harder you work, the luckier you get.",
  "Success is no accident; it’s hard work and persistence.", "The secret to success is to never stop learning.",
  "Chase excellence, and success will follow.", "Work smarter, not harder, and achieve greatness.",
  "Every failure is a step closer to success.", "Your education is your superpower."
];

document.addEventListener('DOMContentLoaded', () => {
  displayWelcomePopup();
  loadNotes();
  showCategory("Personal");
});

function displayWelcomePopup() {
  const studentName = localStorage.getItem('studentName') || prompt("Enter your name:");
  localStorage.setItem('studentName', studentName);
  document.getElementById('welcomeMessage').textContent = `Hello, ${studentName}!`;
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  document.getElementById('motivationalMessage').textContent = randomMessage;
  document.getElementById('welcomePopup').style.display = 'flex';
}

function closeWelcomePopup() {
  document.getElementById('welcomePopup').style.display = 'none';
}

function loadNotes() {
  const notesList = document.getElementById('notesList');
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesList.innerHTML = notes
    .filter(note => note.category === selectedCategory)
    .map((note, index) => `
      <li>
        <div onclick="popupNote(${index})" style="cursor: pointer;">
          <strong>${note.title || 'Untitled Note'}</strong>
        </div>
      </li>`).join('');
}

function saveNote() {
  const text = quill.root.innerHTML.trim();
  const title = prompt("Enter a title for your note:");
  const mediaInput = document.getElementById('noteMedia').files[0];
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const reader = new FileReader();
  reader.onload = () => {
    notes.push({ title, text, media: reader.result, category: selectedCategory });
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
    quill.root.innerHTML = '';
    document.getElementById('noteMedia').value = '';
  };
  if (mediaInput) reader.readAsDataURL(mediaInput);
  else {
    notes.push({ title, text, media: null, category: selectedCategory });
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
    quill.root.innerHTML = '';
    document.getElementById('noteMedia').value = '';
  }
}

function popupNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = notes[index];
  document.getElementById('noteTitle').textContent = note.title || 'Untitled Note';
  document.getElementById('noteContent').innerHTML = note.text + (note.media ? `<img src="${note.media}" alt="Note Media">` : '');
  document.getElementById('notePopup').style.display = 'flex';
}

function closeNotePopup() {
  document.getElementById('notePopup').style.display = 'none';
}

function showCategory(category) {
  selectedCategory = category;
  loadNotes();
}
