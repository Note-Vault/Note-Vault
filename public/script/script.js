console.log("Public script file")
function openUpdateModal(noteId) {
    // Find the modal element by its ID
    if(noteId === 'add-note-modal'){
      const modal = document.getElementById(noteId);
      modal.style.display = "block";
    }
    else{
      const modal = document.getElementById(`updateModal${noteId}`);
      // Open the modal
      modal.style.display = "block";
    }
  }
  
function closeUpdateModal(noteId) {
    // Find the modal element by its ID
    if(noteId === 'add-note-modal'){
      const modal = document.getElementById(noteId);
      // Close the modal
      modal.style.display = "none";
    }
    else{
      const modal = document.getElementById(`updateModal${noteId}`);
      // Close the modal
      modal.style.display = "none";
    }
}
  